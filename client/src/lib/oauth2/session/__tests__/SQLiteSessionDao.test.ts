/** @jest-environment node */
import { SQLiteSessionDao } from "..";
import { RowNotFoundError } from "../../error";
import sqlite from "better-sqlite3";
import { readFileSync } from "fs";

import type { Database } from "better-sqlite3";
import type { Session, SessionSchema } from "..";
import { TokenSetSchema, ProfileSchema } from "../..";

function setUp(db: Database) {
    const schema = readFileSync(
        "/home/oscar/projects/ishiko/client/src/lib/oauth2/db/schema.sql",
        "utf8",
    );
    db.exec(schema);
}

function insertSessionData(db: Database): Session {
    const session = {
        id: "session_1",
        expires: new Date(),
        tokens: {
            accessToken: {
                value: "access",
                expires: new Date(),
            },
            refreshToken: "refresh",
            idToken: "id_token",
        },
        profile: {
            id: "john1",
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
            refresh_token, id_token)
        VALUES (
            'token_set_1', 
            '${session.id}',
            '${session.tokens.accessToken.value}', 
            '${session.tokens.accessToken.expires.toISOString()}',
            '${session.tokens.refreshToken}', 
            '${session.tokens.idToken}'
        );
        INSERT INTO profile (profile_id, session_id, name, first_name, last_name)
        VALUES (
            '${session.profile.id}', 
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
        const result = (await sessionDao.getSession("session_1")) as Session;

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
        expect(result.tokens.refreshToken).toEqual(session.tokens.refreshToken);
        expect(result.tokens.idToken).toEqual(session.tokens.idToken);

        // compare profile data
        expect(result.profile.id).toEqual(session.profile.id);
        expect(result.profile.name).toEqual(session.profile.name);
        expect(result.profile.firstName).toEqual(session.profile.firstName);
        expect(result.profile.lastName).toEqual(session.profile.lastName);
    });

    test("returns null if not found", async () => {
        const result = await sessionDao.getSession("session_0");
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
            id: "session_1",
            expires: new Date(),
            tokens: {
                accessToken: {
                    value: "access",
                    expires: new Date(),
                },
                refreshToken: "refresh",
                idToken: "id_token",
            },
            profile: {
                id: "profile_1",
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
                    refresh_token, id_token
                FROM token_set WHERE session_id = ?;
                `,
            )
            .get(session.id) as TokenSetSchema;
        expect(tokenSetSchema.session_id).toEqual(session.id);
        expect(tokenSetSchema.access_token).toEqual(
            session.tokens.accessToken.value,
        );
        expect(tokenSetSchema.access_token_expires).toEqual(
            session.tokens.accessToken.expires.toISOString(),
        );
        expect(tokenSetSchema.refresh_token).toEqual(
            session.tokens.refreshToken,
        );
        expect(tokenSetSchema.id_token).toEqual(session.tokens.idToken);

        const profileSchema = db
            .prepare(
                `
                SELECT profile_id, session_id, name, first_name, last_name
                FROM profile WHERE session_id = ?;
                `,
            )
            .get(session.id) as ProfileSchema;
        expect(profileSchema.profile_id).toEqual(session.profile.id);
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
                value: "new_access",
                expires: new Date(),
            },
            idToken: "id_token",
        };
        session.profile.name = "James Wick";
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
                    refresh_token, id_token
                FROM token_set WHERE session_id = ?;
                `,
            )
            .get(session.id) as TokenSetSchema;
        expect(tokenSetSchema.session_id).toEqual(session.id);
        expect(tokenSetSchema.access_token).toEqual(
            session.tokens.accessToken.value,
        );
        expect(tokenSetSchema.access_token_expires).toEqual(
            session.tokens.accessToken.expires.toISOString(),
        );
        expect(tokenSetSchema.refresh_token).toBeNull();
        expect(tokenSetSchema.id_token).toEqual(session.tokens.idToken);

        const profileSchema = db
            .prepare(
                `
                SELECT profile_id, session_id, name, first_name, last_name
                FROM profile WHERE session_id = ?;
                `,
            )
            .get(session.id) as ProfileSchema;
        expect(profileSchema.profile_id).toEqual(session.profile.id);
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
                idToken: "id_token",
            },
            profile: {
                id: "john_1",
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
            .prepare(`SELECT * FROM profile WHERE session_id = ?`)
            .get(session.id);
        expect(profileSchema).toBeUndefined();
    });
});
