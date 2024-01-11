import { logger, oidc, sessionManager } from "@/lib";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const session = await sessionManager.validateSession();

    if (!session) {
        const redirectUrl = `${process.env.BASE_URL}`;
        logger.debug("No session found, skipping logout");
        logger.debug(`Redirecting to ${redirectUrl}`);
        return NextResponse.redirect(redirectUrl);
    }

    return oidc.oidcLogoutRedirect(session.tokens.idToken);
}
