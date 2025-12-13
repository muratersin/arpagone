"use client";

import React from "react";
import Link from "next/link";
import { Button, Popconfirm, PopconfirmProps, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { redirect, RedirectType } from "next/navigation";

type DataType = {
  key: React.Key;
  Key: string;
  ETag: string;
  LastModified: string;
};

export default function BucketTableClient({
  files,
  bucket,
}: {
  files: DataType[];
  bucket: string;
}) {
  const confirm: PopconfirmProps["onConfirm"] = (key) => {
    redirect(
      `/buckets/${encodeURIComponent(bucket)}/objects/${encodeURIComponent(
        key as unknown as string
      )}/delete`,
      RedirectType.push
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
      render: (key) => (
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this?"
          onConfirm={() => confirm(key)}
          placement="left"
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return <Table<DataType> columns={columns} dataSource={files} rowKey="key" />;
}
