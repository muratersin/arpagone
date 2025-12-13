# Arpagone - AWS S3 Mail Viewer

A professional web application for viewing and managing emails stored in AWS S3 buckets. Features include email browsing, viewing, and sending replies via Amazon SES.

## Features

- 📧 Browse emails stored in AWS S3 buckets
- 👀 View email content with rich HTML rendering
- 💌 Reply to emails via Amazon SES
- 📥 Download emails as HTML files
- 🖨️ Print email functionality
- 📱 Responsive design with Ant Design UI
- 🧪 Unit tests with Jest

## Prerequisites

- Node.js 18+
- npm or yarn
- AWS Account with:
  - S3 bucket containing email files
  - IAM user with S3 and SES permissions
  - SES verified sender email address

## Environment Setup

1. Copy `example.env` to `.env.local`:

```bash
cp example.env .env.local
```

2. Fill in your AWS credentials:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
SES_FROM_EMAIL=noreply@yourdomain.com
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
