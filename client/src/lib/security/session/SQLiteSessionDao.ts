import type { Database, RunResult } from "better-sqlite3";
import type { SessionDao } from "./SessionDao";
import { SqliteError } from "better-sqlite3";
import { Session, SessionSchema } from "./types";
import { RowNotFoundError } from "../oauth2/error";

export class SQLiteSessionDao implements SessionDao {
    db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    getSession = async (sessionId: string): Promise<Session | null> => {
        const result = this.db
            .prepare(
                `
                SELECT s.id, s.expires, s.user_id, u.username 
                FROM session s 
                INNER JOIN user u ON s.user_id = u.id
                WHERE s.id = ?;
                `,
            )
            .get(sessionId) as
            | (SessionSchema & { username: string })
            | undefined;
        if (!result) return null;
        return {
            id: result.id,
            user: {
                id: result.user_id,
                username: result.username,
            },
            expires: new Date(result.expires),
        };
    };

    createSession = async (session: Session): Promise<void> => {
        try {
            this.db
                .prepare(
                    `
                INSERT INTO session (id, user_id, expires)
                VALUES (?, ?, ?);
                `,
                )
                .run(
                    session.id,
                    session.user.id,
                    session.expires.toISOString(),
                );
        } catch (error) {
            if (
                error instanceof SqliteError &&
                error.code === "SQLITE_CONSTRAINT_FOREIGNKEY"
            ) {
                throw new RowNotFoundError(
                    `User id: ${session.user.id} not found`,
                );
            }
        }
    };

    updateSession = async (session: Session): Promise<void> => {
        let info: RunResult;
        try {
            info = this.db
                .prepare(
                    `
                UPDATE session
                SET
                    id = ?,
                    user_id = ?,
                    expires = ?
                WHERE id = ?;
                `,
                )
                .run(
                    session.id,
                    session.user.id,
                    session.expires.toISOString(),
                    session.id,
                );
        } catch (error) {
            if (
                error instanceof SqliteError &&
                error.code === "SQLITE_CONSTRAINT_FOREIGNKEY"
            ) {
                throw new RowNotFoundError(
                    `user id: ${session.user.id} not found`,
                );
            } else {
                throw error;
            }
        }
        if (info.changes === 0) {
            throw new RowNotFoundError(`session id: ${session.id} not found`);
        }
    };

    deleteSession = async (sessionId: string): Promise<void> => {
        this.db
            .prepare(
                `
                DELETE FROM session WHERE id = ?;
                `,
            )
            .run(sessionId);
    };

    deleteAllUserSessions = async (userId: string): Promise<void> => {
        this.db
            .prepare(
                `
                DELETE FROM session WHERE user_id = ?
                `,
            )
            .run(userId);
    };
}
