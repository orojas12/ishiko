import { cookies } from "next/headers";
import { nanoid } from "nanoid";

import type { Session, SessionDao, SessionManager } from ".";
import type { OidcTokenSet } from "..";

export class DatabaseSessionManager implements SessionManager {
    sessionDao: SessionDao;

    constructor(sessionDao: SessionDao) {
        this.sessionDao = sessionDao;
    }

    getSession = async (): Promise<Session | null> => {
        const sessionId = cookies().get("session")?.value;
        return sessionId ? this.sessionDao.getSession(sessionId) : null;
    };

    validateSession = async (): Promise<Session | null> => {
        const session = await this.getSession();
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

    createSession = async (tokens: OidcTokenSet): Promise<Session> => {
        const sevenDays = 604800 * 1000;
        const sessionId = nanoid();
        const session = {
            id: sessionId,
            expires: new Date(Date.now() + sevenDays),
            tokens: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            },
            profile: {
                id: tokens.idToken.claims.sub,
                name: tokens.idToken.claims.name,
                firstName: tokens.idToken.claims.given_name,
                lastName: tokens.idToken.claims.family_name,
            },
        };
        await this.sessionDao.createSession(session);
        return this.sessionDao.getSession(sessionId) as Promise<Session>;
    };

    /**
     * Invalidates the current session by deleting it from the
     * database and removing the session cookie.
     *
     * NOTE:
     * Due to the way NextJS handles cookies, removing the cookie
     * will only work inside of a server action or route handler.
     *
     * {@link https://nextjs.org/docs/app/api-reference/functions/cookies#deleting-cookies}
     */
    invalidateSession = async (): Promise<void> => {
        const session = await this.getSession();
        if (!session) return;
        await this.sessionDao.deleteSession(session.id);
        cookies().delete("session");
    };
}
