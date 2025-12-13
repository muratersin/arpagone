import { NextRequest, NextResponse } from "next/server";
import { sendEmail, SendEmailParams } from "@/services/ses";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      toEmail,
      subject,
      htmlBody,
      textBody,
      replyToEmail,
    }: SendEmailParams = body;

    if (!toEmail || !subject || !htmlBody) {
      return NextResponse.json(
        { error: "Missing required fields: toEmail, subject, htmlBody" },
        { status: 400 }
      );
    }

    const messageId = await sendEmail({
      toEmail,
      subject,
      htmlBody,
      textBody,
      replyToEmail,
    });

    return NextResponse.json({ success: true, messageId }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 }
    );
  }
}
