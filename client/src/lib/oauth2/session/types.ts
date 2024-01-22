import type { NextRequest } from "next/server";
import type { OidcTokenSet, Profile } from "../types";

export type Session = {
    id: string;
    expires: Date;
    tokens: OidcTokenSet;
    profile: Profile;
};

export type SessionSchema = {
    session_id: string;
    expires: string;
};

export type SessionManager = {
    getSession: () => Promise<Session | null>;
    validateSession: () => Promise<Session | null>;
    createSession: (tokens: OidcTokenSet, profile: Profile) => Promise<Session>;
    invalidateSession: (request: NextRequest) => Promise<void>;
};

export type SessionDao = {
    getSession: (sessionId: string) => Promise<Session | null>;
    createSession: (session: Session) => Promise<void>;
    updateSession: (session: Session) => Promise<void>;
    deleteSession: (sessionId: string) => Promise<void>;
};

export type SessionConfig = {
    maxAge: number;
    debug?: boolean;
};
