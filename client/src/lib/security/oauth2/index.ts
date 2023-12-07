export type OAuth2KeySchema = {
    id: string;
    user_id: string;
    provider_id: string;
    provider_user_id: string;
    token_set_id?: string;
};

export type OAuth2Key = {
    userId: string;
    providerId: string;
    providerUserId: string;
    tokenSetId?: string;
};

export type OAuth2TokenSetSchema = {
    id: string;
    access_token: string;
    access_token_expires: string;
    refresh_token?: string;
    refresh_token_expires?: string;
};

export type OAuth2TokenSet = {
    accessToken: {
        value: string;
        claims: AccessTokenClaims;
        expires: Date;
    };
    refreshToken?: {
        value: string;
        claims: JWTClaims;
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

export type AccessTokenClaims = JWTClaims & {
    client_id: string;
    scope?: string;
};

export type OAuth2TokenResponse = {
    token_type: string;
    access_token: string;
    expires_in: number;
    scope?: string;
    refresh_token?: string;
    id_token?: string;
};
