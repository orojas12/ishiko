/** @jest-environment node */
import { SQLiteSessionDao } from "..";
import { RowNotFoundError } from "../../error";
import sqlite from "better-sqlite3";
import { readFileSync } from "fs";

import type { Database } from "better-sqlite3";
import type { Session, SessionSchema } from "..";
import { OAuth2TokenSetSchema, UserProfileSchema } from "../..";

function setUp(db: Database) {
    const schema = readFileSync(
        "/home/oscar/projects/ishiko/client/src/lib/oauth2/db/schema.sql",
        "utf8",
    );
    db.exec(schema);
}

function insertSessionData(db: Database): Session {
    const session = {
        id: "session1",
        expires: new Date(),
        tokens: {
            accessToken: {
                value: "access",
                expires: new Date(),
            },
            refreshToken: {
                value: "refresh",
                expires: new Date(),
            },
        },
        profile: {
            id: "user1",
            name: "John Wick",
            firstName: "John",
            lastName: "Wick",
        },
    };

    db.exec(
        `
        INSERT INTO session (session_id, expires)
        VALUES ('${session.id}', '${session.expires.toISOString()}');
        INSERT INTO token_set (token_set_id, session_id, access_token, access_token_expires,
            refresh_token, refresh_token_expires)
        VALUES (
            'token1', 
            '${session.id}',
            '${session.tokens.accessToken.value}', 
            '${session.tokens.accessToken.expires.toISOString()}',
            '${session.tokens.refreshToken.value}', 
            '${session.tokens.refreshToken.expires.toISOString()}'
        );
        INSERT INTO user_profile (user_id, session_id, name, first_name, last_name)
        VALUES (
            'user1', 
            '${session.id}',
            '${session.profile.name}', 
            '${session.profile.firstName}', 
            '${session.profile.lastName}'
        );
        `,
    );

    return session;
}

describe("getSession()", () => {
    const db = new sqlite(":memory:");
    const sessionDao = new SQLiteSessionDao(db);

    beforeAll(() => {
        setUp(db);
    });

    test("returns correct data", async () => {
        const session = insertSessionData(db);
        const result = (await sessionDao.getSession("session1")) as Session;

        // compare session data
        expect(result.id).toEqual(session.id);
        expect(result.expires.toISOString()).toEqual(
            session.expires.toISOString(),
        );

        // compare token data
        expect(result.tokens.accessToken.value).toEqual(
            session.tokens.accessToken.value,
        );
        expect(result.tokens.accessToken.expires.toISOString()).toEqual(
            session.tokens.accessToken.expires.toISOString(),
        );
        expect(result.tokens.refreshToken?.value).toEqual(
            session.tokens.refreshToken?.value,
        );
        expect(result.tokens.refreshToken?.expires.toISOString()).toEqual(
            session.tokens.refreshToken?.expires.toISOString(),
        );

        // compare profile data
        expect(result.profile.id).toEqual(session.profile.id);
        expect(result.profile.name).toEqual(session.profile.name);
        expect(result.profile.firstName).toEqual(session.profile.firstName);
        expect(result.profile.lastName).toEqual(session.profile.lastName);
    });

    test("returns null if not found", async () => {
        const result = await sessionDao.getSession("session0");
        expect(result).toBeNull();
    });
});

describe("createSession()", () => {
    const db = new sqlite(":memory:");
    const sessionDao = new SQLiteSessionDao(db);

    beforeAll(() => {
        setUp(db);
    });

    test("creates session", async () => {
        const session = {
            id: "session1",
            expires: new Date(),
            tokens: {
                accessToken: {
                    value: "access",
                    expires: new Date(),
                },
                refreshToken: {
                    value: "refresh",
                    expires: new Date(),
                },
            },
            profile: {
                id: "user1",
                name: "John Wick",
                firstName: "John",
                lastName: "Wick",
            },
        };

        await sessionDao.createSession(session);

        const sessionSchema = db
            .prepare(
                `
                SELECT session_id, expires 
                FROM session WHERE session_id = ?;
                `,
            )
            .get(session.id) as SessionSchema;
        expect(sessionSchema.session_id).toEqual(session.id);
        expect(sessionSchema.expires).toEqual(session.expires.toISOString());

        const tokenSetSchema = db
            .prepare(
                `
                SELECT session_id, access_token, access_token_expires,
                    refresh_token, refresh_token_expires
                FROM token_set WHERE session_id = ?;
                `,
            )
            .get(session.id) as OAuth2TokenSetSchema;
        expect(tokenSetSchema.session_id).toEqual(session.id);
        expect(tokenSetSchema.access_token).toEqual(
            session.tokens.accessToken.value,
        );
        expect(tokenSetSchema.access_token_expires).toEqual(
            session.tokens.accessToken.expires.toISOString(),
        );
        expect(tokenSetSchema.refresh_token).toEqual(
            session.tokens.refreshToken.value,
        );
        expect(tokenSetSchema.refresh_token_expires).toEqual(
            session.tokens.refreshToken.expires.toISOString(),
        );

        const profileSchema = db
            .prepare(
                `
                SELECT session_id, name, first_name, last_name
                FROM user_profile WHERE session_id = ?;
                `,
            )
            .get(session.id) as UserProfileSchema;
        expect(profileSchema.session_id).toEqual(session.id);
        expect(profileSchema.name).toEqual(session.profile.name);
        expect(profileSchema.first_name).toEqual(session.profile.firstName);
        expect(profileSchema.last_name).toEqual(session.profile.lastName);
    });
});

describe("updateSession()", () => {
    const db = new sqlite(":memory:");
    const sessionDao = new SQLiteSessionDao(db);

    beforeAll(() => {
        setUp(db);
    });

    test("updates session", async () => {
        const session = insertSessionData(db);

        session.expires = new Date();
        session.tokens = {
            accessToken: {
                value: "access2",
                expires: new Date(),
            },
        };
        session.profile = {
            id: "user1",
            name: "James Wick",
            firstName: "James",
            lastName: "Wick",
        };
        session.profile.firstName = "James";

        await sessionDao.updateSession(session);

        const sessionSchema = db
            .prepare(
                `
                SELECT session_id, expires 
                FROM session WHERE session_id = ?;
                `,
            )
            .get(session.id) as SessionSchema;
        expect(sessionSchema.session_id).toEqual(session.id);
        expect(sessionSchema.expires).toEqual(session.expires.toISOString());

        const tokenSetSchema = db
            .prepare(
                `
                SELECT session_id, access_token, access_token_expires,
                    refresh_token, refresh_token_expires
                FROM token_set WHERE session_id = ?;
                `,
            )
            .get(session.id) as OAuth2TokenSetSchema;
        expect(tokenSetSchema.session_id).toEqual(session.id);
        expect(tokenSetSchema.access_token).toEqual(
            session.tokens.accessToken.value,
        );
        expect(tokenSetSchema.access_token_expires).toEqual(
            session.tokens.accessToken.expires.toISOString(),
        );
        expect(tokenSetSchema.refresh_token).toBeNull();
        expect(tokenSetSchema.refresh_token_expires).toBeNull();

        const profileSchema = db
            .prepare(
                `
                SELECT session_id, name, first_name, last_name
                FROM user_profile WHERE session_id = ?;
                `,
            )
            .get(session.id) as UserProfileSchema;
        expect(profileSchema.session_id).toEqual(session.id);
        expect(profileSchema.name).toEqual(session.profile.name);
        expect(profileSchema.first_name).toEqual(session.profile.firstName);
        expect(profileSchema.last_name).toEqual(session.profile.lastName);
    });

    test("throws RowNotFoundError if session id not found", async () => {
        const session = {
            id: "notfound",
            expires: new Date(),
            tokens: {
                accessToken: {
                    value: "access",
                    expires: new Date(),
                },
                refreshToken: {
                    value: "refresh",
                    expires: new Date(),
                },
            },
            profile: {
                id: "user1",
                name: "John Wick",
                firstName: "John",
                lastName: "Wick",
            },
        };
        expect(() => sessionDao.updateSession(session)).rejects.toThrow(
            RowNotFoundError,
        );
    });
});

describe("deleteSession()", () => {
    const db = new sqlite(":memory:");
    const sessionDao = new SQLiteSessionDao(db);

    beforeAll(() => {
        setUp(db);
    });

    test("deletes session", async () => {
        const session = insertSessionData(db);
        await sessionDao.deleteSession(session.id);

        const sessionSchema = db
            .prepare(`SELECT * FROM session WHERE session_id = ?`)
            .get(session.id);
        expect(sessionSchema).toBeUndefined();

        const tokenSetSchema = db
            .prepare(`SELECT * FROM token_set WHERE session_id = ?`)
            .get(session.id);
        expect(tokenSetSchema).toBeUndefined();

        const profileSchema = db
            .prepare(`SELECT * FROM user_profile WHERE session_id = ?`)
            .get(session.id);
        expect(profileSchema).toBeUndefined();
    });
});
