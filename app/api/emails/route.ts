import { NextRequest, NextResponse } from "next/server";

import { getDb, type EmailRow } from "@/lib/db";

export async function GET(req: NextRequest) {
  const bucket = req.nextUrl.searchParams.get("bucket");

  if (!bucket) {
    return NextResponse.json({ error: "bucket is required" }, { status: 400 });
  }

  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, bucket, s3_key, subject, from_addr, to_addr, date, read, synced_at
       FROM emails
       WHERE bucket = ?
       ORDER BY date DESC, synced_at DESC`,
    )
    .all(bucket) as EmailRow[];

  return NextResponse.json(rows);
}
