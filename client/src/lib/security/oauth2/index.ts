export type OAuth2KeySchema = {
    id: string;
    user_id: string;
    provider_id: string;
    provider_user_id: string;
};

export type OAuth2Key = {
    id: string;
    userId: string;
    providerId: string;
    providerUserId: string;
};

export type OAuth2TokenSetSchema = {
    id: string;
    oauth2_key_id: string;
    access_token: string;
    access_token_expires: string;
    refresh_token?: string;
    refresh_token_expires?: string;
};

export type OAuth2TokenSet = {
    id: string;
    accessToken: {
        value: string;
        expires: Date;
    };
    refreshToken?: {
        value: string;
        expires: Date;
    };
};

export type JWTClaims = Record<string, any> & {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    jti: string;
};

export type OAuth2TokenResponse = {
    token_type: string;
    access_token: string;
    expires_in: number;
    scope?: string;
    refresh_token?: string;
    id_token: string;
};
