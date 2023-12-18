import { oauth2, sessionManager } from "@/lib";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const session = await sessionManager.validateSession();

    if (session) {
        redirect("/");
    }

    const { url, state, codeVerifier } = await oauth2.getAuthorizationUrl();
    const response = new NextResponse(null, {
        status: 302,
        headers: {
            Location: url.toString(),
        },
    });

    response.cookies.set(`${oauth2.config.providerId}-state`, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 1000,
    });

    console.log("CODE_VERIFIER", codeVerifier);

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
