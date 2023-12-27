import { oidc } from "@/lib";

import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
    const response = oidc.handlePostLogoutRedirect(request, "/");
    response.cookies.delete("session");
    return response;
}
