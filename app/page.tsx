import { Empty } from "antd";
import { CloudServerOutlined } from "@ant-design/icons";

export default async function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 200px)",
        padding: "40px 20px",
      }}
    >
      <Empty
        image={
          <CloudServerOutlined style={{ fontSize: "64px", color: "#FF9900" }} />
        }
        description={
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                marginBottom: "8px",
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              Welcome to Arpagone
            </h2>
            <p style={{ color: "#666", fontSize: "14px" }}>
              Your AWS S3 Mail Viewer
            </p>
          </div>
        }
        style={{ textAlign: "center" }}
      >
        <div style={{ marginTop: "24px", color: "#999", maxWidth: "400px" }}>
          <p>
            Select a bucket from the sidebar to browse and manage your emails
            stored in AWS S3.
          </p>
          <p style={{ fontSize: "12px" }}>
            💡 Tip: Once you select a bucket, you&apos;ll be able to view and
            interact with your emails.
          </p>
        </div>
      </Empty>
    </div>
  );
}
