import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

import {
  getDefaultSesFromEmail,
  isAllowedSesFromEmail,
} from "@/lib/ses-from-email";
import sesConfig from "@/config/ses.config";

const client = new SESv2Client(sesConfig);

export interface SendEmailParams {
  toEmail: string;
  subject: string;
  fromEmail?: string;
  htmlBody: string;
  textBody?: string;
  replyToEmail?: string;
}

export async function sendEmail({
  toEmail,
  subject,
  fromEmail,
  htmlBody,
  textBody,
  replyToEmail,
}: SendEmailParams): Promise<string | null> {
  try {
    const finalFromEmail = fromEmail?.trim() || getDefaultSesFromEmail();

    if (!isAllowedSesFromEmail(finalFromEmail)) {
      throw new Error(
        "Invalid fromEmail. It must be one of SES_FROM_EMAIL values.",
      );
    }

    const command = new SendEmailCommand({
      FromEmailAddress: finalFromEmail,
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
