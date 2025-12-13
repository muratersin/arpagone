"use client";

import React, { useRef, useState } from "react";
import { Button, Space, Tooltip } from "antd";
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
      />
    </div>
  );
};

export default function Email({ html }: { html: string }) {
  const [showSource, setShowSource] = useState(false);
  const htmlRef = useRef<HTMLDivElement | null>(null);

  function downloadHtml() {
    const blob = new Blob([html || ""], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function printHtml() {
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    w.document.write(html || "");
    w.document.close();
    w.focus();
    w.print();
    w.close();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Space>
          <Tooltip title="Download HTML">
            <Button
              onClick={downloadHtml}
              icon={<DownloadOutlined />}
              size="small"
            />
          </Tooltip>
          <Tooltip title={showSource ? "Hide source" : "View source"}>
            <Button
              onClick={() => setShowSource((s) => !s)}
              icon={<FileTextOutlined />}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Print">
            <Button
              onClick={printHtml}
              icon={<PrinterOutlined />}
              size="small"
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
          }}
        >
          {html || ""}
        </pre>
      ) : (
        <RawHtmlRenderer html={html || ""} />
      )}
    </div>
  );
}
