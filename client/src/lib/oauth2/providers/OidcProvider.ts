import { validateOAuth2AuthorizationCode } from "@lucia-auth/oauth";

import { OAuth2Provider, type ProviderConfig } from "./";
import type { OidcTokenResponse } from "./";
import type { OidcTokenSet } from "../";
import { NextResponse, type NextRequest } from "next/server";
import { generateRandomString } from "../util";
import { InvalidStateError } from "../error";
import { logger } from "@/lib";

export class OidcProvider extends OAuth2Provider {
    constructor(config: ProviderConfig) {
        if (!config.scope.includes("openid")) {
            throw new TypeError(
                "'scope' must include 'openid' when using OpenID Connect 1.0"
            );
        }
        super(config);
    }

    handleAuthorizationCodeRedirect = async (
        request: NextRequest
    ): Promise<OidcTokenSet> => {
        const [code, codeVerifier] =
            this.validateAuthorizationCodeRedirect(request);

        logger.debug(`Fetching token set at ${this.config.tokenEndpoint}`);
        const data: OidcTokenResponse = await validateOAuth2AuthorizationCode(
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
            }
        );
        logger.debug("Fetched token set");

        return {
            accessToken: {
                value: data.access_token,
                expires: new Date(Date.now() + data.expires_in * 1000),
            },
            refreshToken: data.refresh_token,
            idToken: data.id_token,
        };
    };

    oidcLogoutRedirect = (idToken: string) => {
        if (!this.config.logoutEndpoint) {
            throw TypeError(
                "'logoutEndpoint' must be specified to use RP-Initiated Logout"
            );
        }

        const url = new URL(this.config.logoutEndpoint);
        const state = generateRandomString(8);

        url.searchParams.set("id_token_hint", idToken);
        url.searchParams.set("client_id", this.config.client.id);
        url.searchParams.set("state", state);

        if (this.config.postLogoutRedirectUri) {
            url.searchParams.set(
                "post_logout_redirect_uri",
                this.config.postLogoutRedirectUri
            );
        }

        const response = new NextResponse(null, {
            status: 302,
            headers: {
                Location: url.toString(),
            },
        });

        response.cookies.set("logout-state", state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 10 * 1000,
        });
        return response;
    };

    handlePostLogoutRedirect = (request: NextRequest, redirectUri: string) => {
        this.validatePostLogoutRedirect(request);

        const response = new NextResponse(null, {
            status: 302,
            headers: {
                Location: redirectUri,
            },
        });

        response.cookies.delete("logout-state");
        return response;
    };

    validatePostLogoutRedirect = (request: NextRequest) => {
        const state = request.nextUrl.searchParams.get("state");
        const storedState = request.cookies.get("logout-state")?.value;

        if (!state) {
            throw new InvalidStateError("'state' parameter is empty or null");
        }
        if (!storedState) {
            throw new InvalidStateError(
                "'logout-state' cookie is empty or null"
            );
        }
        if (state !== storedState) {
            throw new InvalidStateError(
                "'state' parameter and 'logout-state' cookie do not match"
            );
        }
    };
}
