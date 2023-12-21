export type JWTClaims = Record<string, any> & {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    jti: string;
};

export type OAuth2TokenSet = {
    accessToken: {
        value: string;
        expires: Date;
    };
    refreshToken?: string;
};

export type OidcTokenSet = OAuth2TokenSet & {
    idToken: string;
};

export type TokenSetSchema = {
    token_set_id: string;
    session_id: string;
    access_token: string;
    access_token_expires: string;
    refresh_token?: string;
    id_token?: string;
};

export type ProfileSchema = {
    profile_id: string;
    session_id: string;
    name: string;
    first_name: string;
    last_name: string;
};

export type Profile = {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
};
