import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const csrfToken = request.cookies.get("XSRF-TOKEN")?.value;
    console.log(csrfToken);
    const headers = new Headers(request.headers) as Headers & Map<string, any>;
    headers.set("X-XSRF-TOKEN", csrfToken);
    const response = NextResponse.next({
        request: {
            headers: headers,
        },
    });
    return response;
}
