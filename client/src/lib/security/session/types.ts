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
    getSession: () => Promise<Session | null>;
    validateSession: () => Promise<Session | null>;
    createSession: (userId: string, data: {}) => Promise<Session>;
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
