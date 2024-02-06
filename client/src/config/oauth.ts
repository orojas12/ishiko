import { AuthenticationMethod, ProviderConfig } from "@/lib/oauth2/providers";

export const ishikoProviderConfig: ProviderConfig = {
    providerId: "ishiko",
    redirectUri: `${process.env.BASE_URL}/oidc/code`,
    authorizationEndpoint: `${process.env.BASE_URL}/api/oauth2/authorize`,
    tokenEndpoint: `${process.env.API_URL}/api/oauth2/token`,
    logoutEndpoint: `${process.env.BASE_URL}/api/oidc/logout`,
    postLogoutRedirectUri: `${process.env.BASE_URL}/oidc/post-logout`,
    client: {
        id: "ishiko-client",
        secret: "secret",
        authenticationMethod: AuthenticationMethod.HTTP_BASIC,
    },
    scope: ["openid"],
    usePKCE: true,
    debug: true,
};
