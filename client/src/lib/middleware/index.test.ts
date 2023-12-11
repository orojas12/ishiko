/** @jest-environment node */

import { NextRequest } from "next/server";
import { setUpMiddleware, setUpWithPathMatchers } from ".";

it("correctly sets up regexp matchers", () => {
    const middleware = [
        {
            handleRequest: async (_: any) => {},
            undefined,
            path: ["/users", "/posts/(.*)", "/messages", "/comments/(.*)/test"],
        },
    ];

    const middlewareWithMatcher = setUpWithPathMatchers(middleware);
    middlewareWithMatcher.forEach((middleware) => {
        expect(middleware.pathMatches("/users")).toEqual(true);
        expect(middleware.pathMatches("/posts")).toEqual(false);
        expect(middleware.pathMatches("/posts/1")).toEqual(true);
        expect(middleware.pathMatches("/messages")).toEqual(true);
        expect(middleware.pathMatches("/messages/1")).toEqual(true);
        expect(middleware.pathMatches("/messages/1/1")).toEqual(true);
        expect(middleware.pathMatches("/comments/1/1/test")).toEqual(true);
    });
});

it("calls middleware if matched with matches property", async () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();
    const middleware = [
        {
            handleRequest: mockFn1,
            matches: (_: any) => true,
        },
        {
            handleRequest: mockFn2,
            matches: (_: any) => true,
        },
        {
            handleRequest: mockFn3,
            matches: (_: any) => true,
        },
    ];
    const run = setUpMiddleware(middleware);
    const request = new NextRequest("http://example.com/test");
    await run(request);
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
    expect(mockFn3).toHaveBeenCalledTimes(1);
});

it("calls middleware if matched with path property", async () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();
    const middleware = [
        {
            handleRequest: mockFn1,
            path: ["/test"],
        },
        {
            handleRequest: mockFn2,
            path: ["/test/user"],
        },
        {
            handleRequest: mockFn3,
            path: ["/test/(.*)"],
        },
    ];
    const run = setUpMiddleware(middleware);
    const request = new NextRequest("http://example.com/test/1");
    await run(request);
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).not.toHaveBeenCalled();
    expect(mockFn3).toHaveBeenCalledTimes(1);
});

it("prioritizes matches property over path property", async () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const middleware = [
        {
            handleRequest: mockFn1,
            matches: (_: any) => false,
            path: ["/test"],
        },
        {
            handleRequest: mockFn2,
            matches: (_: any) => true,
            path: ["/user"],
        },
    ];
    const run = setUpMiddleware(middleware);
    const request = new NextRequest("http://example.com/test/1");
    await run(request);
    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalledTimes(1);
});
