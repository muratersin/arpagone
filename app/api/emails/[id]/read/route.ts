import { NextRequest, NextResponse } from "next/server";

import { getDb } from "@/lib/db";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = getDb();

  const result = db.prepare("UPDATE emails SET read = 1 WHERE id = ?").run(id);

  if (result.changes === 0) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
