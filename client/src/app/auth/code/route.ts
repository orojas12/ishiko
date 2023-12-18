import { oauth2, sessionManager } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

import type { OidcTokenSet } from "@/lib/security/oauth2/token";
import type { User } from "@/lib/security/user";
import type { Session } from "@/lib/security/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const storedState = request.cookies.get(`${oauth2.config.providerId}-state`)
        ?.value;
    const codeVerifier = request.cookies.get("codeVerifier")?.value;
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const errorResponse = NextResponse.redirect(
        "http://localhost:3000/auth/error",
    );
    const { providerId } = oauth2.config;
    let tokenSet: OidcTokenSet;
    let providerUserId: string;
    let user: User | null;
    let session: Session;

    if (!storedState) {
        console.error("State cookie is missing");
        return errorResponse;
    }

    if (!state) {
        console.error("State query parameter is missing");
        return errorResponse;
    }

    if (!code) {
        console.error("Code query parameter is missing");
        return errorResponse;
    }

    if (!codeVerifier) {
        console.error("Code verifier cookie is missing");
        return errorResponse;
    }

    if (storedState !== state) {
        console.error(
            `State cookie and state query parameter do not match: state parameter: ${state}; cookie: ${storedState}`,
        );
    }

    try {
        tokenSet = await oauth2.exchangeCode(code, codeVerifier);
    } catch (e) {
        return errorResponse;
    }

    providerUserId = tokenSet.idToken.claims.sub;

    try {
        user = await oauth2.getUserByOAuth2Key(providerId, providerUserId);
    } catch (e) {
        return errorResponse;
    }

    if (!user) {
        try {
            user = await oauth2.createUserWithOAuth2Key(
                providerId,
                providerUserId,
                oauth2.config.getUserDetailsFromIdToken(
                    tokenSet.idToken.claims,
                ),
            );
        } catch (e) {
            return errorResponse;
        }
    }

    try {
        await oauth2.createTokenSet(tokenSet, providerId, providerUserId);
    } catch (e) {
        return errorResponse;
    }

    try {
        session = await sessionManager.createSession(user.id, {});
    } catch (e) {
        return errorResponse;
    }

    const response = NextResponse.redirect("http://localhost:3000/");
    response.cookies.set("session", session.id);
    return response;
}
