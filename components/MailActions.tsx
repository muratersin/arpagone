"use client";

import React from "react";
import { Button, Space, Tooltip } from "antd";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import SendEmailModal from "@/components/SendEmailModal";

export default function MailActions({
  from,
  subject,
  html,
  onDelete,
}: {
  from?: string;
  subject?: string;
  html?: string;
  onDelete?: () => void;
}) {
  function downloadHtml() {
    const blob = new Blob([html || ""], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${subject || "email"}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Space>
        <SendEmailModal fromEmail={from} subject={subject} />

        <Tooltip title="Download HTML">
          <Button
            onClick={downloadHtml}
            icon={<DownloadOutlined />}
            size="small"
          >
            Download
          </Button>
        </Tooltip>
        {onDelete && (
          <Tooltip title="Delete">
            <Button
              onClick={onDelete}
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Tooltip>
        )}
      </Space>
    </div>
  );
}
