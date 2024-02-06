import { oidc, sessionManager } from "@/auth";
import { logger } from "@/log";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const session = await sessionManager.validateSession();

    if (session) {
        logger.debug(`Found session ${session.id}, skipping login`);
        logger.debug(`Redirecting to /`);
        redirect("/");
    }

    return oidc.authorizeEndpointRedirect();
}
