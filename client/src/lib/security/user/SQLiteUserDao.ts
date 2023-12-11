import type { Database } from "better-sqlite3";
import type { User, UserDao, UserSchema } from ".";
import { nanoid } from "nanoid";

export class SQLiteUserDao implements UserDao {
    db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    getUserByOAuth2Key = (
        providerId: string,
        providerUserId: string,
    ): User | null => {
        return (
            (this.db
                .prepare(
                    `
                    SELECT u.id, u.username 
                    FROM user u INNER JOIN oauth2_key o 
                    ON u.id = o.user_id
                    WHERE o.provider_id = ? AND o.provider_user_id = ?;
                    `,
                )
                .get(providerId, providerUserId) as User) || null
        );
    };

    createUserWithOAuth2Key = (
        providerId: string,
        providerUserId: string,
        user: Omit<User, "id">,
    ): User => {
        const userId = nanoid();
        const keyId = nanoid();
        this.db
            .prepare(
                `
                INSERT INTO user (id, username)
                VALUES (?, ?);
                `,
            )
            .run(userId, user.username);
        this.db
            .prepare(
                `
                INSERT INTO oauth2_key
                    (id, user_id, provider_id, provider_user_id)
                VALUES (?, ?, ?, ?);
                `,
            )
            .run(keyId, userId, providerId, providerUserId);
        const result = this.db
            .prepare(
                `
                SELECT id, username FROM user WHERE id = ?;
                `,
            )
            .get(userId) as UserSchema;
        return {
            id: result.id,
            username: result.username,
        };
    };
}
