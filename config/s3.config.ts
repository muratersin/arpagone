import { S3ClientConfigType } from "@aws-sdk/client-s3";

const s3Config: S3ClientConfigType = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
};

export default s3Config;
