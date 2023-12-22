import {
    createOAuth2AuthorizationUrl,
    createOAuth2AuthorizationUrlWithPKCE,
    validateOAuth2AuthorizationCode,
} from "@lucia-auth/oauth";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { OAuth2TokenResponse, ProviderConfig } from "./";
import type { OAuth2TokenSet } from "..";
import {
    InvalidCodeError,
    InvalidCodeVerifierError,
    InvalidStateError,
} from "../error";

export class OAuth2Provider {
    readonly config: ProviderConfig;

    constructor(config: ProviderConfig) {
        this.config = config;
    }

    handleAuthorizationCodeRedirect = async (
        request: NextRequest,
    ): Promise<OAuth2TokenSet> => {
        const [code, codeVerifier] =
            this.validateAuthorizationCodeRedirect(request);

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
            refreshToken: data.refresh_token,
        };
    };

    authorizeEndpointRedirect = async (): Promise<NextResponse> => {
        const { url, state, codeVerifier } = await this.getAuthorizationUrl();
        const response = new NextResponse(null, {
            status: 302,
            headers: {
                Location: url.toString(),
            },
        });

        // TODO: change state and code_verifier cookie maxAge to a more
        // appropriate value
        response.cookies.set(`${this.config.providerId}-state`, state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 1000,
        });

        if (codeVerifier) {
            response.cookies.set("codeVerifier", codeVerifier, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 1000,
            });
        }

        return response;
    };

    validateAuthorizationCodeRedirect = (request: NextRequest) => {
        const url = new URL(request.url);
        const storedState = request.cookies.get(
            `${this.config.providerId}-state`,
        )?.value;
        const codeVerifier = request.cookies.get("codeVerifier")?.value;
        const state = url.searchParams.get("state");
        const code = url.searchParams.get("code");

        if (!storedState) {
            throw new InvalidStateError("'state' cookie is empty or null");
        }

        if (!state) {
            throw new InvalidStateError("'state' parameter is empty or null");
        }

        if (!code) {
            throw new InvalidCodeError("'code' parameter is empty or null");
        }

        if (!codeVerifier) {
            throw new InvalidCodeVerifierError(
                "'code_verifier' cookie is empty or null",
            );
        }

        if (storedState !== state) {
            throw new InvalidStateError(
                "'state' cookie and 'state' parameter values do not match",
            );
        }

        return [code, codeVerifier];
    };

    getAuthorizationUrl = async (): Promise<{
        url: URL;
        state: string;
        codeVerifier?: string;
    }> => {
        let authUrl: readonly [URL, string, string?];

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
                state: authUrl[2] as string,
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
