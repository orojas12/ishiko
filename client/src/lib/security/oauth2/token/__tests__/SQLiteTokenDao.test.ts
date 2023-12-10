/** @jest-environment node */
import Database from "better-sqlite3";
import { SQLiteTokenDao } from "../SQLiteTokenDao";
import { readFileSync } from "fs";
import type { OAuth2TokenSet, OAuth2TokenSetSchema } from "../..";
import { RowNotFoundError } from "../../error";

describe("createTokenSet()", () => {
    const db = new Database(":memory:");
    const tokenDao = new SQLiteTokenDao(db);

    beforeAll(() => {
        const schema = readFileSync(
            "/home/oscar/projects/ishiko/client/src/lib/security/oauth2/db/schema.sql",
            "utf8",
        );
        db.exec(schema);
        db.exec(
            `
            INSERT INTO user (id, name)
            VALUES ('user1', 'name');
            INSERT INTO oauth2_key (id, user_id, provider_id, provider_user_id)
            VALUES ('key1', 'user1', 'provider1', 'provideruser1');
            `,
        );
    });

    afterEach(() => {
        db.exec(
            `
            DELETE FROM oauth2_token_set;
            `,
        );
    });

    test("inserts data correctly", () => {
        const data = {
            id: "tokenset1",
            accessToken: {
                value: "access",
                expires: new Date(),
            },
            refreshToken: {
                value: "refresh",
                expires: new Date(),
            },
        };
        tokenDao.createTokenSet("key1", data);
        const result = db
            .prepare(
                `
                SELECT id, oauth2_key_id, access_token, access_token_expires,
                    refresh_token, refresh_token_expires
                FROM oauth2_token_set WHERE id = 'tokenset1';
                `,
            )
            .get() as OAuth2TokenSetSchema;
        expect(result.id).toEqual("tokenset1");
        expect(result.oauth2_key_id).toEqual("key1");
        expect(result.access_token).toEqual(data.accessToken.value);
        expect(result.access_token_expires).toEqual(
            data.accessToken.expires.toISOString(),
        );
        expect(result.refresh_token).toEqual(data.refreshToken.value);
        expect(result.refresh_token_expires).toEqual(
            data.refreshToken.expires.toISOString(),
        );
    });

    test("returns saved data", () => {
        const data = {
            id: "tokenset1",
            accessToken: {
                value: "access",
                expires: new Date(),
            },
            refreshToken: {
                value: "refresh",
                expires: new Date(),
            },
        };
        const result = tokenDao.createTokenSet("key1", data) as OAuth2TokenSet;
        expect(result.id).toEqual(data.id);
        expect(result.accessToken.value).toEqual(data.accessToken.value);
        expect(result.accessToken.expires.toISOString()).toEqual(
            data.accessToken.expires.toISOString(),
        );
        expect(result.refreshToken?.value).toEqual(data.refreshToken.value);
        expect(result.refreshToken?.expires.toISOString()).toEqual(
            result.refreshToken?.expires.toISOString(),
        );
    });
});

describe("updateTokenSet()", () => {
    const db = new Database(":memory:");
    const tokenDao = new SQLiteTokenDao(db);

    const schema = readFileSync(
        "/home/oscar/projects/ishiko/client/src/lib/security/oauth2/db/schema.sql",
        "utf8",
    );
    db.exec(schema);
    db.exec(
        `
        INSERT INTO user (id, name)
        VALUES ('user1', 'name');
        INSERT INTO oauth2_key (id, user_id, provider_id, provider_user_id)
        VALUES ('key1', 'user1', 'provider1', 'provideruser1');
        `,
    );

    beforeEach(() => {
        db.exec(
            `
            DELETE FROM oauth2_token_set;
            INSERT INTO oauth2_token_set (id, oauth2_key_id, access_token, 
                access_token_expires, refresh_token, refresh_token_expires)
            VALUES ('tokenset1', 'key1', 'access', 
                '${new Date().toISOString()}', 'refresh', '${new Date().toISOString()}');
            `,
        );
    });

    test("updates data correctly", () => {
        const data = {
            id: "tokenset1",
            accessToken: {
                value: "new access",
                expires: new Date(),
            },
            refreshToken: {
                value: "new refresh",
                expires: new Date(),
            },
        };
        tokenDao.updateTokenSet(data);
        const result = db
            .prepare(
                `
                SELECT id, oauth2_key_id, access_token, access_token_expires,
                    refresh_token, refresh_token_expires
                FROM oauth2_token_set WHERE id = ?;
                `,
            )
            .get(data.id) as OAuth2TokenSetSchema;
        expect(result.id).toEqual(data.id);
        expect(result.oauth2_key_id).toEqual("key1");
        expect(result.access_token).toEqual(data.accessToken.value);
        expect(result.access_token_expires).toEqual(
            data.accessToken.expires.toISOString(),
        );
        expect(result.refresh_token).toEqual(data.refreshToken.value);
        expect(result.refresh_token_expires).toEqual(
            data.refreshToken.expires.toISOString(),
        );
    });

    test("returns updated data", () => {
        const data = {
            id: "tokenset1",
            accessToken: {
                value: "new access",
                expires: new Date(),
            },
            refreshToken: {
                value: "new refresh",
                expires: new Date(),
            },
        };
        const result = tokenDao.updateTokenSet(data) as OAuth2TokenSet;
        expect(result.id).toEqual(data.id);
        expect(result.accessToken.value).toEqual(data.accessToken.value);
        expect(result.accessToken.expires.toISOString()).toEqual(
            data.accessToken.expires.toISOString(),
        );
        expect(result.refreshToken?.value).toEqual(data.refreshToken.value);
        expect(result.refreshToken?.expires.toISOString()).toEqual(
            result.refreshToken?.expires.toISOString(),
        );
    });

    test("throws RowNowFoundError when token set not found", () => {
        const data = {
            id: "notfound",
            accessToken: {
                value: "new access",
                expires: new Date(),
            },
            refreshToken: {
                value: "new refresh",
                expires: new Date(),
            },
        };
        expect(() => tokenDao.updateTokenSet(data)).toThrow(RowNotFoundError);
    });
});

describe("getTokenSetById()", () => {
    const db = new Database(":memory:");
    const tokenDao = new SQLiteTokenDao(db);

    beforeAll(() => {
        const schema = readFileSync(
            "/home/oscar/projects/ishiko/client/src/lib/security/oauth2/db/schema.sql",
            "utf8",
        );
        db.exec(schema);
        db.exec(
            `
            INSERT INTO user (id, name)
            VALUES ('user1', 'name');
            INSERT INTO oauth2_key (id, user_id, provider_id, provider_user_id)
            VALUES ('key1', 'user1', 'provider1', 'provideruser1');
            `,
        );
    });

    test("returns correct data", () => {
        const expectedResult = {
            id: "tokenset1",
            accessToken: {
                value: "access",
                expires: new Date(),
            },
            refreshToken: {
                value: "refresh",
                expires: new Date(),
            },
        };
        db.prepare(
            `
            INSERT INTO oauth2_token_set (id, oauth2_key_id, access_token,
                access_token_expires, refresh_token, refresh_token_expires)
            VALUES (?, ?, ?, ?, ?, ?);
            `,
        ).run(
            expectedResult.id,
            "key1",
            expectedResult.accessToken.value,
            expectedResult.accessToken.expires.toISOString(),
            expectedResult.refreshToken.value,
            expectedResult.refreshToken.expires.toISOString(),
        );
        const result = tokenDao.getTokenSetById("tokenset1") as OAuth2TokenSet;
        expect(result.id).toEqual(expectedResult.id);
        expect(result.accessToken.value).toEqual(
            expectedResult.accessToken.value,
        );
        expect(result.accessToken.expires.toISOString()).toEqual(
            expectedResult.accessToken.expires.toISOString(),
        );
        expect(result.refreshToken?.value).toEqual(
            expectedResult.refreshToken.value,
        );
        expect(result.refreshToken?.expires.toISOString()).toEqual(
            expectedResult.refreshToken.expires.toISOString(),
        );
    });

    test("returns null if token set not found", () => {
        const result = tokenDao.getTokenSetById("notfound");
        expect(result).toEqual(null);
    });
});
