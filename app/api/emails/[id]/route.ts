import { NextRequest, NextResponse } from "next/server";

import { getDb, type EmailRow } from "@/lib/db";
import { deleteObject } from "@/services/s3";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const db = getDb();
  const row = db
    .prepare("SELECT id, bucket, s3_key FROM emails WHERE id = ?")
    .get(id) as Pick<EmailRow, "id" | "bucket" | "s3_key"> | undefined;

  if (!row) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  try {
    await deleteObject(row.bucket, row.s3_key);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete from S3";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  db.prepare("DELETE FROM emails WHERE id = ?").run(id);

  return NextResponse.json({ ok: true, id });
}
