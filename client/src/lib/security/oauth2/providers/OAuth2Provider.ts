import { OAuth2TokenSetDao } from "../token";
import { OAuth2KeyDao } from "../key";
import { RowNotFoundError } from "../error";
import { UserDao } from "../../user";
import { decodeJwt } from "../util";
import {
    createOAuth2AuthorizationUrlWithPKCE,
    validateOAuth2AuthorizationCode,
} from "@lucia-auth/oauth";
import { nanoid } from "nanoid";

import type { ProviderConfig } from "./";
import type { JWTClaims, OAuth2TokenResponse, OAuth2TokenSet } from "../token";
import type { User } from "../../user";

export class OAuth2Provider {
    readonly config: ProviderConfig;
    readonly tokenDao: OAuth2TokenSetDao;
    readonly keyDao: OAuth2KeyDao;
    readonly userDao: UserDao;

    constructor(
        config: ProviderConfig,
        tokenDao: OAuth2TokenSetDao,
        keyDao: OAuth2KeyDao,
        userDao: UserDao,
    ) {
        this.config = config;
        this.tokenDao = tokenDao;
        this.keyDao = keyDao;
        this.userDao = userDao;
    }

    exchangeCode = async (
        code: string,
    ): Promise<
        OAuth2TokenSet & {
            idToken: { value: string; claims: JWTClaims };
        }
    > => {
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
        const decodedIdToken = decodeJwt(data.id_token);
        return {
            id: nanoid(),
            accessToken: {
                value: data.access_token,
                expires: new Date(Date.now() + data.expires_in * 1000),
            },
            refreshToken: data.refresh_token
                ? {
                      value: data.refresh_token,
                      expires: new Date(
                          decodeJwt(data.refresh_token).exp * 1000,
                      ),
                  }
                : undefined,
            idToken: {
                value: data.id_token,
                claims: decodedIdToken,
            },
        };
    };

    getAuthorizationUrl = async (): Promise<
        readonly [url: URL, codeVerifier: string, state: string]
    > => {
        return createOAuth2AuthorizationUrlWithPKCE(
            this.config.authorizationEndpoint,
            {
                clientId: this.config.client.id,
                scope: this.config.scope,
                codeChallengeMethod: "S256",
                redirectUri: this.config.redirectUri,
            },
        );
    };

    createTokenSet = async (
        tokens: OAuth2TokenSet,
        providerId: string,
        providerUserId: string,
    ): Promise<OAuth2TokenSet> => {
        const key = await this.keyDao.getKey(providerId, providerUserId);
        if (!key) {
            throw new RowNotFoundError(
                `No oauth2 key found for ${providerId}:${providerUserId}`,
            );
        }
        return this.tokenDao.createTokenSet(key.id, tokens);
    };

    updateTokenSet = async (
        tokens: OAuth2TokenSet,
    ): Promise<OAuth2TokenSet> => {
        if (await this.tokenDao.tokenSetExists(tokens.id)) {
            return this.tokenDao.updateTokenSet(tokens);
        } else {
            throw new RowNotFoundError(
                `No token set found for id: ${tokens.id}`,
            );
        }
    };

    getUserByOAuth2Key = async (
        providerId: string,
        providerUserId: string,
    ): Promise<User | null> => {
        return this.userDao.getUserByOAuth2Key(providerId, providerUserId);
    };

    createUserWithOAuth2Key = async (
        providerId: string,
        providerUserId: string,
        user: Omit<User, "id">,
    ) => {
        return this.userDao.createUserWithOAuth2Key(
            providerId,
            providerUserId,
            user,
        );
    };
}
