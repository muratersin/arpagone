import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

import sesConfig from "@/config/ses.config";

const client = new SESv2Client(sesConfig);

export interface SendEmailParams {
  toEmail: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  replyToEmail?: string;
}

export async function sendEmail({
  toEmail,
  subject,
  htmlBody,
  textBody,
  replyToEmail,
}: SendEmailParams): Promise<string | null> {
  try {
    const fromEmail = process.env.SES_FROM_EMAIL || "noreply@example.com";

    const command = new SendEmailCommand({
      FromEmailAddress: fromEmail,
      Destination: {
        ToAddresses: [toEmail],
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: htmlBody,
              Charset: "UTF-8",
            },
            ...(textBody && {
              Text: {
                Data: textBody,
                Charset: "UTF-8",
              },
            }),
          },
        },
      },
      ...(replyToEmail && {
        ReplyToAddresses: [replyToEmail],
      }),
    });

    const response = await client.send(command);

    return response.MessageId || null;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendReplyEmail({
  toEmail,
  originalSubject,
  replyBody,
  replyToEmail,
}: {
  toEmail: string;
  originalSubject: string;
  replyBody: string;
  replyToEmail?: string;
}): Promise<string | null> {
  const subject = originalSubject.startsWith("Re:")
    ? originalSubject
    : `Re: ${originalSubject}`;

  return sendEmail({
    toEmail,
    subject,
    htmlBody: replyBody,
    textBody: replyBody,
    replyToEmail,
  });
}
