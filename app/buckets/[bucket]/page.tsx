import { listFiles } from "@/services/s3";
import React from "react";

import BucketList from "@/components/ButcketList";

interface DataType {
  key: React.Key;
  Key: string;
  ETag: string;
  LastModified: string;
}

export default async function Butcket({
  params,
}: {
  params: Promise<{ bucket: string }>;
}) {
  const { bucket } = await params;
  const files = (await listFiles({ bucket: bucket })).map((file, index) => ({
    key: index,
    Key: file.Key!,
    ETag: file.ETag!,
    LastModified: file.LastModified?.toISOString(),
  })) as DataType[];

  return <BucketList files={files} bucket={bucket} />;
}
