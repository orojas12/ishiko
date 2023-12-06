export type ProviderConfig = {
    providerId: string;
    authorizationEndpoint: string;
    tokenEndpoint: string;
    redirectUri: string;
    client: {
        id: string;
        secret: string;
        authenticationMethod: AuthenticationMethod;
    };
    scope: string[];
    checks: "pkce" | "state" | "none";
};

export enum AuthenticationMethod {
    HTTP_BASIC = "http_basic_auth",
    CLIENT_SECRET = "client_secret",
}