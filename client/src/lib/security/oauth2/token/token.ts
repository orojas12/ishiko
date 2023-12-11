import {
    JWTClaims,
    OAuth2Key,
    OAuth2TokenResponse,
    OAuth2TokenSet,
    OAuth2TokenSetSchema,
} from "..";
import { ProviderConfig } from "../providers/config";
import { validateOAuth2AuthorizationCode } from "@lucia-auth/oauth";
import { decodeJwt } from "../util";
import { UserDao } from "../user/user";
import { nanoid } from "nanoid";

export type OAuth2TokenSetDao = {
    getTokenSetById: (
        tokenSetId: string,
    ) => OAuth2TokenSet | null | Promise<OAuth2TokenSet | null>;
    getAllTokenSetsByKeyId: (
        oauth2KeyId: string,
    ) => OAuth2TokenSet[] | undefined | Promise<OAuth2TokenSet[] | undefined>;
    createTokenSet: (
        oauth2KeyId: string,
        tokenSet: OAuth2TokenSet,
    ) => OAuth2TokenSet | Promise<OAuth2TokenSet>;
    updateTokenSet: (
        tokenSet: OAuth2TokenSet,
    ) => OAuth2TokenSet | Promise<OAuth2TokenSet>;
    tokenSetExists: (tokenSetId: string) => boolean | Promise<boolean>;
};

export type OAuth2KeyDao = {
    getKeyByProviderAndProviderUser: (
        providerId: string,
        providerUserId: string,
    ) => OAuth2Key | undefined | Promise<OAuth2Key | undefined>;
    createKey: (
        providerId: string,
        providerUserId: string,
        userId: string,
    ) => OAuth2Key | Promise<OAuth2Key>;
};

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
