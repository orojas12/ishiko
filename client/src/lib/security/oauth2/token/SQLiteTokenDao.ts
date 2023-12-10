import type { Database } from "better-sqlite3";
import type { OAuth2TokenSetDao } from "./token";
import { OAuth2TokenSet, OAuth2TokenSetSchema } from "..";
import { RowNotFoundError } from "../error";

export class DuplicateTokenSetError extends Error {
    constructor() {
        super("Token set already exists.");
    }
}

export class SQLiteTokenDao implements OAuth2TokenSetDao {
    db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    createTokenSet = (
        oauth2KeyId: string,
        tokenSet: OAuth2TokenSet,
    ): OAuth2TokenSet => {
        this.db
            .prepare(
                `
                INSERT INTO oauth2_token_set
                (
                    id, oauth2_key_id, access_token, access_token_expires, refresh_token,
                    refresh_token_expires 
                )
                VALUES (?, ?, ?, ?, ?, ?);
                `,
            )
            .run(
                tokenSet.id,
                oauth2KeyId,
                tokenSet.accessToken.value,
                tokenSet.accessToken.expires.toISOString(),
                tokenSet.refreshToken?.value || null,
                tokenSet.refreshToken?.value
                    ? tokenSet.refreshToken.expires.toISOString()
                    : null,
            );
        const result = this.db
            .prepare(
                `
                SELECT 
                    id, access_token, access_token_expires, 
                    refresh_token, refresh_token_expires
                FROM oauth2_token_set 
                WHERE id = ?;
                `,
            )
            .get(tokenSet.id) as OAuth2TokenSetSchema;
        return this.generateTokenSet(result);
    };

    updateTokenSet = (tokens: OAuth2TokenSet): OAuth2TokenSet => {
        const info = this.db
            .prepare(
                `
                UPDATE oauth2_token_set
                SET 
                    access_token = ?,
                    access_token_expires = ?,
                    refresh_token = ?,
                    refresh_token_expires = ?
                WHERE id = ?;
                `,
            )
            .run(
                tokens.accessToken.value,
                tokens.accessToken.expires.toISOString(),
                tokens.refreshToken?.value || null,
                tokens.refreshToken?.value
                    ? tokens.refreshToken.expires.toISOString()
                    : null,
                tokens.id,
            );
        if (info.changes === 0) {
            throw new RowNotFoundError();
        }
        const result = this.db
            .prepare(
                `
                SELECT
                    id, oauth2_key_id, access_token, access_token_expires,
                    refresh_token, refresh_token_expires
                FROM oauth2_token_set
                WHERE id = ?;
                `,
            )
            .get(tokens.id) as OAuth2TokenSetSchema;
        return this.generateTokenSet(result);
    };

    getTokenSetById = (tokenSetId: string): OAuth2TokenSet | null => {
        const result = this.db
            .prepare(
                `
                SELECT 
                    id, access_token, access_token_expires, 
                    refresh_token, refresh_token_expires
                FROM oauth2_token_set
                WHERE id = ?;
                `,
            )
            .get(tokenSetId) as OAuth2TokenSetSchema | undefined;
        if (!result) {
            return null;
        }
        return this.generateTokenSet(result);
    };

    getTokenSetsByKeyId = (
        oauth2KeyId: string,
    ): OAuth2TokenSet[] | undefined => {
        const results = this.db
            .prepare(
                `
                SELECT
                    id, oauth2_key_id, access_token, access_token_expires,
                    refresh_token, refresh_token_expires
                FROM oauth2_token_set
                WHERE oauth2_key_id = ?;
                `,
            )
            .all(oauth2KeyId) as OAuth2TokenSetSchema[];
        return results.map(this.generateTokenSet);
    };

    tokenSetExists = (tokenSetId: string): boolean => {
        return Boolean(
            this.db
                .prepare("SELECT 1 FROM oauth2_token_set WHERE id = ? LIMIT 1;")
                .get(tokenSetId) as any,
        );
    };

    generateTokenSet = (tokens: OAuth2TokenSetSchema) => {
        return {
            id: tokens.id,
            accessToken: {
                value: tokens.access_token,
                expires: new Date(tokens.access_token_expires),
            },
            refreshToken:
                tokens.refresh_token && tokens.refresh_token_expires
                    ? {
                          value: tokens.refresh_token,
                          expires: new Date(tokens.refresh_token_expires),
                      }
                    : undefined,
        };
    };
}
