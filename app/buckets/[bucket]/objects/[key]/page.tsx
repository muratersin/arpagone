import { getFileBuffer } from "@/services/s3";
import { Card, Empty, Space } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";

import Email from "@/components/Email";
import MailActions from "@/components/MailActions";

export default async function Objects({
  params,
}: {
  params: Promise<{ key: string; bucket: string }>;
}) {
  const { key, bucket } = await params;
  const mail = await getFileBuffer(bucket, key);
  const to = Array.isArray(mail?.to)
    ? mail?.to.map((t) => t.text).join(", ")
    : mail?.to?.text;

  if (!mail) {
    return <Empty description="Email not found" style={{ marginTop: 50 }} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderRadius: 8 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <h1
              style={{
                margin: "0 0 8px 0",
                fontSize: 20,
                fontWeight: 700,
                wordBreak: "break-word",
              }}
            >
              {mail?.subject || "(No Subject)"}
            </h1>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Space size={12}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <UserOutlined style={{ color: "#FF9900" }} />
                  <strong style={{ fontSize: 13 }}>
                    {mail?.from?.text || "Unknown"}
                  </strong>
                </span>

                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <UserOutlined style={{ color: "#FF9900" }} />
                  <span style={{ color: "#666" }}>{to || "Unknown"}</span>
                </span>

                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CalendarOutlined style={{ color: "#999" }} />
                  <span style={{ color: "#666" }}>
                    {mail?.date
                      ? typeof mail.date === "string"
                        ? mail.date
                        : // mail.date may be a Date object
                          new Date(mail.date).toLocaleString()
                      : ""}
                  </span>
                </span>
              </Space>
            </div>
          </div>

          <div style={{ marginLeft: 12 }}>
            {/* MailActions is a client component that handles reply/forward/download */}
            {/* Passing html and metadata to enable client-side actions */}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <MailActions
              from={mail?.from?.text}
              subject={mail?.subject}
              html={mail?.html}
            />
          </div>
        </div>
      </Card>

      <Card
        title="Message"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderRadius: 8 }}
      >
        <Email html={mail?.html || ""} />
      </Card>
    </div>
  );
}
