"use client";

import React, { useState } from "react";

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
  const [showSource] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
