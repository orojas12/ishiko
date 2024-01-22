import { nanoid } from "nanoid";
import { RowNotFoundError } from "../error";

import type { Database } from "better-sqlite3";
import type { Session, SessionSchema, SessionDao } from "./types";
import type { TokenSetSchema, ProfileSchema } from "../types";

// TODO: add optional sql logging for debug purposes
export class SQLiteSessionDao implements SessionDao {
    db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    getSession = async (sessionId: string): Promise<Session | null> => {
        const result = this.db
            .prepare(
                `
                SELECT s.session_id, expires, access_token, access_token_expires,
                    refresh_token, id_token, profile_id, name,
                    first_name, last_name
                FROM session s
                    INNER JOIN token_set t ON s.session_id = t.session_id
                    INNER JOIN profile u ON s.session_id = u.session_id
                WHERE s.session_id = ?;
                `
            )
            .get(sessionId) as
            | (SessionSchema & TokenSetSchema & ProfileSchema)
            | undefined;
        if (!result) return null;
        return {
            id: result.session_id,
            expires: new Date(result.expires),
            tokens: {
                accessToken: {
                    value: result.access_token,
                    expires: new Date(result.access_token_expires),
                },
                refreshToken: result.refresh_token || undefined,
                idToken: result.id_token as string,
            },
            profile: {
                id: result.profile_id,
                name: result.name,
                firstName: result.first_name,
                lastName: result.last_name,
            },
        };
    };

    createSession = async (session: Session): Promise<void> => {
        const insertNewSession = this.db.transaction(() => {
            this.db
                .prepare(
                    `
                    INSERT INTO session (session_id, expires)
                    VALUES (?, ?);
                    `
                )
                .run(session.id, session.expires.toISOString());
            this.db
                .prepare(
                    `
                    INSERT INTO token_set (token_set_id, session_id,
                        access_token, access_token_expires,
                        refresh_token, id_token)
                    VALUES (?, ?, ?, ?, ?, ?);
                    `
                )
                .run(
                    nanoid(),
                    session.id,
                    session.tokens.accessToken.value,
                    session.tokens.accessToken.expires.toISOString(),
                    session.tokens.refreshToken || null,
                    session.tokens.idToken || null
                );
            this.db
                .prepare(
                    `
                    INSERT INTO profile (profile_id, session_id,
                        name, first_name, last_name)
                    VALUES (?, ?, ?, ?, ?);
                    `
                )
                .run(
                    session.profile.id,
                    session.id,
                    session.profile.name,
                    session.profile.firstName,
                    session.profile.lastName
                );
        });

        insertNewSession();
    };

    updateSession = async (session: Session): Promise<void> => {
        const updateSessionData = this.db.transaction(() => {
            let info = this.db
                .prepare(
                    `
                    UPDATE session
                    SET
                        expires = ?
                    WHERE session_id = ?;
                    `
                )
                .run(session.expires.toISOString(), session.id);
            if (info.changes === 0) {
                throw new RowNotFoundError(
                    `session id: ${session.id} not found`
                );
            }

            info = this.db
                .prepare(
                    `
                    UPDATE token_set
                    SET
                        access_token = ?,
                        access_token_expires = ?,
                        refresh_token = ?,
                        id_token = ?
                    WHERE session_id = ?;
                    `
                )
                .run(
                    session.tokens.accessToken.value,
                    session.tokens.accessToken.expires.toISOString(),
                    session.tokens.refreshToken || null,
                    session.tokens.idToken || null,
                    session.id
                );
            if (info.changes === 0) {
                throw new RowNotFoundError(
                    `token set for session id: ${session.id} not found`
                );
            }

            info = this.db
                .prepare(
                    `
                    UPDATE profile
                    SET
                        name = ?,
                        first_name = ?,
                        last_name = ?
                    WHERE session_id = ?;`
                )
                .run(
                    session.profile.name,
                    session.profile.firstName,
                    session.profile.lastName,
                    session.id
                );
            if (info.changes === 0) {
                throw new RowNotFoundError(
                    `user profile for session id: ${session.id} not found`
                );
            }
        });

        updateSessionData();
    };

    deleteSession = async (sessionId: string): Promise<void> => {
        this.db
            .prepare(
                `
                DELETE FROM session WHERE session_id = ?;
                `
            )
            .run(sessionId);
    };
}
