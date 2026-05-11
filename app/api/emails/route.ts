import { NextRequest, NextResponse } from "next/server";

import { getDb, type EmailRow } from "@/lib/db";
import { deleteObject } from "@/services/s3";

interface DeleteResult {
  id: string;
  ok: boolean;
  error?: string;
}

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

export async function DELETE(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const ids = (body as { ids?: unknown })?.ids;

  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.length > 100 ||
    ids.some((id) => typeof id !== "string" || !id.trim())
  ) {
    return NextResponse.json(
      {
        error: "ids must be a non-empty string array with at most 100 elements",
      },
      { status: 400 },
    );
  }

  const normalizedIds = ids.map((id) => id.trim());
  const uniqueIds = [...new Set(normalizedIds)];
  const placeholders = uniqueIds.map(() => "?").join(",");
  const db = getDb();

  const rows = db
    .prepare(
      `SELECT id, bucket, s3_key FROM emails WHERE id IN (${placeholders})`,
    )
    .all(...uniqueIds) as Array<Pick<EmailRow, "id" | "bucket" | "s3_key">>;

  const foundById = new Map(rows.map((row) => [row.id, row]));
  const results: DeleteResult[] = [];

  for (const id of uniqueIds) {
    const row = foundById.get(id);

    if (!row) {
      results.push({ id, ok: false, error: "Email not found" });
      continue;
    }

    try {
      await deleteObject(row.bucket, row.s3_key);
      db.prepare("DELETE FROM emails WHERE id = ?").run(id);
      results.push({ id, ok: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete from S3";
      results.push({ id, ok: false, error: message });
    }
  }

  const deleted = results.filter((r) => r.ok).map((r) => r.id);
  const failed = results.filter((r) => !r.ok);

  return NextResponse.json({
    ok: failed.length === 0,
    deleted,
    failed,
    results,
  });
}
