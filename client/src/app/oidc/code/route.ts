import { oidc, sessionManager } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

import { decodeJwt } from "@/lib/oauth2/util";

export async function GET(request: NextRequest) {
    // TODO: handle validation errors
    const tokenSet = await oidc.handleAuthorizationCodeRedirect(request);
    const idToken = decodeJwt(tokenSet.idToken);

    const session = await sessionManager.createSession(tokenSet, {
        id: idToken.sub,
        name: idToken.name,
        firstName: idToken.given_name,
        lastName: idToken.family_name,
    });

    const response = NextResponse.redirect("http://localhost:3000/");
    response.cookies.set("session", session.id);
    response.cookies.delete("codeVerifier");
    response.cookies.delete(`${oidc.config.providerId}-state`);
    return response;
}
