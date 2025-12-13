"use client";

import React from "react";
import Link from "next/link";
import { Button, Popconfirm, PopconfirmProps, Table } from "antd";
import { FolderOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";

type DataType = {
  key: React.Key;
  Key: string;
  ETag: string;
  LastModified: string;
};

export default function BucketList({
  files,
  bucket,
}: {
  files: DataType[];
  bucket: string;
}) {
  const router = useRouter();

  const confirm: PopconfirmProps["onConfirm"] = (key) => {
    router.push(
      `/buckets/${encodeURIComponent(bucket)}/objects/${encodeURIComponent(
        key as string
      )}/delete`
    );
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Key",
      dataIndex: "Key",
      key: "Key",
      render: (text: string, record) => {
        const href = `/buckets/${encodeURIComponent(
          bucket
        )}/objects/${encodeURIComponent(record.Key)}`;
        return <Link href={href}>{text}</Link>;
      },
    },
    { title: "ETag", dataIndex: "ETag", key: "ETag" },
    {
      title: "Date",
      dataIndex: "LastModified",
      key: "LastModified",
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Action",
      dataIndex: "Key",
      key: "Key",
      width: 100,
      align: "center",
      render: (key) => (
        <Popconfirm
          title="Delete the email"
          description="Are you sure to delete this email? This action cannot be undone."
          onConfirm={() => confirm(key)}
          placement="left"
          okText="Yes"
          cancelText="No"
        >
          <Button danger size="small" icon={<DeleteOutlined />} type="text">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 20px",
          background: "#fff",
          borderRadius: "6px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
        }}
      >
        <FolderOutlined style={{ fontSize: "24px", color: "#FF9900" }} />
        <div>
          <h1 style={{ margin: "0", fontSize: "20px", fontWeight: "600" }}>
            {bucket}
          </h1>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#999" }}>
            {files.length} object{files.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <Table<DataType>
        columns={columns}
        dataSource={files}
        rowKey="key"
        pagination={{ pageSize: 20 }}
        style={{ background: "#fff", borderRadius: "6px" }}
      />
    </div>
  );
}
