# 📧 Arpagone - AWS S3 Mail Viewer

<div align="center">

**A lightweight, free and open-source web application for viewing and managing emails stored in AWS S3 buckets.**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9C%93-brightgreen)](#)

</div>

## 🎯 Overview

**Arpagone is completely free and open-source.**

It's a professional email management solution that replaces expensive enterprise mail services. Instead of paying $4-6/month for AWS WorkMail, you can build your own email system using your existing AWS S3 and SES services. The application itself costs nothing—only your AWS usage matters (typically $0.10-0.50/month).

### Why Choose Arpagone?

| Feature             | AWS WorkMail | Arpagone   |
| ------------------- | ------------ | ---------- |
| **Monthly Cost**    | $4-6         | $0.10-0.50 |
| **Setup Time**      | 30 min       | 5 min      |
| **Email Viewing**   | ✅           | ✅         |
| **Email Sending**   | ✅           | ✅         |
| **Download Emails** | Limited      | ✅         |
| **Open Source**     | ❌           | ✅         |

## ✨ Features

- 📧 **Email Browsing** - View all emails in your S3 buckets
- 👀 **HTML Preview** - Full HTML email rendering
- 💌 **Reply with SES** - Send responses directly through AWS SES
- 📥 **Download** - Export emails as HTML files
- 🖨️ **Print** - Print emails from your browser
- 🔐 **Secure** - IAM-based access control
- ⚡ **Fast** - Built with Next.js and Turbopack
- 🎨 **Modern UI** - Professional Ant Design interface
- 📱 **Responsive** - Works on all devices
- 🧪 **Tested** - Jest unit tests included
- 🆓 **Completely Free** - Open-source MIT licensed, no paid tiers
- 📂 **Self-Hosted** - Deploy anywhere you want (Vercel, Docker, VPS)

## 📋 Requirements

### System

- Node.js 18.17+
- npm 9+ or yarn 3+

### AWS Account

- S3 bucket with emails in `.eml` format
- SES verified sender email (for sending only)
- IAM user with S3 and SES permissions

### IAM Permissions

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket", "s3:DeleteObject"],
      "Resource": ["arn:aws:s3:::your-bucket", "arn:aws:s3:::your-bucket/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["sesv2:SendEmail"],
      "Resource": "*"
    }
  ]
}
```

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/muratersin/arpagone.git
cd arpagone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp example.env .env.local
```

### 4. Configure `.env.local`

```env
# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# AWS SES (for sending emails)
SES_FROM_EMAIL=verified@yourdomain.com,sales@yourdomain.com,support@yourdomain.com
```

### 5. Run Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

## 📖 Usage

### Viewing Emails

1. Select an S3 bucket from the left sidebar
2. Browse emails in the table
3. Click an email to view full content
4. See HTML rendering with all formatting preserved

### Sending Emails

1. Click **Reply** on an email
2. Type your message
3. Click **Send Email**
4. Get confirmation message

### Email Actions

- **Download** - Save as HTML file
- **View Source** - See raw HTML code
- **Print** - Open browser print dialog
- **Delete** - Remove from S3

## 🛠️ Development

### Run Tests

```bash
npm test
```

### Watch Mode

```bash
npm test:watch
```

### Linting

```bash
npm run lint
```

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
arpagone/
├── app/
│   ├── api/                          # API routes
│   ├── buckets/[bucket]/            # Bucket pages
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page
│   └── globals.css                  # Global styles
├── components/
│   ├── BucketList.tsx              # Email table
│   ├── Email.tsx                   # Email viewer
│   ├── SendEmailForm.tsx           # Send form
│   ├── MailActions.tsx             # Action buttons
│   └── Logo.tsx                    # Logo/header
├── services/
│   ├── s3.ts                       # S3 operations
│   └── ses.ts                      # Email sending
├── config/
│   ├── s3.config.ts               # S3 config
│   └── ses.config.ts              # SES config
└── public/                          # Static files
```

## 🔐 Security

⚠️ **Important Security Notes:**

- Never commit `.env.local` to git
- Use IAM least privilege principle
- Emails assumed from trusted sources

## 📊 API Endpoints

### POST `/api/send-email`

Send email via SES.

**Request:**

```json
{
  "toEmail": "recipient@example.com",
  "subject": "Hello",
  "htmlBody": "<p>Message</p>",
  "textBody": "Message",
  "replyToEmail": "optional@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "messageId": "000..."
}
```

## 💻 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **UI Library**: Ant Design
- **AWS SDK**: AWS SDK v3 (S3, SES)
- **Email Parser**: mailparser
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint with TypeScript
- **Git Hooks**: Husky + Commitlint

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Port 3000 Already In Use

**Linux/Mac:**

```bash
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**Windows:**

```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### SES: "Email Not Verified"

Go to AWS Console → SES → Email Addresses → Verify sender

### S3: "Access Denied"

Check IAM permissions are correct

## 📚 Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ant Design](https://ant.design/)
- [mailparser Package](https://www.npmjs.com/package/mailparser)

## 💰 Cost Comparison

**Arpagone is 100% Free. Compare your options:**

| Service          | Cost        | License           |
| ---------------- | ----------- | ----------------- |
| **Arpagone**     | **Free**    | Open Source (MIT) |
| AWS WorkMail     | $4-6/month  | Proprietary       |
| Google Workspace | $6-18/month | Proprietary       |
| Microsoft 365    | $6/month    | Proprietary       |

**AWS Service Costs (Usage-based):**

- S3 Storage: $0.023 per GB/month
- SES Sending: Free (first 62,000 emails/month)
- **Typical Monthly: $0.10-0.50**

No licensing fees, no subscriptions, no restrictions. Just deploy and use!

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m "feat: add amazing feature"`)
4. Push branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - See [LICENSE](LICENSE) file

## 👨‍💻 Author

Created by [Murat Ersin](https://github.com/muratersin)

---

<div align="center">

### ⭐ Found it useful? Give us a star!

**100% Free • Open Source • MIT License**

No subscriptions. No licensing fees. Just pure open-source code. 🚀

</div>
