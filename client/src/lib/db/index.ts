import Database from "better-sqlite3";
import { readFileSync } from "fs";

export function initdb(uri: string) {
    const db = new Database(uri);
    const schema = readFileSync(
        "/home/oscar/projects/ishiko/client/src/lib/db/schema.sql",
        "utf8",
    );
    db.exec(schema);
    return db;
}
