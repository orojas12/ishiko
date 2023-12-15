export type OAuth2TokenSetDao = {
    getTokenSetById: (
        tokenSetId: string,
    ) => OAuth2TokenSet | null | Promise<OAuth2TokenSet | null>;
    getAllTokenSetsByKeyId: (
        oauth2KeyId: string,
    ) => OAuth2TokenSet[] | Promise<OAuth2TokenSet[]>;
    createTokenSet: (
        oauth2KeyId: string,
        tokenSet: OAuth2TokenSet,
    ) => OAuth2TokenSet | Promise<OAuth2TokenSet>;
    updateTokenSet: (
        tokenSet: OAuth2TokenSet,
    ) => OAuth2TokenSet | Promise<OAuth2TokenSet>;
    tokenSetExists: (tokenSetId: string) => boolean | Promise<boolean>;
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

export type OidcTokenSet = OAuth2TokenSet & {
    idToken: {
        value: string;
        claims: JWTClaims;
    };
};

export type OAuth2TokenSetSchema = {
    id: string;
    oauth2_key_id: string;
    access_token: string;
    access_token_expires: string;
    refresh_token?: string;
    refresh_token_expires?: string;
};
