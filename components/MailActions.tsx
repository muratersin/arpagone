"use client";

import React from "react";
import { Button, Space, Tooltip } from "antd";
import {
  MailOutlined,
  ReloadOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

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
  function mailtoReply() {
    const to = from || "";
    const subj = subject ? `Re: ${subject}` : "";
    window.location.href = `mailto:${encodeURIComponent(
      to
    )}?subject=${encodeURIComponent(subj)}`;
  }

  function mailtoForward() {
    const subj = subject ? `Fwd: ${subject}` : "";
    const body = html ? encodeURIComponent(html) : "";
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subj
    )}&body=${body}`;
  }

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
        <Tooltip title="Reply">
          <Button onClick={mailtoReply} icon={<MailOutlined />} size="small">
            Reply
          </Button>
        </Tooltip>
        <Tooltip title="Forward">
          <Button
            onClick={mailtoForward}
            icon={<ReloadOutlined />}
            size="small"
          >
            Forward
          </Button>
        </Tooltip>
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
