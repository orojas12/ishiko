import { oidc, sessionManager } from "@/lib";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const session = await sessionManager.validateSession();

    if (session) {
        redirect("/");
    }

    return oidc.authorizeEndpointRedirect();
}
