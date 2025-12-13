"use client";

import { Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useState } from "react";
import SendEmailForm from "./SendEmailForm";

interface LogoProps {
  fromEmail?: string;
}

export default function Logo({ fromEmail = "noreply@example.com" }: LogoProps) {
  const [showSendForm, setShowSendForm] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
      <div
        style={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          width={50}
          fill="none"
        >
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="#F3F4F6"
            stroke="#333333"
            strokeWidth="10"
          />

          <g transform="rotate(15 100 100)">
            <circle
              cx="100"
              cy="100"
              r="65"
              fill="#ECB390"
              stroke="#333333"
              strokeWidth="6"
            />
            <line
              x1="47"
              y1="100"
              x2="30"
              y2="100"
              stroke="#333333"
              strokeWidth="8"
            />
            <line
              x1="100"
              y1="47"
              x2="100"
              y2="30"
              stroke="#333333"
              strokeWidth="8"
            />
            <line
              x1="153"
              y1="100"
              x2="170"
              y2="100"
              stroke="#333333"
              strokeWidth="8"
            />
            <line
              x1="100"
              y1="153"
              x2="100"
              y2="170"
              stroke="#333333"
              strokeWidth="8"
            />
          </g>

          <circle
            cx="100"
            cy="100"
            r="35"
            fill="#FFD700"
            stroke="#CC9C00"
            strokeWidth="4"
          />
          <text
            x="100"
            y="108"
            textAnchor="middle"
            fontSize="30"
            fill="#333333"
            fontFamily="Arial, sans-serif"
          >
            $
          </text>
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{ fontSize: "16px", fontWeight: "700", color: "#FFFFFF" }}
          >
            Arpagone
          </span>
          <span
            style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.65)" }}
          >
            S3 Mail Viewer
          </span>
        </div>
      </div>
      <div
        style={{
          padding: "8px 16px 12px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            color: "rgba(255, 255, 255, 0.65)",
            wordBreak: "break-all",
            fontFamily: "monospace",
            marginBottom: "8px",
          }}
        >
          📧 {fromEmail}
        </div>
      </div>
      <div style={{ padding: "0 12px 12px 12px" }}>
        <Button
          type="primary"
          icon={<MailOutlined />}
          onClick={() => setShowSendForm(true)}
          block
          size="small"
        >
          Send Email
        </Button>
      </div>

      {showSendForm && (
        <SendEmailForm onClose={() => setShowSendForm(false)} isReply={false} />
      )}
    </div>
  );
}
