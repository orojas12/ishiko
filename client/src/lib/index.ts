import {
    AuthenticationMethod,
    OAuth2Provider,
} from "./security/oauth2/providers";
import { DatabaseSessionManager, SQLiteSessionDao } from "./security/session";
import { SQLiteTokenDao } from "./security/oauth2/token";
import { SQLiteKeyDao } from "./security/oauth2/key";
import { SQLiteUserDao } from "./security/user";
import Database from "better-sqlite3";

import type { ProviderConfig } from "./security/oauth2/providers";

const db = new Database(":memory:");

const config: ProviderConfig = {
    providerId: "ishiko",
    redirectUri: "http://localhost:3000/auth/code",
    authorizationEndpoint: "http://localhost:8080/oauth2/authorize",
    tokenEndpoint: "http://localhost:8080/oauth2/token",
    client: {
        id: "ishiko-client",
        secret: "secret",
        authenticationMethod: AuthenticationMethod.HTTP_BASIC,
    },
    scope: [],
    usePKCE: true,
    getUserDetailsFromIdToken: (idToken: Record<string, any>) => {
        return { username: "user1" };
    },
};

export const sessionManager = new DatabaseSessionManager(
    new SQLiteSessionDao(db),
);

export const oauth2 = new OAuth2Provider(
    config,
    new SQLiteTokenDao(db),
    new SQLiteKeyDao(db),
    new SQLiteUserDao(db),
);
