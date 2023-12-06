import { OAuth2TokenResponse, OAuth2TokenSet, OAuth2TokenSetSchema } from "..";
import { ProviderConfig } from "../providers/config";
import { validateOAuth2AuthorizationCode } from "@lucia-auth/oauth";
import { decodeJwt } from "../utils";

export type OAuth2TokenSetDao = {
    getTokenSet: (
        providerId: string,
        providerUserId: string,
    ) => OAuth2TokenSet | Promise<OAuth2TokenSet>;
    createTokenSet: (
        tokens: Omit<OAuth2TokenSetSchema, "id">,
    ) => OAuth2TokenSet | Promise<OAuth2TokenSet>;
};

export class OAuth2TokenManager {
    readonly config: ProviderConfig;
    readonly tokenDao: OAuth2TokenSetDao;

    constructor(config: ProviderConfig, tokenDao: OAuth2TokenSetDao) {
        this.config = config;
        this.tokenDao = tokenDao;
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
        return this.tokenDao.createTokenSet({
            oauth2_key_id:
                this.config.providerId + ":" + decodeJwt(data.id_token).sub,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            id_token: data.id_token,
        });
    };
}
