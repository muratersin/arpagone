"use client";

import React, { useState } from "react";
import { Form, Input, Button, Modal, message, Space, Divider } from "antd";
import { SendOutlined, CloseOutlined } from "@ant-design/icons";

interface SendEmailFormProps {
  toEmail: string;
  subject: string;
  onClose: () => void;
  isReply?: boolean;
}

export default function SendEmailForm({
  toEmail,
  subject,
  onClose,
  isReply = false,
}: SendEmailFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { message: string }) => {
    try {
      setLoading(true);

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toEmail,
          subject: isReply
            ? subject.startsWith("Re:")
              ? subject
              : `Re: ${subject}`
            : subject,
          htmlBody: values.message,
          textBody: values.message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send email");
      }

      message.success("Email sent successfully!");
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      message.error(
        error instanceof Error ? error.message : "Failed to send email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isReply ? "Reply to Email" : "Send Email"}
      open={true}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ marginBottom: 16 }}>
        <div>
          <strong>To:</strong> {toEmail}
        </div>
        <div>
          <strong>Subject:</strong>{" "}
          {isReply
            ? subject.startsWith("Re:")
              ? subject
              : `Re: ${subject}`
            : subject}
        </div>
      </div>

      <Divider />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="message"
          label="Message"
          rules={[
            { required: true, message: "Please enter your message" },
            { min: 10, message: "Message must be at least 10 characters" },
          ]}
        >
          <Input.TextArea
            rows={6}
            placeholder="Type your message here..."
            style={{ resize: "none" }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ float: "right" }}>
            <Button onClick={onClose} icon={<CloseOutlined />}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SendOutlined />}
            >
              Send Email
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
