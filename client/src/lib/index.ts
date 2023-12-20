import { AuthenticationMethod } from "./oauth2/providers";
import { DatabaseSessionManager, SQLiteSessionDao } from "@/lib/oauth2/session";
import Database from "better-sqlite3";

import type { ProviderConfig } from "./oauth2/providers";
import { OidcProvider } from "./oauth2/providers/OidcProvider";

const db = new Database(":memory:");

const config: ProviderConfig = {
    providerId: "ishiko",
    redirectUri: "http://localhost:3000/oidc/code",
    authorizationEndpoint: "http://localhost:8080/oauth2/authorize",
    tokenEndpoint: "http://localhost:8080/oauth2/token",
    client: {
        id: "ishiko-client",
        secret: "secret",
        authenticationMethod: AuthenticationMethod.HTTP_BASIC,
    },
    scope: [],
    usePKCE: true,
};

export const sessionManager = new DatabaseSessionManager(
    new SQLiteSessionDao(db),
);

export const oidc = new OidcProvider(config);
