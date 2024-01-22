import { DatabaseSessionManager, SQLiteSessionDao } from "@/lib/oauth2/session";
import { sessionConfig } from "@/config/session";
import { db } from "@/db";
import { OidcProvider } from "@/lib/oauth2/providers/OidcProvider";
import { ishikoProviderConfig } from "@/config/oauth";

export const sessionManager = new DatabaseSessionManager(
    new SQLiteSessionDao(db),
    sessionConfig
);

export const oidc = new OidcProvider(ishikoProviderConfig);
