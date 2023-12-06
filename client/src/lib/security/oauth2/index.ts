export type OAuth2KeySchema = {
    id: string;
    user_id: string;
};

export type OAuth2Key = {
    userId: string;
    providerId: string;
    providerUserId: string;
};

export type OAuth2TokenSetSchema = {
    id: string;
    oauth2_key_id: string;
    access_token: string;
    refresh_token?: string;
    id_token: string;
};

export type OAuth2TokenSet = {
    accessToken: {
        value: string;
        claims: OAuth2AccessToken;
    };
    refreshToken?: {
        value: string;
        claims: JWT;
    };
};

export type JWT = Record<string, any> & {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    jti: string;
};

export type OAuth2AccessToken = JWT & {
    client_id: string;
    scope?: string;
};

export type OAuth2TokenResponse = {
    token_type: string;
    access_token: string;
    expires_in: number;
    scope?: string;
    refresh_token?: string;
    id_token: string;
};
