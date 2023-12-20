export type OAuth2TokenResponse = {
    token_type: string;
    access_token: string;
    expires_in: number;
    scope?: string;
    refresh_token?: string;
};

export type OidcTokenResponse = OAuth2TokenResponse & {
    id_token: string;
};
