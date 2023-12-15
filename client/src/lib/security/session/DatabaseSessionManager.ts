import type { NextRequest, NextResponse } from "next/server";
import type { SessionDao } from "./SessionDao";
import type { SessionManager } from "./SessionManager";
import type { Session } from "./types";
import { nanoid } from "nanoid";

export class DatabaseSessionManager implements SessionManager {
    sessionDao: SessionDao;

    constructor(sessionDao: SessionDao) {
        this.sessionDao = sessionDao;
    }

    getSession = async (request: NextRequest): Promise<Session | null> => {
        const sessionId = this.getSessionCookie(request);
        return sessionId ? this.sessionDao.getSession(sessionId) : null;
    };

    validateSession = async (request: NextRequest): Promise<Session | null> => {
        const session = await this.getSession(request);
        if (!session) {
            return null;
        }
        if (session.expires.getTime() > Date.now()) {
            return session;
        } else {
            await this.sessionDao.deleteSession(session.id);
            return null;
        }
    };

    createSession = async (userId: string, data: {}): Promise<Session> => {
        const sevenDays = 604800 * 1000;
        const sessionId = nanoid();
        const session = {
            id: sessionId,
            userId: userId,
            expires: new Date(Date.now() + sevenDays),
        };
        await this.sessionDao.createSession(session as Session);
        return this.sessionDao.getSession(sessionId) as Promise<Session>;
    };

    getSessionCookie = (request: NextRequest): string | null => {
        return request.cookies.get("session")?.value || null;
    };

    setSessionCookie = (response: NextResponse, session: Session): void => {
        response.cookies.set("session", session.id);
    };

    invalidateSession = async (request: NextRequest): Promise<void> => {
        const session = await this.getSession(request);
        if (!session) return;
        await this.sessionDao.deleteSession(session.id);
    };

    invalidateAllUserSessions = async (userId: string): Promise<void> => {
        await this.sessionDao.deleteAllUserSessions(userId);
    };
}
