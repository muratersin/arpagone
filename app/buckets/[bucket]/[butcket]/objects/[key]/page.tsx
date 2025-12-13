import { getFileBuffer } from "@/services/s3";
import { Card, Divider, Row, Col, Empty } from "antd";
import { MailOutlined, UserOutlined, UsersOutlined } from "@ant-design/icons";

import Email from "@/components/Email";

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
    return (
      <Empty description="Email not found" style={{ marginTop: "50px" }} />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Email Header Card */}
      <Card
        style={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <h1
            style={{
              margin: "0 0 16px 0",
              fontSize: "20px",
              fontWeight: "600",
              wordBreak: "break-word",
            }}
          >
            {mail?.subject || "No Subject"}
          </h1>
        </div>

        <Divider style={{ margin: "12px 0" }} />

        {/* From, To, Date row */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12}>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <UserOutlined style={{ color: "#FF9900", fontSize: "14px" }} />
                <span
                  style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}
                >
                  FROM
                </span>
              </div>
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  color: "#171717",
                }}
              >
                {mail?.from?.text || "Unknown"}
              </p>
            </div>
          </Col>

          <Col xs={24} sm={12}>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <UsersOutlined style={{ color: "#FF9900", fontSize: "14px" }} />
                <span
                  style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}
                >
                  TO
                </span>
              </div>
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  color: "#171717",
                  wordBreak: "break-word",
                }}
              >
                {to || "Unknown"}
              </p>
            </div>
          </Col>
        </Row>

        {mail?.cc && (
          <>
            <Divider style={{ margin: "12px 0" }} />
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <MailOutlined style={{ color: "#FF9900", fontSize: "14px" }} />
                <span
                  style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}
                >
                  CC
                </span>
              </div>
              <p style={{ margin: "0", fontSize: "14px", color: "#171717" }}>
                {Array.isArray(mail.cc)
                  ? mail.cc.map((c: any) => c.text).join(", ")
                  : mail.cc}
              </p>
            </div>
          </>
        )}
      </Card>

      {/* Email Content Card */}
      <Card
        title="Email Body"
        style={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          borderRadius: "8px",
        }}
      >
        <Email html={mail?.html || ""} />
      </Card>
    </div>
  );
}
