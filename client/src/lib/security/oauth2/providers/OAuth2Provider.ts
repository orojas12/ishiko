import { validateOAuth2AuthorizationCode } from "@lucia-auth/oauth";
import { JWTClaims, OAuth2TokenResponse, OAuth2TokenSet } from "..";
import { OAuth2KeyDao, OAuth2TokenSetDao } from "../token/token";
import { UserDao } from "../user/user";
import { ProviderConfig } from "./config";
import { decodeJwt } from "../util";
import { nanoid } from "nanoid";

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

    saveTokenSet = async (
        tokens: OAuth2TokenSet,
        oauth2KeyId: string,
    ): Promise<OAuth2TokenSet> => {
        if (this.tokenDao.tokenSetExists(tokens.id)) {
            return this.tokenDao.updateTokenSet(tokens);
        } else {
            return this.tokenDao.createTokenSet(oauth2KeyId, tokens);
        }
    };
}
