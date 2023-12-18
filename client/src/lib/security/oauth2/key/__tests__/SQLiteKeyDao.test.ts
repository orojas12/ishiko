/** @jest-environment node */
import { SQLiteKeyDao } from "..";
import { DuplicateRowError } from "../../error";
import { readFileSync } from "fs";
import Database from "better-sqlite3";

import type { OAuth2Key, OAuth2KeySchema } from "..";

describe("getKey()", () => {
    const db = new Database(":memory:");
    const keyDao = new SQLiteKeyDao(db);

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
            VALUES ('key1', 'user1', 'provider1', 'providerUser1');
            `,
        );
    });

    test("returns correct data", () => {
        const result = keyDao.getKey("provider1", "providerUser1") as OAuth2Key;
        expect(result.id).toEqual("key1");
        expect(result.userId).toEqual("user1");
        expect(result.providerId).toEqual("provider1");
        expect(result.providerUserId).toEqual("providerUser1");
    });

    test("returns null if not found", () => {
        let result = keyDao.getKey("provider0", "providerUser1");
        expect(result).toBeNull();
        result = keyDao.getKey("provider1", "providerUser0");
        expect(result).toBeNull();
        result = keyDao.getKey("provider0", "providerUser0");
        expect(result).toBeNull();
    });
});

describe("createKey()", () => {
    const db = new Database(":memory:");
    const keyDao = new SQLiteKeyDao(db);

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
            `,
        );
    });

    afterEach(() => {
        db.exec("DELETE FROM oauth2_key;");
    });

    test("creates key", () => {
        keyDao.createKey("provider1", "providerUser1", "user1");
        const result = db
            .prepare(
                `
            SELECT id, user_id, provider_id, provider_user_id
            FROM oauth2_key
            WHERE provider_id = ? AND provider_user_id = ?;
            `,
            )
            .get("provider1", "providerUser1") as OAuth2KeySchema;
        expect(result.user_id).toEqual("user1");
        expect(result.provider_id).toEqual("provider1");
        expect(result.provider_user_id).toEqual("providerUser1");
    });

    test("throws DuplicateRowError if key exists", () => {
        db.exec(`
            INSERT INTO oauth2_key (id, user_id, provider_id, provider_user_id)
            VALUES ('key1', 'user1', 'provider1', 'providerUser1');
        `);
        expect(() =>
            keyDao.createKey("provider1", "providerUser1", "user1"),
        ).toThrow(DuplicateRowError);
    });

    test("returns correct data", () => {
        keyDao.createKey("provider1", "providerUser1", "user1");
    });
});
