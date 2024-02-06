import Database from "better-sqlite3";
import { schema } from "@/lib/oauth2";
import path from "path";

export function initdb(uri: string) {
    const db = new Database(uri);
    db.pragma("journal_mode = WAL");
    db.exec(schema);
    return db;
}

export const db = initdb("dev.db");
