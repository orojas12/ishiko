import type { Database } from "better-sqlite3";
import type { OAuth2TokenSetDao } from "./token";
import { OAuth2AccessToken, OAuth2TokenSet, OAuth2TokenSetSchema } from "..";
import { nanoid } from "nanoid";
import { decodeJwt } from "../utils";

export class SQLiteTokenDao implements OAuth2TokenSetDao {
    db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    createTokenSet = (
        tokens: Omit<OAuth2TokenSetSchema, "id">,
    ): OAuth2TokenSet => {
        this.db
            .prepare("INSERT INTO oauth2_token VALUES (?, ?, ?, ?, ?);")
            .run(
                nanoid(),
                tokens.oauth2_key_id,
                tokens.access_token,
                tokens.refresh_token || null,
                tokens.id_token || null,
            );
        const result = this.db
            .prepare(
                `
            SELECT oauth2_key_id, access_token, refresh_token, id_token 
            FROM oauth2_token 
            WHERE oauth2_key_id = ?;
            `,
            )
            .get(tokens.oauth2_key_id) as OAuth2TokenSetSchema;
        return {
            accessToken: {
                value: result.access_token,
                claims: decodeJwt(result.access_token) as OAuth2AccessToken,
            },
            refreshToken: result.refresh_token
                ? {
                      value: result.refresh_token,
                      claims: decodeJwt(result.refresh_token),
                  }
                : undefined,
        };
    };

    getTokenSet = (
        providerId: string,
        providerUserId: string,
    ): OAuth2TokenSet | Promise<OAuth2TokenSet> => {
        const result = this.db
            .prepare(
                `
                SELECT oauth2_key_id, access_token, refresh_token, id_token
                FROM oauth2_token
                WHERE oauth2_key_id = ?
                `,
            )
            .get(providerId + ":" + providerUserId) as OAuth2TokenSetSchema;
        return {
            accessToken: {
                value: result.access_token,
                claims: decodeJwt(result.access_token) as OAuth2AccessToken,
            },
            refreshToken: result.refresh_token
                ? {
                      value: result.refresh_token,
                      claims: decodeJwt(result.refresh_token),
                  }
                : undefined,
        };
    };
}
