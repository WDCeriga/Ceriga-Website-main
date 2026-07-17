# CERIGA Website - Vercel Deployment

## Serverless Contact Form

The contact form uses a Vercel serverless function at `api/contact.js` with Nodemailer and Gmail SMTP.

## Project Structure

```
├── api/
│   └── contact.js          # Serverless function for contact form
├── contact-us.html         # Contact form page
├── index.html              # Homepage
├── vercel.json             # Vercel configuration
├── package.json            # Node.js dependencies
└── .vercelignore           # Files excluded from deployment
```

## Environment Variables

Set these in the Vercel Dashboard under **Settings → Environment Variables**:

```
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-gmail-app-password
RECIPIENT_EMAIL=info@ceriga.co
```

Never commit real credentials to git. Use a Gmail App Password on the sender account.

## Features

- Unlimited submissions (within Vercel plan limits)
- File uploads up to 4.5MB
- Accepted file types: PDF, DOC, DOCX, JPG, PNG, ZIP, TXT
- HTML formatted notification emails
- Reply-To set to the sender's email

## Local Development

```bash
cp .env.example .env
npm install
vercel dev
```

## Testing

1. Open `/contact-us.html`
2. Submit the form with test data
3. Confirm the message arrives at `info@ceriga.co`

## Troubleshooting

### Authentication failed
- Verify the Gmail App Password is correct
- Confirm env vars are set for Production and the project was redeployed
- Ensure 2-Step Verification is enabled on the Gmail account

### File too large
- Vercel serverless body limit is about 4.5MB
- Compress attachments or increase limit only on supported plans

### Function timeout
- Hobby plan has a 10 second function timeout
- Large attachments may need a Pro plan or smaller files
