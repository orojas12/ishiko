import type { Database } from "better-sqlite3";
import type { OAuth2KeyDao } from ".";
import type { OAuth2Key, OAuth2KeySchema } from "..";
import { SqliteError } from "better-sqlite3";
import { nanoid } from "nanoid";
import { DuplicateRowError } from "../error";

export class SQLiteKeyDao implements OAuth2KeyDao {
    db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    getKey = (providerId: string, providerUserId: string): OAuth2Key | null => {
        const result = this.db
            .prepare(
                `
            SELECT id, user_id, provider_id, provider_user_id
            FROM oauth2_key
            WHERE provider_id = ? AND provider_user_id = ?;
            `,
            )
            .get(providerId, providerUserId) as OAuth2KeySchema | undefined;
        if (!result) return null;
        return {
            id: result.id,
            userId: result.user_id,
            providerId: result.provider_id,
            providerUserId: result.provider_user_id,
        };
    };

    createKey = (
        providerId: string,
        providerUserId: string,
        userId: string,
    ): OAuth2Key => {
        const keyId = nanoid();
        try {
            this.db
                .prepare(
                    `
            INSERT INTO oauth2_key 
                (id, user_id, provider_id, provider_user_id)
            VALUES (?, ?, ?, ?);
            `,
                )
                .run(keyId, userId, providerId, providerUserId);
            const result = this.db
                .prepare(
                    `
            SELECT id, user_id, provider_id, provider_user_id
            FROM oauth2_key
            WHERE id = ?
            `,
                )
                .get(keyId) as OAuth2KeySchema;
            return {
                id: result.id,
                userId: result.user_id,
                providerId: result.provider_id,
                providerUserId: result.provider_user_id,
            };
        } catch (error) {
            if (
                error instanceof SqliteError &&
                error.code === "SQLITE_CONSTRAINT_UNIQUE"
            ) {
                throw new DuplicateRowError();
            } else {
                throw error;
            }
        }
    };
}
