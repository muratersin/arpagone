"use client";

import React, { useState } from "react";
import { Button, Space, Tooltip, message } from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

const RawHtmlRenderer = ({ html }: { html: string }) => {
  return (
    <div
      style={{
        width: "100%",
        overflow: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "16px",
          background: "#ffffff",
          color: "#111",
          lineHeight: 1.6,
          borderRadius: 6,
        }}
        dangerouslySetInnerHTML={{ __html: html }}
        role="region"
        aria-label="Email content"
      />
    </div>
  );
};

export default function Email({ html }: { html: string }) {
  const [showSource, setShowSource] = useState(false);

  const downloadHtml = () => {
    try {
      const blob = new Blob([html || ""], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "email.html";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success("Email downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      message.error("Failed to download email");
    }
  };

  const printHtml = () => {
    try {
      const printWindow = window.open("", "_blank", "noopener,noreferrer");
      if (!printWindow) {
        message.error(
          "Failed to open print window. Please check popup blocker."
        );
        return;
      }
      printWindow.document.write(html || "");
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } catch (error) {
      console.error("Print error:", error);
      message.error("Failed to print email");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Space>
          <Tooltip title="Download HTML">
            <Button
              onClick={downloadHtml}
              icon={<DownloadOutlined />}
              size="small"
              aria-label="Download email as HTML"
              type="default"
            />
          </Tooltip>
          <Tooltip title={showSource ? "Hide source" : "View source"}>
            <Button
              onClick={() => setShowSource((s) => !s)}
              icon={<FileTextOutlined />}
              size="small"
              aria-label={showSource ? "Hide source" : "View source"}
              aria-pressed={showSource}
              type={showSource ? "primary" : "default"}
            />
          </Tooltip>
          <Tooltip title="Print">
            <Button
              onClick={printHtml}
              icon={<PrinterOutlined />}
              size="small"
              aria-label="Print email"
              type="default"
            />
          </Tooltip>
        </Space>
      </div>

      {showSource ? (
        <pre
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "12px",
            background: "#0f1720",
            color: "#e6eef6",
            borderRadius: 6,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "'Courier New', monospace",
          }}
          role="region"
          aria-label="Email HTML source code"
        >
          {html || ""}
        </pre>
      ) : (
        <RawHtmlRenderer html={html || ""} />
      )}
    </div>
  );
}
