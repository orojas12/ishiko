import { decodeJwt } from "../util";
import { validateOAuth2AuthorizationCode } from "@lucia-auth/oauth";

import { OAuth2Provider, type ProviderConfig } from "./";
import type { OidcTokenResponse } from "./";
import type { OidcTokenSet } from "../";

export class OidcProvider extends OAuth2Provider {
    constructor(config: ProviderConfig) {
        super(config);
    }

    exchangeCode = async (
        code: string,
        codeVerifier?: string,
    ): Promise<OidcTokenSet> => {
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
        // TODO: id_token is undefined
        const idToken = decodeJwt(data.id_token);
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
            idToken: idToken,
        };
    };
}
