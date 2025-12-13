import { getFileBuffer } from "@/services/s3";

import Email from "@/components/Email";

export default async function Objects({
  params,
}: {
  params: Promise<{ key: string; bucket: string }>;
}) {
  const { key, bucket } = await params;
  const mail = await getFileBuffer(bucket, key);
  const to = Array.isArray(mail?.to)
    ? mail?.to.map((t) => t.text).join(", ")
    : mail?.to?.text;

  return (
    <div>
      <h3>Subject: {mail?.subject}</h3>
      <h5>From: {mail?.from?.text}</h5>
      <h5>To: {to}</h5>
      <Email html={mail?.html || ""} />
    </div>
  );
}
