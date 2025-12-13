import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Content, Footer } from "antd/es/layout/layout";
import { Layout, Menu } from "antd";
import Link from "next/link";
import Sider from "antd/es/layout/Sider";

import Breadcrumb from "@/components/Breadcrumb";
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
  title: "Arpagon",
  description: "AWS S3 Mail Viewer for Arpagones",
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

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <AntdRegistry>
          <Layout hasSider className="h-screen">
            <Sider>
              <div className="demo-logo-vertical" />
              <Menu theme="dark" mode="inline" items={items} />
            </Sider>
            <Layout>
              <Breadcrumb />
              <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
                {children}
              </Content>
              <Footer style={{ textAlign: "center" }}>
                Arpagon ©{new Date().getFullYear()} Created by Harpagon
              </Footer>
            </Layout>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
