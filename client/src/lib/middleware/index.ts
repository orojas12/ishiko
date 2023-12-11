import { NextRequest, NextResponse } from "next/server";
import { pathToRegexp, match, parse, compile } from "path-to-regexp";

export function setUpMiddleware(middleware: RequestMiddleware[]) {
    const _middleware: _RequestMiddleware[] = setUpWithPathMatchers(middleware);

    return async function (request: NextRequest) {
        let response: NextResponse | void;
        for (let i = 0; i < _middleware.length; i++) {
            if (
                _middleware[i].matches?.(request) ??
                _middleware[i].pathMatches(request.nextUrl.pathname)
            ) {
                response = await _middleware[i].handleRequest(request);
                if (response) {
                    return response;
                }
            }
        }
        return NextResponse.next();
    };
}

export function setUpWithPathMatchers(
    middleware: RequestMiddleware[],
): _RequestMiddleware[] {
    return middleware.map((middleware: RequestMiddleware) => {
        let matchers = middleware.path?.map((path: string) =>
            pathToRegexp(path, undefined, { end: false }),
        );
        return {
            handleRequest: middleware.handleRequest,
            matches: middleware.matches,
            pathMatches: (path: string) => {
                return matchers
                    ? Boolean(matchers?.some((matcher) => matcher.test(path)))
                    : true;
            },
        };
    });
}

export type RequestMiddleware = {
    handleRequest: (request: NextRequest) => Promise<NextResponse | void>;
    matches?: (request: NextRequest) => boolean;
    path?: string[];
};

type _RequestMiddleware = Omit<RequestMiddleware, "path"> & {
    pathMatches: (path: string) => boolean;
};
