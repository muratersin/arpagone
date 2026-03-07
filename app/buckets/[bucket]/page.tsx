import React from "react";

import EmailInbox from "@/components/EmailInbox";

export default async function Bucket({
  params,
}: Readonly<{
  params: Promise<{ bucket: string }>;
}>) {
  const { bucket } = await params;

  return <EmailInbox bucket={bucket} />;
}
