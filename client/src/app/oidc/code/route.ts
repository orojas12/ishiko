import { logger, oidc, sessionManager } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

import { decodeJwt } from "@/lib/oauth2/util";
import type { OidcTokenSet } from "@/lib/oauth2";

export async function GET(request: NextRequest) {
    // TODO: handle validation errors
    let tokenSet: OidcTokenSet;

    try {
        tokenSet = await oidc.handleAuthorizationCodeRedirect(request);
    } catch (e) {
        logger.error(e);
        logger.debug(`Redirecting to /error`);
        return NextResponse.redirect("/error");
    }

    const idToken = decodeJwt(tokenSet.idToken);

    const session = await sessionManager.createSession(tokenSet, {
        id: idToken.sub,
        name: idToken.name,
        firstName: idToken.given_name,
        lastName: idToken.family_name,
    });

    const response = NextResponse.redirect(`${process.env.BASE_URL}`);
    response.cookies.set("session", session.id);
    response.cookies.delete("codeVerifier");
    response.cookies.delete(`${oidc.config.providerId}-state`);
    logger.debug(`Redirecting to ${process.env.BASE_URL}`);
    return response;
}
