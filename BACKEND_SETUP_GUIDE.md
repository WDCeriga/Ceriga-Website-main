# Custom Backend Contact Form Setup Guide

## 🎉 Setup Complete!

Your contact form now uses a **custom Flask backend** with unlimited submissions and 10MB file uploads!

## 📋 What's Been Done:

✅ **Flask Backend**: Created `/contact` endpoint  
✅ **File Uploads**: Supports up to 10MB files  
✅ **Email Integration**: Sends to info@ceriga.co  
✅ **Form Updated**: ContactUS.html now uses backend  
✅ **Error Handling**: Proper validation and feedback  

## 🚀 Next Steps (Required):

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Email Settings

Create a `.env` file in the project root (see `.env.example`):

```bash
SENDER_EMAIL=your.email@gmail.com
SENDER_PASSWORD=your_gmail_app_password
RECIPIENT_EMAIL=info@ceriga.co
```

> **Security:** Never commit `.env` to git. If credentials were previously committed, revoke the old Gmail App Password and create a new one.

**To get Gmail App Password:**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification → Turn ON
3. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Select "Mail" → "Other (Custom name)"
5. Name it: "Ceriga Contact Form"
6. Copy the 16-character password

### 3. Start the Server

```bash
python server.py
```

You'll see:
```
==================================================
CERIGA Website Server
==================================================
📧 Email will be sent to: info@ceriga.co
📁 File uploads: 10MB max
🌐 Server running at: http://localhost:5000
==================================================
⚠️  IMPORTANT: Update email settings in server.py
   1. Set SENDER_EMAIL to your Gmail
   2. Set SENDER_PASSWORD to Gmail App Password
==================================================
```

### 4. Test the Form

1. Open [http://localhost:5000/ContactUS.html](http://localhost:5000/ContactUS.html)
2. Fill out the form with test data
3. Upload a test file (optional)
4. Click Submit
5. Check info@ceriga.co inbox

## ✨ Features:

### **File Upload Support**
- ✅ **Max Size**: 10MB (vs 50KB with EmailJS)
- ✅ **Formats**: PDF, DOC, DOCX, JPG, PNG, ZIP, TXT
- ✅ **Security**: File validation and cleanup
- ✅ **User Experience**: Seamless upload

### **Email Features**
- ✅ **Recipient**: info@ceriga.co
- ✅ **Reply-To**: Sender's email (you can reply directly)
- ✅ **HTML Template**: Professional formatting
- ✅ **Attachments**: Files sent as email attachments
- ✅ **Subject**: "New Contact Form: [Subject]"

### **Form Validation**
- ✅ **Required Fields**: Name, email, subject, country, message
- ✅ **File Size**: 10MB limit with user feedback
- ✅ **File Type**: Only allowed formats accepted
- ✅ **Error Handling**: Clear error messages

### **Unlimited Submissions**
- ✅ **No Limits**: Send as many emails as needed
- ✅ **No Monthly Caps**: Unlike EmailJS (200/month)
- ✅ **No File Size Issues**: Unlike SMTP restrictions
- ✅ **Reliable**: Direct SMTP connection

## 🔧 Configuration Options:

### **Change File Size Limit**
Edit line 23 in `server.py`:
```python
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB
```

### **Add More File Types**
Edit line 24 in `server.py`:
```python
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'zip', 'txt', 'xlsx', 'ppt'}
```

### **Change Email Template**
Edit lines 50-91 in `server.py` to customize the HTML email template.

### **Use Different Email Service**
Replace lines 27-31 in `server.py`:

**For Outlook.com:**
```python
SMTP_SERVER = "smtp-mail.outlook.com"
SMTP_PORT = 587
SENDER_EMAIL = "your.email@outlook.com"
SENDER_PASSWORD = "your_password"
```

**For Zoho Mail (paid plan):**
```python
SMTP_SERVER = "smtp.zoho.com"
SMTP_PORT = 587
SENDER_EMAIL = "info@ceriga.co"
SENDER_PASSWORD = "your_app_password"
```

## 🐛 Troubleshooting:

### **"Authentication Failed"**
- ✅ Enable 2FA on Gmail
- ✅ Use App Password (not regular password)
- ✅ Check email address is correct

### **"File Too Large"**
- ✅ Current limit is 10MB
- ✅ Increase `MAX_FILE_SIZE` in server.py
- ✅ Or compress the file

### **"File Type Not Allowed"**
- ✅ Add file extension to `ALLOWED_EXTENSIONS`
- ✅ Or ask user to convert file format

### **Server Won't Start**
- ✅ Install dependencies: `pip install -r requirements.txt`
- ✅ Check Python version (3.7+)
- ✅ Make sure port 5000 is free

### **Emails Not Arriving**
- ✅ Check spam folder
- ✅ Verify SMTP settings
- ✅ Test with Gmail first
- ✅ Check server logs for errors

## 📁 File Structure:

```
Ceriga-Website-main/
├── server.py              # Flask backend
├── requirements.txt        # Python dependencies
├── ContactUS.html         # Updated contact form
├── uploads/               # Temporary file storage (auto-created)
└── ... (other website files)
```

## 🚀 Production Deployment:

For production, consider:
- **Heroku**: Easy Flask deployment
- **DigitalOcean**: VPS with Python support
- **AWS**: EC2 instance
- **Railway**: Simple Python hosting

## 🎯 Benefits Over EmailJS:

| Feature | EmailJS | Custom Backend |
|---------|---------|----------------|
| Monthly Limit | 200 emails | Unlimited |
| File Size | ~50KB | 10MB+ |
| File Types | Limited | Customizable |
| Reliability | Third-party | Direct control |
| Cost | $7/month for more | Free |
| Customization | Limited | Full control |

---

## ✅ You're All Set!

Once you configure the email settings and start the server, your contact form will work perfectly with unlimited submissions and large file uploads!

**Need help?** Check the server logs for detailed error messages.
