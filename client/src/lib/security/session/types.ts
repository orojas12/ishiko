import type { NextRequest, NextResponse } from "next/server";

export type Session = {
    id: string;
    userId: string;
    expires: Date;
};

export type SessionSchema = {
    id: string;
    user_id: string;
    expires: string;
};

export type SessionManager = {
    getSession: (request: NextRequest) => Promise<Session | null>;
    validateSession: (request: NextRequest) => Promise<Session | null>;
    createSession: (userId: string, data: {}) => Promise<Session>;
    getSessionCookie: (request: NextRequest) => string | null;
    setSessionCookie: (response: NextResponse, session: Session) => void;
    invalidateSession: (request: NextRequest) => Promise<void>;
    invalidateAllUserSessions: (userId: string) => Promise<void>;
};

export type SessionDao = {
    getSession: (sessionId: string) => Promise<Session | null>;
    createSession: (session: Session) => Promise<void>;
    updateSession: (session: Session) => Promise<void>;
    deleteSession: (sessionId: string) => Promise<void>;
    deleteAllUserSessions: (userId: string) => Promise<void>;
};
