export type ProviderConfig = {
    providerId: string;
    authorizationEndpoint: string;
    tokenEndpoint: string;
    userInfoEndpoint?: string;
    redirectUri: string;
    client: {
        id: string;
        secret: string;
        authenticationMethod: AuthenticationMethod;
    };
    scope: string[];
    usePKCE: boolean;
};

export enum AuthenticationMethod {
    HTTP_BASIC = "http_basic_auth",
    CLIENT_SECRET = "client_secret",
}
