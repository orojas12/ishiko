import { validateOAuth2AuthorizationCode } from "@lucia-auth/oauth";

import { OAuth2Provider, type ProviderConfig } from "./";
import type { OidcTokenResponse } from "./";
import type { OidcTokenSet } from "../";
import type { NextRequest } from "next/server";

export class OidcProvider extends OAuth2Provider {
    constructor(config: ProviderConfig) {
        if (!config.scope.includes("openid")) {
            throw new TypeError(
                "'scope' parameter must include 'openid' when using OpenID Connect 1.0",
            );
        }
        super(config);
    }

    handleAuthorizationCodeRedirect = async (
        request: NextRequest,
    ): Promise<OidcTokenSet> => {
        const [code, codeVerifier] =
            this.validateAuthorizationCodeRedirect(request);

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
            },
        );
        return {
            accessToken: {
                value: data.access_token,
                expires: new Date(Date.now() + data.expires_in * 1000),
            },
            refreshToken: data.refresh_token,
            idToken: data.id_token,
        };
    };
}
