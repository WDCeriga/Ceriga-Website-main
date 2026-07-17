# CERIGA Website - Vercel Deployment

## 🚀 Vercel Serverless Contact Form

This website uses **Vercel Serverless Functions** for the contact form backend, providing unlimited submissions and 10MB file uploads.

## 📁 Project Structure

```
├── api/
│   └── contact.js          # Serverless function for contact form
├── ContactUS.html          # Contact form page
├── index.html              # Homepage
├── vercel.json             # Vercel configuration
├── package.json            # Node.js dependencies
└── .vercelignore          # Files to exclude from deployment
```

## ⚙️ Configuration

### Environment Variables (Set in Vercel Dashboard)

```
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-gmail-app-password
RECIPIENT_EMAIL=info@ceriga.co
```

> **Security:** Never commit real credentials to git. Add these only in the Vercel Dashboard under **Settings → Environment Variables**. If a password was ever committed to the repository, revoke it in Google Account settings and create a new Gmail App Password.

### Features

✅ **Unlimited Submissions** - No monthly limits  
✅ **File Uploads** - Up to 10MB files  
✅ **File Types** - PDF, DOC, DOCX, JPG, PNG, ZIP, TXT  
✅ **Professional Emails** - HTML formatted emails  
✅ **Reply-To** - Direct replies to sender  
✅ **Error Handling** - Comprehensive validation  

## 🚀 Deployment Steps

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
vercel
```

### 3. Set Environment Variables
In Vercel Dashboard:
- Go to your project
- Settings → Environment Variables
- Add the three variables above

### 4. Custom Domain (Optional)
- Go to Domains in Vercel Dashboard
- Add your custom domain (e.g., ceriga.co)

## 🧪 Testing

### Local Development
```bash
npm install
vercel dev
```

### Test Contact Form
1. Open ContactUS.html
2. Fill out form with test data
3. Upload a test file (optional)
4. Submit form
5. Check info@ceriga.co inbox

## 📧 Email Features

- **To**: value of `RECIPIENT_EMAIL` (defaults to info@ceriga.co)
- **From**: value of `SENDER_EMAIL`
- **Reply-To**: Sender's email
- **Subject**: "New Contact Form: [Subject]"
- **Format**: Professional HTML template
- **Attachments**: Files sent as email attachments

## 🔧 Customization

### File Size Limit
Edit `api/contact.js` line 15:
```javascript
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
```

### File Types
Edit `api/contact.js` line 16:
```javascript
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'zip', 'txt', 'xlsx'];
```

### Email Template
Edit the `createEmailHTML` function in `api/contact.js`

## 🐛 Troubleshooting

### "Authentication Failed"
- Verify Gmail App Password is correct
- Check environment variables in Vercel Dashboard
- Ensure 2FA is enabled on Gmail

### "File Too Large"
- Current limit is 10MB
- Increase `MAX_FILE_SIZE` in contact.js
- Or compress the file

### "File Type Not Allowed"
- Add file extension to `ALLOWED_EXTENSIONS`
- Or ask user to convert file format

### Function Timeout
- Vercel has 10-second timeout on Hobby plan
- Upgrade to Pro for longer timeouts
- Or optimize file processing

## 📊 Vercel Plans

| Plan | Functions | Timeout | Bandwidth | Cost |
|------|-----------|---------|-----------|------|
| **Hobby** | 100GB-hrs | 10s | 100GB | Free |
| **Pro** | 1000GB-hrs | 60s | 1TB | $20/month |
| **Enterprise** | Unlimited | 900s | Unlimited | Custom |

## 🎯 Benefits

- ✅ **No Server Management** - Vercel handles everything
- ✅ **Automatic Scaling** - Handles traffic spikes
- ✅ **Global CDN** - Fast loading worldwide
- ✅ **Custom Domains** - Use ceriga.co
- ✅ **SSL Certificates** - Automatic HTTPS
- ✅ **Git Integration** - Deploy on push

---

## ✅ Ready for Deployment!

Your contact form is now ready for Vercel deployment with unlimited submissions and large file uploads!
