import {
    OAuth2AccessToken,
    OAuth2TokenResponse,
    OAuth2TokenSet,
    OAuth2TokenSetSchema,
} from ".";
import { ProviderConfig } from "./providers/config";
import { validateOAuth2AuthorizationCode } from "@lucia-auth/oauth";
import type { Database } from "better-sqlite3";
import { nanoid } from "nanoid";
import { decodeJwt } from "./utils";

export type OAuth2TokenSetDao = {
    getTokenSet: (
        providerId: string,
        providerUserId: string,
    ) => OAuth2TokenSet | Promise<OAuth2TokenSet>;
    createTokenSet: (
        tokens: OAuth2TokenSetSchema,
    ) => OAuth2TokenSet | Promise<OAuth2TokenSet>;
};

export class OAuth2TokenManager {
    readonly config: ProviderConfig;

    constructor(config: ProviderConfig) {
        this.config = config;
    }

    exchangeCode = async (code: string): Promise<OAuth2TokenSet> => {
        const data: OAuth2TokenResponse = await validateOAuth2AuthorizationCode(
            code,
            this.config.tokenEndpoint,
            {
                clientId: this.config.client.id,
                redirectUri: this.config.redirectUri,
                codeVerifier: "",
                clientPassword: {
                    clientSecret: this.config.client.secret,
                    authenticateWith: this.config.client.authenticationMethod,
                },
            },
        );
    };
}

export class SQLiteTokenDao implements OAuth2TokenSetDao {
    db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    createTokenSet = (tokens: OAuth2TokenSetSchema): OAuth2TokenSet => {
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
}
