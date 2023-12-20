export type OAuth2TokenSet = {
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

export type OidcTokenSet = OAuth2TokenSet & {
    idToken: {
        value: string;
        claims: JWTClaims;
    };
};

export type OAuth2TokenSetSchema = {
    token_set_id: string;
    session_id: string;
    access_token: string;
    access_token_expires: string;
    refresh_token?: string;
    refresh_token_expires?: string;
};

export type UserProfileSchema = {
    user_id: string;
    session_id: string;
    name: string;
    first_name: string;
    last_name: string;
};

export type UserProfile = {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
};
