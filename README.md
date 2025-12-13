# 📧 Arpagone - AWS S3 Mail Viewer

<div align="center">

🎉 **100% Open Source & Completely Free** 🎉

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/muratersin/arpagone?style=social)](https://github.com/muratersin/arpagone)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9C%93-brightgreen)](https://github.com/muratersin/arpagone)

</div>

> **Cost-conscious solution**: Instead of AWS WorkMail's **$4/month**, use AWS S3 and SES for **completely free** email management! No hidden fees, no subscriptions. Just open-source code and AWS's own services.

**Arpagone** is a lightweight and fast web application that lets you view and manage emails stored in Amazon S3 buckets. Organize and respond to emails using your existing AWS infrastructure without needing enterprise mail services.

### 🆓 Why is Arpagone Free?

- Source code is open and transparent (MIT License)
- No additional fees, licensing costs, or subscriptions
- Runs on your AWS account (minimizes S3 + SES costs)
- Fork, modify, deploy—use it freely

## 🎯 Why Arpagone?

| Feature             | AWS WorkMail | Arpagone           |
| ------------------- | ------------ | ------------------ |
| **Monthly Cost**    | $4 - $6      | $0.10 - $0.50      |
| **Setup Time**      | 30 minutes   | 5 minutes          |
| **Configuration**   | Complex      | Simple             |
| **Email Viewing**   | ✅           | ✅                 |
| **Email Sending**   | ✅           | ✅ (via SES)       |
| **Web UI**          | ✅           | ✅ (Modern & Fast) |
| **Export/Download** | Limited      | ✅                 |
| **Open Source**     | ❌           | ✅                 |

## ✨ Features

- 📧 **Email Browsing**: Easily find emails stored in S3 buckets
- 👀 **Rich HTML Viewing**: View email content in full HTML format
- 💌 **Reply with SES**: Send emails directly through Amazon SES
- 📥 **Download as HTML**: Download emails as `.html` files
- 🖨️ **Print Support**: Print emails directly from the browser
- 🔐 **Secure**: Controlled via AWS IAM users
- ⚡ **Fast**: Millisecond response times with Next.js + Turbopack
- 🎨 **Modern UI**: Professional interface with Ant Design
- 📱 **Responsive**: Desktop, tablet, and mobile support
- 🧪 **Well-Tested**: Includes Jest unit tests

## 💰 Cost Comparison (Monthly)

### AWS WorkMail

- **Email Storage**: $4-6
- **Total**: **$4-6/month**

### Arpagone (S3 + SES)

- **S3 Storage** (1GB): $0.023
- **SES** (1000 emails sent): $0.10
- **Bandwidth**: ~$0.02
- **Total**: **$0.14/month** (max)

**Annual Savings**: ~$48-72 🎉

## 📋 Requirements

### System Requirements

- Node.js 18.17+
- npm 9+ or yarn 3+

### AWS Account Requirements

- ✅ Emails stored in S3 bucket (`.eml` format)
- ✅ SES verified sender email address (optional, for sending only)
- ✅ IAM user or role (S3 + SES permissions)

### AWS Permissions (IAM Policy)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket", "s3:DeleteObject"],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["sesv2:SendEmail"],
      "Resource": "*"
    }
  ]
}
```

## 🚀 Quick Start (5 Minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/muratersin/arpagone.git
cd arpagone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp example.env .env.local
```

### 4. Edit `.env.local`

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_iam_access_key
AWS_SECRET_ACCESS_KEY=your_iam_secret_key
AWS_REGION=us-east-1

# AWS SES Configuration (for sending emails)
SES_FROM_EMAIL=verified-email@yourdomain.com
```

### 5. Start Development Server

```bash
npm run dev
```

Open in browser: **http://localhost:3000**

## 📖 Usage Guide

### Viewing Emails

1. **Select Bucket**: Choose an S3 bucket from the left sidebar
2. **View List**: All emails in the bucket will be listed
3. **Open Email**: Click on an email in the list
4. **Read Full Content**: View the complete content in HTML format

### Sending Emails

1. **Click "Reply"** on the opened email
2. **Compose Message**: Enter your reply message in the modal
3. **Send**: Click "Send Email" button
4. ✅ **Confirmation**: You'll receive a success message

### Other Actions

- **Download**: 📥 Download email as HTML file
- **View Source**: 📄 View raw HTML code
- **Print**: 🖨️ Open browser print dialog
- **Delete**: 🗑️ Delete email from S3

## 🛠️ Development

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test:watch
```

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Code Quality & Git Hooks

This project uses **Husky** for git hooks and **Commitlint** for enforcing conventional commit messages:

- **Pre-commit Hook**: Runs `npm run lint` before each commit. If linting fails, the commit is blocked.
- **Commit Message**: Must follow [Conventional Commits](https://www.conventionalcommits.org/) format

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Valid Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Tests
- `chore`: Build tools, dependencies
- `ci`: CI/CD configuration
- `revert`: Revert a commit

**Examples:**

```bash
git commit -m "feat(email): add email export to PDF"
git commit -m "fix(ui): resolve email rendering issue"
git commit -m "docs: update installation guide"
```

## 📁 Project Structure

```
arpagone/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (send-email)
│   ├── buckets/          # S3 bucket pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React Components
│   ├── BucketList.tsx   # Bucket listing table
│   ├── Email.tsx        # Email viewer
│   ├── SendEmailForm.tsx # Email sending form
│   └── Logo.tsx         # Logo component
├── services/            # Business Logic
│   ├── s3.ts           # S3 operations
│   └── ses.ts          # Email sending
├── config/             # Configuration
│   ├── s3.config.ts   # S3 config
│   └── ses.config.ts  # SES config
└── public/             # Static assets
    └── favicon.svg
```

## 🔐 Security Notes

- ⚠️ **API Keys**: Never commit `.env.local` to git
- ⚠️ **IAM Permissions**: Use least privilege principle
- ⚠️ **SES Sandbox**: Exit sandbox mode for production
- ⚠️ **HTML Sanitization**: Assumes emails from trusted sources

## 🚀 Production Deployment

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

## 📊 API Endpoints

### POST `/api/send-email`

**Description**: Send a new email

**Request**:

```json
{
  "toEmail": "recipient@example.com",
  "subject": "Hello",
  "htmlBody": "<p>This is a test message</p>",
  "textBody": "This is a test message",
  "replyToEmail": "optional@example.com"
}
```

**Response**:

```json
{
  "success": true,
  "messageId": "000000000000000-00000000-0000-0000-0000-000000000000-000000"
}
```

## 🐛 Troubleshooting

### "Port 3000 already in use"

```bash
# Linux/Mac
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### SES: "Email address not verified"

Go to AWS Console → SES → Email Addresses → Verify sender address

### S3: "Access Denied"

Check that your IAM policy has the correct permissions

## 📚 Resources

- [AWS S3 Docs](https://docs.aws.amazon.com/s3/)
- [AWS SES Docs](https://docs.aws.amazon.com/ses/)
- [Next.js Docs](https://nextjs.org/docs)
- [Ant Design](https://ant.design/)
- [mailparser](https://www.npmjs.com/package/mailparser)

## 🤝 Contributing

Pull requests are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -am 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👨‍💻 Author

Created by [Murat Ersin](https://github.com/muratersin)

---

<div align="center">

### ⭐ Found it useful? Give it a star!

**Reduce AWS email costs by 95% with Arpagone** 🚀

</div>
