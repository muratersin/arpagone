import { redirect } from "next/navigation";

import { Spin } from "antd";

import { deleteObject } from "@/services/s3";

import "./delete.css";

export default async function DeleteMail({
  params,
}: {
  params: Promise<{ key: string; bucket: string }>;
}) {
  const { key, bucket } = await params;

  try {
    await deleteObject(bucket, key);
  } catch (error) {
    console.error("Error during deletion:", error);
  }
  redirect(`/buckets/${encodeURIComponent(bucket)}`);

  return (
    <div className="delete-page">
      <h4>Delete is in progress</h4>
      <Spin size="large" />
    </div>
  );
}
