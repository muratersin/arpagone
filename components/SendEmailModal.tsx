"use client";

import React, { useState } from "react";
import { Button, Space, Tooltip } from "antd";
import { MailOutlined, ReloadOutlined } from "@ant-design/icons";
import SendEmailForm from "./SendEmailForm";

export default function SendEmailModal({
  fromEmail,
  subject,
}: {
  fromEmail?: string;
  subject?: string;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  if (!fromEmail) {
    return null;
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Space>
          <Tooltip title="Reply to this email">
            <Button
              onClick={() => setShowReplyForm(true)}
              icon={<MailOutlined />}
              size="small"
              type="primary"
            >
              Reply
            </Button>
          </Tooltip>
        </Space>
      </div>

      {showReplyForm && (
        <SendEmailForm
          toEmail={"mmuratersin@live.com"}
          subject={subject || ""}
          onClose={() => setShowReplyForm(false)}
          isReply={true}
        />
      )}
    </>
  );
}
