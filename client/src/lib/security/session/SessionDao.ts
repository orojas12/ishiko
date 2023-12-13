import { Session } from "./types";

export type SessionDao = {
    getSession: (sessionId: string) => Promise<Session | null>;
    createSession: (session: Session) => Promise<void>;
    updateSession: (session: Session) => Promise<void>;
    deleteSession: (sessionId: string) => Promise<void>;
    deleteAllUserSessions: (userId: string) => Promise<void>;
};
