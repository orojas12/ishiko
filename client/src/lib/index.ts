import { AuthenticationMethod } from "./oauth2/providers";
import { DatabaseSessionManager, SQLiteSessionDao } from "@/lib/oauth2/session";

import type { ProviderConfig } from "./oauth2/providers";
import { OidcProvider } from "./oauth2/providers/OidcProvider";
import { initdb } from "./db";

export const db = initdb(":memory:");

export const config: ProviderConfig = {
    providerId: "ishiko",
    redirectUri: `${process.env.BASE_URL}/oidc/code`,
    authorizationEndpoint: `${process.env.BASE_URL}/api/oauth2/authorize`,
    tokenEndpoint: `${process.env.BASE_URL}/api/oauth2/token`,
    logoutEndpoint: `${process.env.BASE_URL}/api/oidc/logout`,
    postLogoutRedirectUri: `${process.env.BASE_URL}/oidc/post-logout`,
    client: {
        id: "ishiko-client",
        secret: "secret",
        authenticationMethod: AuthenticationMethod.HTTP_BASIC,
    },
    scope: ["openid"],
    usePKCE: true,
};

export const sessionConfig = {
    maxAge: 604800,
};

export const sessionManager = new DatabaseSessionManager(
    new SQLiteSessionDao(db),
    sessionConfig,
);

export const oidc = new OidcProvider(config);
