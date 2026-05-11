"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { MailOutlined, ReloadOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Checkbox,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";

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
  const [deleting, setDeleting] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(POLL_INTERVAL_MS / 1000);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
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
        setSelectedIds((prev) => {
          const validIds = new Set(data.map((item) => item.id));
          const next = new Set<string>();
          prev.forEach((id) => {
            if (validIds.has(id)) {
              next.add(id);
            }
          });
          return next;
        });
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

  const toggleSelection = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const selectedCount = selectedIds.size;
  const allSelected = emails.length > 0 && selectedCount === emails.length;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(emails.map((email) => email.id)));
  };

  const removeIdsFromState = (ids: string[]) => {
    const idSet = new Set(ids);
    setEmails((prev) => prev.filter((email) => !idSet.has(email.id)));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  };

  const deleteByIds = useCallback(async (ids: string[]) => {
    if (!ids.length) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/emails", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      const data = (await res.json()) as {
        deleted?: string[];
        failed?: Array<{ id: string; error?: string }>;
      };

      if (!res.ok) {
        message.error("Silme işlemi başarısız oldu.");
        return;
      }

      const deletedIds = data.deleted ?? [];
      const failed = data.failed ?? [];

      removeIdsFromState(deletedIds);

      if (deletedIds.length && !failed.length) {
        message.success(`${deletedIds.length} e-posta silindi.`);
        return;
      }

      if (deletedIds.length && failed.length) {
        message.warning(
          `${deletedIds.length} e-posta silindi, ${failed.length} e-posta silinemedi.`,
        );
        return;
      }

      message.error("Seçilen e-postalar silinemedi.");
    } catch {
      message.error("Silme sırasında beklenmeyen bir hata oluştu.");
    } finally {
      setDeleting(false);
    }
  }, []);

  const confirmDelete = (ids: string[]) => {
    if (!ids.length) {
      return;
    }

    const modal = Modal.confirm({
      title: "E-postaları sil",
      content: `${ids.length} e-postayı kalıcı olarak silmek istediğinizden emin misiniz?`,
      okText: "Sil",
      okButtonProps: { danger: true },
      cancelText: "Vazgeç",
      onOk: async () => {
        modal.update({ okButtonProps: { danger: true, loading: true } });
        try {
          await deleteByIds(ids);
        } finally {
          modal.update({ okButtonProps: { danger: true, loading: false } });
        }
      },
    });
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
          {selectedCount > 0 && (
            <Tag color="processing">{selectedCount} seçili</Tag>
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
              disabled={syncing || deleting}
            >
              {syncing ? "Senkronize ediliyor…" : "Yenile"}
            </Button>
          </Tooltip>
          <Button
            size="small"
            onClick={handleToggleSelectAll}
            disabled={!emails.length || deleting}
          >
            {allSelected ? "Seçimi temizle" : "Tümünü seç"}
          </Button>
          <Button
            size="small"
            danger
            disabled={!selectedCount || deleting}
            onClick={() => confirmDelete(Array.from(selectedIds))}
          >
            Seçileni sil
          </Button>
        </Space>
      </div>

      {/* Liste */}
      <Table<EmailItem>
        loading={loading}
        dataSource={emails}
        rowKey="id"
        showHeader={false}
        pagination={false}
        locale={{ emptyText: "Henüz e-posta yok" }}
        onRow={(email) => ({
          style: {
            background: email.read === 0 ? "#fffbf0" : "transparent",
            borderLeft:
              email.read === 0 ? "3px solid #FF9900" : "3px solid transparent",
            transition: "background 0.2s",
          },
        })}
        columns={[
          {
            key: "content",
            render: (_, email) => {
              const href = `/buckets/${encodeURIComponent(
                bucket,
              )}/objects/${encodeURIComponent(email.s3_key)}`;

              return (
                <div style={{ padding: "12px 0" }}>
                  <Space size={10}>
                    <Checkbox
                      checked={selectedIds.has(email.id)}
                      onChange={(e) =>
                        toggleSelection(email.id, e.target.checked)
                      }
                      disabled={deleting}
                    />
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
                  </Space>
                  <Space size={16} wrap style={{ marginTop: 6 }}>
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
                </div>
              );
            },
          },
          {
            key: "actions",
            width: 210,
            align: "right",
            render: (_, email) => (
              <Space size={4}>
                <Button
                  size="small"
                  type="text"
                  danger
                  disabled={deleting}
                  onClick={() => confirmDelete([email.id])}
                >
                  Sil
                </Button>
                {email.read === 0 ? (
                  <Button
                    size="small"
                    type="text"
                    disabled={deleting}
                    onClick={() => handleMarkRead(email.id)}
                  >
                    Okundu işaretle
                  </Button>
                ) : (
                  <Tag color="default" style={{ fontSize: 11 }}>
                    Okundu
                  </Tag>
                )}
              </Space>
            ),
          },
        ]}
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
