import { oidc, sessionManager } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

import { decodeJwt } from "@/lib/oauth2/util";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const storedState = request.cookies.get(`${oidc.config.providerId}-state`)
        ?.value;
    const codeVerifier = request.cookies.get("codeVerifier")?.value;
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const errorResponse = NextResponse.redirect(
        "http://localhost:3000/auth/error",
    );

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

    const tokenSet = await oidc.exchangeCode(code, codeVerifier);
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
