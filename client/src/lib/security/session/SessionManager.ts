import { NextRequest, NextResponse } from "next/server";
import type { Session } from "./types";

export type SessionManager = {
    getSession: (request: NextRequest) => Promise<Session | null>;
    validateSession: (request: NextRequest) => Promise<Session | null>;
    createSession: (userId: string, data: {}) => Promise<Session>;
    getSessionCookie: (request: NextRequest) => string;
    setSessionCookie: (response: NextResponse, session: Session) => void;
    invalidateSession: (request: NextRequest) => Promise<void>;
    invalidateAllUserSessions: (userId: string) => Promise<void>;
};
