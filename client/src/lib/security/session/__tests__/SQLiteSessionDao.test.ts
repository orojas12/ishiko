/** @jest-environment node */
import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { SQLiteSessionDao } from "../SQLiteSessionDao";
import { Session, SessionSchema } from "../types";
import { RowNotFoundError } from "../../oauth2/error";

describe("getSession()", () => {
    const db = new Database(":memory:");
    const sessionDao = new SQLiteSessionDao(db);

    beforeAll(() => {
        const schema = readFileSync(
            "/home/oscar/projects/ishiko/client/src/lib/security/oauth2/db/schema.sql",
            "utf8",
        );
        db.exec(schema);
        db.exec(
            `
            INSERT INTO user (id, username) VALUES ('user1', 'john');
            `,
        );
    });

    test("returns correct data", async () => {
        const expires = new Date().toISOString();
        db.exec(
            `
            INSERT INTO session (id, user_id, expires)
            VALUES ('session1', 'user1', '${expires}');
            `,
        );
        const result = (await sessionDao.getSession("session1")) as Session;
        expect(result.id).toEqual("session1");
        expect(result.userId).toEqual("user1");
        expect(result.expires.toISOString()).toEqual(expires);
    });

    test("returns null if not found", async () => {
        const result = await sessionDao.getSession("session0");
        expect(result).toBeNull();
    });
});

describe("createSession()", () => {
    const db = new Database(":memory:");
    const sessionDao = new SQLiteSessionDao(db);

    beforeAll(() => {
        const schema = readFileSync(
            "/home/oscar/projects/ishiko/client/src/lib/security/oauth2/db/schema.sql",
            "utf8",
        );
        db.exec(schema);
        db.exec(
            `
            INSERT INTO user (id, username) VALUES ('user1', 'john');
            `,
        );
    });

    test("creates session", async () => {
        const session = {
            id: "session1",
            userId: "user1",
            expires: new Date(),
        };
        await sessionDao.createSession(session);
        const result = db
            .prepare(
                `
                SELECT id, user_id, expires 
                FROM session WHERE id = ?;
                `,
            )
            .get(session.id) as SessionSchema;
        expect(result.id).toEqual(session.id);
        expect(result.user_id).toEqual(session.userId);
        expect(result.expires).toEqual(session.expires.toISOString());
    });

    test("throws RowNotFoundError if user id not found", async () => {
        const session = {
            id: "session2",
            userId: "user2",
            expires: new Date(),
        };
        expect(sessionDao.createSession(session)).rejects.toThrow(
            RowNotFoundError,
        );
    });
});

describe("updateSession()", () => {
    const db = new Database(":memory:");
    const sessionDao = new SQLiteSessionDao(db);

    beforeAll(() => {
        const schema = readFileSync(
            "/home/oscar/projects/ishiko/client/src/lib/security/oauth2/db/schema.sql",
            "utf8",
        );
        db.exec(schema);
        db.exec(
            `
            INSERT INTO user (id, username) VALUES ('user1', 'john');
            INSERT INTO user (id, username) VALUES ('user2', 'john');
            INSERT INTO session (id, user_id, expires)
            VALUES ('session1', 'user1', '${new Date().toISOString()}');
            `,
        );
    });

    test("updates session", async () => {
        const session = {
            id: "session1",
            userId: "user2",
            expires: new Date(),
        };
        await sessionDao.updateSession(session);
        const result = db
            .prepare(
                `
                SELECT id, user_id, expires FROM session
                WHERE id = ?
                `,
            )
            .get(session.id) as SessionSchema;
        expect(result.id).toEqual(session.id);
        expect(result.user_id).toEqual(session.userId);
        expect(result.expires).toEqual(session.expires.toISOString());
    });

    test("throws RowNotFoundError if session id not found", async () => {
        const session = {
            id: "session0",
            userId: "user1",
            expires: new Date(),
        };
        await expect(sessionDao.updateSession(session)).rejects.toThrow(
            RowNotFoundError,
        );
    });

    test("throws RowNowFoundError if user id not found", async () => {
        const session = {
            id: "session1",
            userId: "user0",
            expires: new Date(),
        };
        await expect(sessionDao.updateSession(session)).rejects.toThrow(
            RowNotFoundError,
        );
    });
});

describe("deleteSession()", () => {
    const db = new Database(":memory:");
    const sessionDao = new SQLiteSessionDao(db);

    beforeAll(() => {
        const schema = readFileSync(
            "/home/oscar/projects/ishiko/client/src/lib/security/oauth2/db/schema.sql",
            "utf8",
        );
        db.exec(schema);
        db.exec(
            `
            INSERT INTO user (id, username) VALUES ('user1', 'john');
            INSERT INTO session (id, user_id, expires)
            VALUES ('session1', 'user1', '${new Date().toISOString()}');
            `,
        );
    });

    test("deletes session", async () => {
        await sessionDao.deleteSession("session1");
        const result = db
            .prepare(`SELECT * FROM session WHERE id = 'session1'`)
            .get();
        expect(result).toEqual(undefined);
    });
});

describe("deleteAllUserSessions()", () => {
    const db = new Database(":memory:");
    const sessionDao = new SQLiteSessionDao(db);

    beforeAll(() => {
        const schema = readFileSync(
            "/home/oscar/projects/ishiko/client/src/lib/security/oauth2/db/schema.sql",
            "utf8",
        );
        db.exec(schema);
        db.exec(
            `
            INSERT INTO user (id, username) VALUES ('user1', 'john');
            INSERT INTO session (id, user_id, expires)
            VALUES ('session1', 'user1', '${new Date().toISOString()}');
            INSERT INTO session (id, user_id, expires)
            VALUES ('session2', 'user1', '${new Date().toISOString()}');
            INSERT INTO session (id, user_id, expires)
            VALUES ('session3', 'user1', '${new Date().toISOString()}');
            `,
        );
    });

    test("deletes all sessions for a user", async () => {
        await sessionDao.deleteAllUserSessions("user1");
        const results = db
            .prepare(
                `
                SELECT * FROM session WHERE user_id = ?
                `,
            )
            .all("user1");
        expect(results.length).toEqual(0);
    });
});
