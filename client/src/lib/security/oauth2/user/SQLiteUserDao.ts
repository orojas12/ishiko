import type { Database } from "better-sqlite3";
import type { User, UserDao } from "./user";

export class SQLiteUserDao implements UserDao {
    db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    getUserByOAuth2Key = (
        providerId: string,
        providerUserId: string,
    ): User | undefined => {
        return this.db
            .prepare(
                `
                SELECT id, name 
                FROM user u INNER JOIN oauth2_key o 
                ON u.id = o.user_id
                WHERE o.id = ?;
                `,
            )
            .get(providerId + ":" + providerUserId) as User | undefined;
    };
}
