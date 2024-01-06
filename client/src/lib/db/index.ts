import Database from "better-sqlite3";
import { schema } from "@/lib/oauth2";

export function initdb(uri: string) {
    const db = new Database(uri);
    db.exec(schema);
    return db;
}
