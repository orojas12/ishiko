import { NextRequest, NextResponse } from "next/server";
import { RequestMiddleware } from ".";

export class LoggingMiddleware implements RequestMiddleware {
    handleRequest = (request: NextRequest) => {
        console.log("middleware logger: ", request.nextUrl.pathname);
    };
}
