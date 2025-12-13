import type { SESv2ClientConfig } from "@aws-sdk/client-sesv2";

const sesConfig: SESv2ClientConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

export default sesConfig;
