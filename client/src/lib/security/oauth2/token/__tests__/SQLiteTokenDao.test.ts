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
            INSERT INTO user (id, username)
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
        INSERT INTO user (id, username)
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
            INSERT INTO user (id, username)
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

describe("getAllTokenSetsByKeyId()", () => {
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
            INSERT INTO user (id, username)
            VALUES ('user1', 'name');
            INSERT INTO oauth2_key (id, user_id, provider_id, provider_user_id)
            VALUES ('key1', 'user1', 'provider1', 'provideruser1');
            `,
        );
    });

    test("returns correct data", () => {
        const expectedResults = [
            {
                id: "tokenset1",
                accessToken: {
                    value: "access1",
                    expires: new Date(),
                },
                refreshToken: {
                    value: "refresh1",
                    expires: new Date(),
                },
            },
            {
                id: "tokenset2",
                accessToken: {
                    value: "access2",
                    expires: new Date(),
                },
                refreshToken: {
                    value: "refresh2",
                    expires: new Date(),
                },
            },
        ];
        const stmt = db.prepare(
            `
            INSERT INTO oauth2_token_set (id, oauth2_key_id, access_token,
                access_token_expires, refresh_token, refresh_token_expires)
            VALUES (?, ?, ?, ?, ?, ?);
            `,
        );
        stmt.run(
            expectedResults[0].id,
            "key1",
            expectedResults[0].accessToken.value,
            expectedResults[0].accessToken.expires.toISOString(),
            expectedResults[0].refreshToken.value,
            expectedResults[0].refreshToken.expires.toISOString(),
        );
        stmt.run(
            expectedResults[1].id,
            "key1",
            expectedResults[1].accessToken.value,
            expectedResults[1].accessToken.expires.toISOString(),
            expectedResults[1].refreshToken.value,
            expectedResults[1].refreshToken.expires.toISOString(),
        );
        const results = tokenDao.getAllTokenSetsByKeyId(
            "key1",
        ) as OAuth2TokenSet[];
        expect(results[0].accessToken.value).toEqual(
            expectedResults[0].accessToken.value,
        );
        expect(results[0].accessToken.expires.toISOString()).toEqual(
            expectedResults[0].accessToken.expires.toISOString(),
        );
        expect(results[0].refreshToken?.value).toEqual(
            expectedResults[0].refreshToken.value,
        );
        expect(results[0].refreshToken?.expires.toISOString()).toEqual(
            expectedResults[0].refreshToken.expires.toISOString(),
        );
        expect(results[1].accessToken.value).toEqual(
            expectedResults[1].accessToken.value,
        );
        expect(results[1].accessToken.expires.toISOString()).toEqual(
            expectedResults[1].accessToken.expires.toISOString(),
        );
        expect(results[1].refreshToken?.value).toEqual(
            expectedResults[1].refreshToken.value,
        );
        expect(results[1].refreshToken?.expires.toISOString()).toEqual(
            expectedResults[1].refreshToken.expires.toISOString(),
        );
    });

    test("returns empty array if no token sets found", () => {
        const results = tokenDao.getAllTokenSetsByKeyId("notfound");
        expect(results.length).toEqual(0);
    });
});

describe("tokenSetExists()", () => {
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
            INSERT INTO user (id, username)
            VALUES ('user1', 'name');
            INSERT INTO oauth2_key (id, user_id, provider_id, provider_user_id)
            VALUES ('key1', 'user1', 'provider1', 'provideruser1');
            `,
        );
        db.exec(
            `
            INSERT INTO oauth2_token_set (id, oauth2_key_id, access_token,
                access_token_expires, refresh_token, refresh_token_expires)
            VALUES ('tokenset1', 'key1', 'access', '${new Date().toISOString()}', 
                'refresh', '${new Date().toISOString()}');
            `,
        );
    });

    test("returns true if token set exists", () => {
        const result = tokenDao.tokenSetExists("tokenset1");
        expect(result).toEqual(true);
    });

    test("returns false if token set not found", () => {
        const result = tokenDao.tokenSetExists("notfound");
        expect(result).toEqual(false);
    });
});

describe("generateTokenSet()", () => {
    const db = new Database(":memory:");
    const tokenDao = new SQLiteTokenDao(db);

    test("returns OAuth2TokenSet object from OAuth2TokenSetSchema object", () => {
        const schema = {
            id: "tokenset1",
            oauth2_key_id: "key1",
            access_token: "access",
            access_token_expires: new Date().toISOString(),
            refresh_token: "refresh",
            refresh_token_expires: new Date().toISOString(),
        };
        const tokenSet = tokenDao.generateTokenSet(schema);
        expect(tokenSet.id).toEqual(schema.id);
        expect(tokenSet.accessToken.value).toEqual(schema.access_token);
        expect(tokenSet.accessToken.expires.toISOString()).toEqual(
            schema.access_token_expires,
        );
        expect(tokenSet.refreshToken?.value).toEqual(schema.refresh_token);
        expect(tokenSet.refreshToken?.expires.toISOString()).toEqual(
            schema.refresh_token_expires,
        );
    });
});
