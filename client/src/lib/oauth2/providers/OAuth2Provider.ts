import { decodeJwt } from "../util";
import {
    createOAuth2AuthorizationUrl,
    createOAuth2AuthorizationUrlWithPKCE,
    validateOAuth2AuthorizationCode,
} from "@lucia-auth/oauth";

import type { OAuth2TokenResponse, ProviderConfig } from "./";
import type { OAuth2TokenSet } from "..";

export class OAuth2Provider {
    readonly config: ProviderConfig;

    constructor(config: ProviderConfig) {
        this.config = config;
    }

    exchangeCode = async (
        code: string,
        codeVerifier?: string,
    ): Promise<OAuth2TokenSet> => {
        const data: OAuth2TokenResponse = await validateOAuth2AuthorizationCode(
            code,
            this.config.tokenEndpoint,
            {
                clientId: this.config.client.id,
                redirectUri: this.config.redirectUri,
                codeVerifier: codeVerifier,
                clientPassword: {
                    clientSecret: this.config.client.secret,
                    authenticateWith: this.config.client.authenticationMethod,
                },
            },
        );
        return {
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
        };
    };

    getAuthorizationUrl = async (): Promise<{
        url: URL;
        state: string;
        codeVerifier?: string;
    }> => {
        let authUrl: readonly [URL, string, string] | readonly [URL, string];

        if (this.config.usePKCE) {
            authUrl = await createOAuth2AuthorizationUrlWithPKCE(
                this.config.authorizationEndpoint,
                {
                    clientId: this.config.client.id,
                    scope: this.config.scope,
                    codeChallengeMethod: "S256",
                    redirectUri: this.config.redirectUri,
                },
            );
            return {
                url: authUrl[0],
                codeVerifier: authUrl[1],
                state: authUrl[2],
            };
        } else {
            authUrl = await createOAuth2AuthorizationUrl(
                this.config.authorizationEndpoint,
                {
                    clientId: this.config.client.id,
                    scope: this.config.scope,
                    redirectUri: this.config.redirectUri,
                },
            );
            return {
                url: authUrl[0],
                state: authUrl[1],
            };
        }
    };
}
