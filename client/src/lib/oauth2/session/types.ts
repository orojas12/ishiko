import type { NextRequest } from "next/server";
import type { OAuth2TokenSet, OidcTokenSet, Profile, TokenSet } from "../";

export type Session = {
    id: string;
    expires: Date;
    tokens: TokenSet;
    profile: Profile;
};

export type SessionSchema = {
    session_id: string;
    expires: string;
};

export type SessionManager = {
    getSession: () => Promise<Session | null>;
    validateSession: () => Promise<Session | null>;
    createSession: (tokens: TokenSet, profile: Profile) => Promise<Session>;
    invalidateSession: (request: NextRequest) => Promise<void>;
};

export type SessionDao = {
    getSession: (sessionId: string) => Promise<Session | null>;
    createSession: (session: Session) => Promise<void>;
    updateSession: (session: Session) => Promise<void>;
    deleteSession: (sessionId: string) => Promise<void>;
};
