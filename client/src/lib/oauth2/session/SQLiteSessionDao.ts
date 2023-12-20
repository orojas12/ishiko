import { RowNotFoundError } from "../error";

import type { Database } from "better-sqlite3";
import type { Session, SessionSchema, SessionDao } from ".";
import { OAuth2TokenSetSchema, UserProfileSchema } from "..";
import { nanoid } from "nanoid";

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
                    refresh_token, refresh_token_expires, user_id, name,
                    first_name, last_name
                FROM session s
                    INNER JOIN token_set t ON s.session_id = t.session_id
                    INNER JOIN user_profile u ON s.session_id = u.session_id
                WHERE s.session_id = ?;
                `,
            )
            .get(sessionId) as
            | (SessionSchema & OAuth2TokenSetSchema & UserProfileSchema)
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
                refreshToken:
                    result.refresh_token && result.refresh_token_expires
                        ? {
                              value: result.refresh_token,
                              expires: new Date(result.refresh_token_expires),
                          }
                        : undefined,
            },
            profile: {
                id: result.user_id,
                name: result.name,
                firstName: result.first_name,
                lastName: result.last_name,
            },
        };
    };

    createSession = async (session: Session): Promise<void> => {
        const insertData = this.db.transaction(() => {
            this.db
                .prepare(
                    `
                    INSERT INTO session (session_id, expires)
                    VALUES (?, ?);
                    `,
                )
                .run(session.id, session.expires.toISOString());
            this.db
                .prepare(
                    `
                    INSERT INTO token_set (token_set_id, session_id,
                        access_token, access_token_expires,
                        refresh_token, refresh_token_expires)
                    VALUES (?, ?, ?, ?, ?, ?);
                    `,
                )
                .run(
                    nanoid(),
                    session.id,
                    session.tokens.accessToken.value,
                    session.tokens.accessToken.expires.toISOString(),
                    session.tokens.refreshToken?.value || null,
                    session.tokens.refreshToken?.expires.toISOString() || null,
                );
            this.db
                .prepare(
                    `
                    INSERT INTO user_profile (user_id, session_id,
                        name, first_name, last_name)
                    VALUES (?, ?, ?, ?, ?);
                    `,
                )
                .run(
                    session.profile.id,
                    session.id,
                    session.profile.name,
                    session.profile.firstName,
                    session.profile.lastName,
                );
        });

        insertData();
    };

    updateSession = async (session: Session): Promise<void> => {
        const updateData = this.db.transaction(() => {
            let info = this.db
                .prepare(
                    `
                    UPDATE session
                    SET
                        expires = ?
                    WHERE session_id = ?;
                    `,
                )
                .run(session.expires.toISOString(), session.id);
            if (info.changes === 0) {
                throw new RowNotFoundError(
                    `session id: ${session.id} not found`,
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
                        refresh_token_expires = ?
                    WHERE session_id = ?;
                    `,
                )
                .run(
                    session.tokens.accessToken.value,
                    session.tokens.accessToken.expires.toISOString(),
                    session.tokens.refreshToken?.value || null,
                    session.tokens.refreshToken?.expires.toISOString() || null,
                    session.id,
                );
            if (info.changes === 0) {
                throw new RowNotFoundError(
                    `token set for session id: ${session.id} not found`,
                );
            }

            info = this.db
                .prepare(
                    `
                    UPDATE user_profile
                    SET
                        name = ?,
                        first_name = ?,
                        last_name = ?
                    WHERE session_id = ?;`,
                )
                .run(
                    session.profile.name,
                    session.profile.firstName,
                    session.profile.lastName,
                    session.id,
                );
            if (info.changes === 0) {
                throw new RowNotFoundError(
                    `user profile for session id: ${session.id} not found`,
                );
            }
        });

        updateData();
    };

    deleteSession = async (sessionId: string): Promise<void> => {
        this.db
            .prepare(
                `
                DELETE FROM session WHERE session_id = ?;
                `,
            )
            .run(sessionId);
    };
}
