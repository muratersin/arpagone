import { NextRequest, NextResponse } from "next/server";

import { randomUUID } from "node:crypto";

import { getDb } from "@/lib/db";
import { listFiles, getFileBuffer } from "@/services/s3";

export async function POST(req: NextRequest) {
  const { bucket } = await req.json();

  if (!bucket || typeof bucket !== "string") {
    return NextResponse.json({ error: "bucket is required" }, { status: 400 });
  }

  const db = getDb();
  const objects = await listFiles({ bucket });

  const insert = db.prepare(`
    INSERT OR IGNORE INTO emails
      (id, bucket, s3_key, subject, from_addr, to_addr, date, html, body_text, read)
    VALUES
      (@id, @bucket, @s3_key, @subject, @from_addr, @to_addr, @date, @html, @body_text, 0)
  `);

  let synced = 0;

  for (const obj of objects) {
    const key = obj.Key;
    if (!key) {
      continue;
    }

    const existing = db
      .prepare("SELECT id FROM emails WHERE bucket = ? AND s3_key = ?")
      .get(bucket, key);

    if (existing) {
      continue;
    }

    const mail = await getFileBuffer(bucket, key);
    if (!mail) {
      continue;
    }

    const toAddr = Array.isArray(mail.to)
      ? mail.to.map((t) => t.text).join(", ")
      : (mail.to?.text ?? null);

    insert.run({
      id: randomUUID(),
      bucket,
      s3_key: key,
      subject: mail.subject ?? null,
      from_addr: mail.from?.text ?? null,
      to_addr: toAddr,
      date: mail.date ? mail.date.toISOString() : null,
      html: typeof mail.html === "string" ? mail.html : null,
      body_text: mail.text ?? null,
    });

    synced++;
  }

  return NextResponse.json({ synced, total: objects.length });
}
