import { DatabaseSessionManager, SQLiteSessionDao } from "@/lib/oauth2/session";
import { logger } from "@/log";
import { sessionConfig } from "@/config/session";
import { db } from "@/db";
import { OidcProvider } from "@/lib/oauth2/providers/OidcProvider";
import { ishikoProviderConfig } from "@/config/oauth";
import { redirect } from "next/navigation";

export const sessionManager = new DatabaseSessionManager(
    new SQLiteSessionDao(db),
    sessionConfig
);

export const oidc = new OidcProvider(ishikoProviderConfig);

export async function authenticate() {
    if (process.env.DISABLE_AUTH === "true") {
        return;
    }
    const session = await sessionManager.validateSession();
    if (!session) {
        logger.debug(`Unauthenticated user`);
        logger.debug(`Redirecting to ${process.env.BASE_URL}/oidc/login`);
        redirect(`${process.env.BASE_URL}/oidc/login`);
    }
    return session;
}
