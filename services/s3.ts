import { ParsedMail, simpleParser } from "mailparser";
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
  type Bucket,
  _Object,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import s3Config from "@/config/s3.config";

const client = new S3Client(s3Config);

export async function listBuckets(): Promise<Bucket[] | undefined> {
  try {
    const command = new ListBucketsCommand({});
    const response = await client.send(command);

    if (!response.Buckets || response.Buckets.length === 0) {
      return [];
    }

    return response.Buckets;
  } catch (err) {
    console.error("Bucket listesi alınırken hata:", err);
  }
}

export async function listFiles(params: {
  bucket: string;
}): Promise<_Object[]> {
  const { bucket } = params;
  const command = new ListObjectsCommand({
    Bucket: bucket,
  });
  const response = await client.send(command);
  return response.Contents ?? [];
}

export async function getFile(bucket: string, key: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const response = await client.send(command);
  return response;
}

async function streamToBuffer(stream: unknown): Promise<Buffer> {
  if (!stream) return Buffer.from([]);

  if (stream instanceof Uint8Array) return Buffer.from(stream);
  if (typeof stream === "string") return Buffer.from(stream);

  if (
    typeof (stream as unknown as { arrayBuffer?: unknown }).arrayBuffer ===
    "function"
  ) {
    const blob = stream as unknown as {
      arrayBuffer: () => Promise<ArrayBuffer>;
    };
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  const chunks: Buffer[] = [];
  try {
    for await (const chunk of stream as AsyncIterable<Uint8Array | string>) {
      chunks.push(
        typeof chunk === "string" ? Buffer.from(chunk) : Buffer.from(chunk)
      );
    }
  } catch (err) {
    if (Buffer.isBuffer(stream as unknown as Buffer)) return stream as Buffer;
    throw err;
  }

  return Buffer.concat(chunks);
}

export async function getFileBuffer(
  bucket: string,
  key: string
): Promise<ParsedMail | null> {
  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await client.send(command);
    const body = response.Body as unknown;
    if (!body) return null;
    const buf = await streamToBuffer(body);

    return simpleParser(buf);
  } catch (err) {
    console.error("Dosya alınırken hata:", err);
    return null;
  }
}

export function deleteObject(bucket: string, key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return client.send(command);
}
