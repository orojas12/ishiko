/** @jest-environment node */
jest.mock("../SQLiteSessionDao", () => {
    return {
        SQLiteSessionDao: jest.fn(() => {
            return {};
        }),
    };
});
import { NextRequest, NextResponse } from "next/server";
import { DatabaseSessionManager } from "../DatabaseSessionManager";
import { SQLiteSessionDao } from "../SQLiteSessionDao";
import { Session } from "../types";

describe("getSessionCookie()", () => {
    const sessionManager = new DatabaseSessionManager(
        new SQLiteSessionDao(undefined as any),
    );

    test("extracts cookie from request", () => {
        const request = new NextRequest("http://example.com");
        request.cookies.set("session", "session1");
        const cookie = sessionManager.getSessionCookie(request);
        expect(cookie).toEqual("session1");
    });
});

describe("setSessionCookie()", () => {
    const sessionManager = new DatabaseSessionManager(
        new SQLiteSessionDao(undefined as any),
    );

    test("sets cookie on response", () => {
        const response = new NextResponse();
        sessionManager.setSessionCookie(response, {
            id: "session1",
        } as Session);
        expect(response.cookies.get("session")?.value).toEqual("session1");
    });
});
