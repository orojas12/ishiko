import { oidc, sessionManager } from "@/lib";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const session = await sessionManager.validateSession();

    if (session) {
        redirect("/");
    }

    const { url, state, codeVerifier } = await oidc.getAuthorizationUrl();
    const response = new NextResponse(null, {
        status: 302,
        headers: {
            Location: url.toString(),
        },
    });

    response.cookies.set(`${oidc.config.providerId}-state`, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 1000,
    });

    if (codeVerifier) {
        response.cookies.set("codeVerifier", codeVerifier, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 1000,
        });
    }

    return response;
}
