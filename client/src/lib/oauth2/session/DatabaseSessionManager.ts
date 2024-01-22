import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import pino from "pino";

import type { Profile, OidcTokenSet } from "../types";
import type {
    Session,
    SessionConfig,
    SessionDao,
    SessionManager,
} from "./types";
import type { Logger } from "pino";

export class DatabaseSessionManager implements SessionManager {
    config: SessionConfig;
    sessionDao: SessionDao;
    logger: Logger;

    constructor(sessionDao: SessionDao, config: SessionConfig) {
        this.sessionDao = sessionDao;
        this.config = config;
        this.logger = pino({
            level: config.debug ? "debug" : "silent",
        });
    }

    getSession = async (): Promise<Session | null> => {
        const sessionId = cookies().get("session")?.value;
        this.logger.debug("Retrieved session cookie " + sessionId);
        return sessionId ? this.sessionDao.getSession(sessionId) : null;
    };

    validateSession = async (): Promise<Session | null> => {
        const session = await this.getSession();
        this.logger.debug(`Validated session ${session}`);
        if (!session) {
            return null;
        }
        if (session.expires.getTime() > Date.now()) {
            this.logger.debug(`Session not expired`);
            return session;
        } else {
            this.logger.debug(`Session expired`);
            await this.sessionDao.deleteSession(session.id);
            return null;
        }
    };

    createSession = async (
        tokens: OidcTokenSet,
        profile: Profile
    ): Promise<Session> => {
        const sessionId = nanoid();
        const session = {
            id: sessionId,
            expires: new Date(Date.now() + this.config.maxAge * 1000),
            tokens,
            profile: {
                id: nanoid(),
                name: profile.name,
                firstName: profile.firstName,
                lastName: profile.lastName,
            },
        };
        // TODO: handle error if profile id already exists (eg. a user starts multiple sessions)
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
