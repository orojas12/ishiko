import { sessionManager } from "@/auth";
import { logger } from "@/log";
import { redirect } from "next/navigation";

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
