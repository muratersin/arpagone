import Database from "better-sqlite3";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "emails.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");

  _db.exec(`
    CREATE TABLE IF NOT EXISTS emails (
      id         TEXT PRIMARY KEY,
      bucket     TEXT NOT NULL,
      s3_key     TEXT NOT NULL,
      subject    TEXT,
      from_addr  TEXT,
      to_addr    TEXT,
      date       TEXT,
      html       TEXT,
      body_text  TEXT,
      read       INTEGER NOT NULL DEFAULT 0,
      synced_at  TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(bucket, s3_key)
    )
  `);

  return _db;
}

export interface EmailRow {
  id: string;
  bucket: string;
  s3_key: string;
  subject: string | null;
  from_addr: string | null;
  to_addr: string | null;
  date: string | null;
  html: string | null;
  body_text: string | null;
  read: number;
  synced_at: string;
}
