"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { MailOutlined, ReloadOutlined, SyncOutlined } from "@ant-design/icons";
import { Badge, Button, List, Space, Tag, Tooltip, Typography } from "antd";

const { Text } = Typography;

const POLL_INTERVAL_MS = 60_000; // 1 dakika

interface EmailItem {
  id: string;
  bucket: string;
  s3_key: string;
  subject: string | null;
  from_addr: string | null;
  to_addr: string | null;
  date: string | null;
  read: number;
  synced_at: string;
}

export default function EmailInbox({ bucket }: Readonly<{ bucket: string }>) {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(POLL_INTERVAL_MS / 1000);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/emails?bucket=${encodeURIComponent(bucket)}`,
      );
      if (res.ok) {
        const data: EmailItem[] = await res.json();
        setEmails(data);
      }
    } finally {
      setLoading(false);
    }
  }, [bucket]);

  const syncEmails = useCallback(async () => {
    setSyncing(true);
    try {
      await fetch("/api/emails/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket }),
      });
      await fetchEmails();
      setLastSync(new Date());
      setCountdown(POLL_INTERVAL_MS / 1000);
    } finally {
      setSyncing(false);
    }
  }, [bucket, fetchEmails]);

  // İlk yükleme
  useEffect(() => {
    fetchEmails();
    syncEmails();
  }, [fetchEmails, syncEmails]);

  // 1 dakikalık otomatik senkronizasyon
  useEffect(() => {
    timerRef.current = setInterval(() => {
      syncEmails();
    }, POLL_INTERVAL_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [syncEmails]);

  // Geri sayım
  useEffect(() => {
    setCountdown(POLL_INTERVAL_MS / 1000);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => (c <= 1 ? POLL_INTERVAL_MS / 1000 : c - 1));
    }, 1000);
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [lastSync]);

  const handleMarkRead = async (id: string) => {
    await fetch(`/api/emails/${id}/read`, { method: "PATCH" });
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, read: 1 } : e)));
  };

  const unreadCount = emails.filter((e) => e.read === 0).length;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid #f0f0f0",
          background: "#fafafa",
        }}
      >
        <Space>
          <MailOutlined style={{ fontSize: 18, color: "#FF9900" }} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>Gelen Kutusu</span>
          {unreadCount > 0 && (
            <Badge count={unreadCount} style={{ backgroundColor: "#FF9900" }} />
          )}
        </Space>

        <Space>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Sonraki güncelleme: {countdown}s
          </Text>
          <Tooltip title="Şimdi senkronize et">
            <Button
              size="small"
              icon={syncing ? <SyncOutlined spin /> : <ReloadOutlined />}
              onClick={syncEmails}
              disabled={syncing}
            >
              {syncing ? "Senkronize ediliyor…" : "Yenile"}
            </Button>
          </Tooltip>
        </Space>
      </div>

      {/* Liste */}
      <List
        loading={loading}
        dataSource={emails}
        locale={{ emptyText: "Henüz e-posta yok" }}
        renderItem={(email) => {
          const href = `/buckets/${encodeURIComponent(
            bucket,
          )}/objects/${encodeURIComponent(email.s3_key)}`;

          return (
            <List.Item
              key={email.id}
              style={{
                padding: "12px 20px",
                background: email.read === 0 ? "#fffbf0" : "transparent",
                borderLeft:
                  email.read === 0
                    ? "3px solid #FF9900"
                    : "3px solid transparent",
                transition: "background 0.2s",
              }}
              actions={[
                email.read === 0 ? (
                  <Button
                    key="read"
                    size="small"
                    type="text"
                    onClick={() => handleMarkRead(email.id)}
                  >
                    Okundu işaretle
                  </Button>
                ) : (
                  <Tag key="read-tag" color="default" style={{ fontSize: 11 }}>
                    Okundu
                  </Tag>
                ),
              ]}
            >
              <List.Item.Meta
                title={
                  <Link
                    href={href}
                    style={{ color: email.read === 0 ? "#000" : "#666" }}
                  >
                    <strong
                      style={{ fontWeight: email.read === 0 ? 700 : 400 }}
                    >
                      {email.subject || "(Konu yok)"}
                    </strong>
                  </Link>
                }
                description={
                  <Space size={16} wrap>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <strong>Gönderen:</strong>{" "}
                      {email.from_addr || "Bilinmiyor"}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <strong>Alıcı:</strong> {email.to_addr || "Bilinmiyor"}
                    </Text>
                    {email.date && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(email.date).toLocaleString("tr-TR")}
                      </Text>
                    )}
                  </Space>
                }
              />
            </List.Item>
          );
        }}
      />

      {lastSync && (
        <div
          style={{
            padding: "8px 20px",
            borderTop: "1px solid #f0f0f0",
            fontSize: 11,
            color: "#bbb",
            textAlign: "right",
          }}
        >
          Son senkronizasyon: {lastSync.toLocaleString("tr-TR")}
        </div>
      )}
    </div>
  );
}
