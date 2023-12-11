/** @jest-environment node */
import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { SQLiteUserDao } from "../SQLiteUserDao";
import path from "path";
import type { User, UserSchema } from "lucia";
import { OAuth2KeySchema } from "../../oauth2";

describe("getUserByOAuth2Key()", () => {
    const db = new Database(":memory:");

    beforeAll(() => {
        const schema = readFileSync(
            path.join(__dirname, "..", "..", "oauth2", "db", "schema.sql"),
            "utf8",
        );
        db.exec(schema);
        db.exec(
            `
            INSERT INTO user (id, username) VALUES ('1', 'user1');
            INSERT INTO oauth2_key (id, user_id, provider_id, provider_user_id)
            VALUES ('1', '1', 'provider1', 'providerUser1');
            `,
        );
    });

    test("returns correct data", () => {
        const userDao = new SQLiteUserDao(db);
        const result = userDao.getUserByOAuth2Key(
            "provider1",
            "providerUser1",
        ) as UserSchema;
        expect(result.id).toEqual("1");
        expect(result.username).toEqual("user1");
    });

    test("returns null if user not found", () => {
        const userDao = new SQLiteUserDao(db);
        const result = userDao.getUserByOAuth2Key("", "");
        expect(result).toEqual(null);
    });
});

describe("createUserWithOAuth2Key", () => {
    const db = new Database(":memory:");

    beforeAll(() => {
        const schema = readFileSync(
            path.join(__dirname, "..", "..", "oauth2", "db", "schema.sql"),
            "utf8",
        );
        db.exec(schema);
    });

    afterEach(() => {
        db.exec(
            `
            DELETE FROM oauth2_key;
            DELETE FROM user;
            `,
        );
    });

    test("creates user", () => {
        const userDao = new SQLiteUserDao(db);
        userDao.createUserWithOAuth2Key("provider1", "providerUser1", {
            username: "user1",
        });
        const user = db
            .prepare(
                `
                SELECT id, username FROM user WHERE username = 'user1';
                `,
            )
            .get() as User;
        expect(user.username).toEqual("user1");
    });

    test("creates key", () => {
        const userDao = new SQLiteUserDao(db);
        userDao.createUserWithOAuth2Key("provider1", "providerUser1", {
            username: "user1",
        });
        const key = db
            .prepare(
                `
                SELECT id, user_id, provider_id, provider_user_id
                FROM oauth2_key
                WHERE provider_id = 'provider1' AND provider_user_id = 'providerUser1';
                `,
            )
            .get() as OAuth2KeySchema;
        expect(key.provider_id).toEqual("provider1");
        expect(key.provider_user_id).toEqual("providerUser1");
    });

    test("returns created user", () => {
        const userDao = new SQLiteUserDao(db);
        const user = userDao.createUserWithOAuth2Key(
            "providerId1",
            "providerUser1",
            { username: "user1" },
        );
        expect(user.username).toEqual("user1");
    });
});
