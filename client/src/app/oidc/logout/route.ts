import { oidc, sessionManager } from "@/lib";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const session = await sessionManager.validateSession();

    if (!session) {
        return NextResponse.redirect(`${process.env.BASE_URL}/error`);
    }

    return oidc.oidcLogoutRedirect(session.tokens.idToken);
}
