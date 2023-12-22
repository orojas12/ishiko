import { oidc, sessionManager } from "@/lib";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const session = await sessionManager.validateSession();

    if (session) {
        redirect("/");
    }

    return oidc.authorizeEndpointRedirect();
}
