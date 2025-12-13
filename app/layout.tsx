import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Content, Footer } from "antd/es/layout/layout";
import { Layout, Menu } from "antd";
import Link from "next/link";
import Sider from "antd/es/layout/Sider";

import Logo from "@/components/Logo";
import { listBuckets } from "@/services/s3";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arpagone - AWS S3 Mail Viewer",
  description:
    "A professional tool for viewing and managing emails stored in AWS S3 buckets",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bucketList = await listBuckets();
  const items = bucketList?.map((bucket) => ({
    key: bucket.Name,
    label: <Link href={`/buckets/${bucket.Name}`}>{bucket.Name}</Link>,
  }));

  const fromEmail = process.env.SES_FROM_EMAIL || "noreply@example.com";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <AntdRegistry>
          <Layout hasSider className="h-screen">
            <Sider width={280} style={{ background: "#001529" }}>
              <Logo fromEmail={fromEmail} />
              <Menu
                theme="dark"
                mode="inline"
                items={items}
                style={{ border: "none" }}
              />
            </Sider>
            <Layout style={{ display: "flex", flexDirection: "column" }}>
              <Content
                style={{
                  margin: "24px 16px 0",
                  overflow: "auto",
                  flex: 1,
                  padding: "0 8px",
                }}
              >
                {children}
              </Content>
              <Footer
                style={{
                  textAlign: "center",
                  background: "#f5f5f5",
                  borderTop: "1px solid #d9d9d9",
                  padding: "16px",
                }}
              >
                <div style={{ fontSize: "13px", color: "#666" }}>
                  Arpagone ©{new Date().getFullYear()} · AWS S3 Mail Viewer
                </div>
              </Footer>
            </Layout>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
