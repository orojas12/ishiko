import type { Database } from "better-sqlite3";
import type { OAuth2TokenSetDao } from "./token";
import { AccessTokenClaims, OAuth2TokenSet, OAuth2TokenSetSchema } from "..";
import { nanoid } from "nanoid";
import { decodeJwt } from "../utils";

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
        accessToken: string,
        refreshToken: string | null,
    ): OAuth2TokenSet => {
        const tokenSetId = nanoid();
        const decodedAccessToken = decodeJwt(accessToken);
        const decodedRefreshToken = refreshToken
            ? decodeJwt(refreshToken)
            : null;

        this.db
            .prepare(
                `
                INSERT INTO oauth2_token_set
                (
                    id, access_token, access_token_expires, refresh_token,
                    refresh_token_expires
                )
                VALUES (?, ?, ?, ?, ?);
                `,
            )
            .run(
                tokenSetId,
                accessToken,
                new Date(decodedAccessToken.exp).toISOString(),
                refreshToken,
                decodedRefreshToken
                    ? new Date(decodedRefreshToken.exp).toISOString()
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
            .get(tokenSetId) as OAuth2TokenSetSchema;
        return this.generateTokenSet(result);
    };

    getTokenSet = (tokenSetId: string): OAuth2TokenSet | undefined => {
        const result = this.db
            .prepare(
                `
                SELECT 
                    id, access_token, access_token_expires, 
                    refresh_token, refresh_token_expires
                FROM oauth2_token_set
                WHERE id = ?
                `,
            )
            .get(tokenSetId) as OAuth2TokenSetSchema;
        return this.generateTokenSet(result);
    };

    tokenSetExists = (oauth2KeyId: string): boolean => {
        return Boolean(
            this.db
                .prepare(
                    "SELECT 1 FROM oauth2_token WHERE oauth2_key_id = ? LIMIT 1;",
                )
                .get(oauth2KeyId) as any,
        );
    };

    generateTokenSet = (tokens: OAuth2TokenSetSchema) => {
        return {
            accessToken: {
                value: tokens.access_token,
                claims: decodeJwt(tokens.access_token) as AccessTokenClaims,
                expires: new Date(tokens.access_token_expires),
            },
            refreshToken:
                tokens.refresh_token && tokens.refresh_token_expires
                    ? {
                          value: tokens.refresh_token,
                          claims: decodeJwt(tokens.refresh_token),
                          expires: new Date(tokens.refresh_token_expires),
                      }
                    : undefined,
        };
    };
}
