# Local Flask Backend (Optional)

The production site uses Vercel serverless (`api/contact.js`). Use `server.py` only for local development without the Vercel CLI.

## Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure environment variables

Create a `.env` file (see `.env.example`):

```bash
SENDER_EMAIL=your.email@gmail.com
SENDER_PASSWORD=your_gmail_app_password
RECIPIENT_EMAIL=info@ceriga.co
```

### 3. Start the server

```bash
python server.py
```

The site and contact API will be available at `http://localhost:5000`.

## Contact form endpoints

- `POST /api/contact`
- `POST /contact`

## File uploads

- Max size: 4.5MB
- Allowed types: PDF, DOC, DOCX, JPG, PNG, ZIP, TXT

## Notes

- Emails are sent via Gmail SMTP from `SENDER_EMAIL` to `RECIPIENT_EMAIL`
- Uploaded files are attached to the notification email and then deleted from disk
- For production, prefer Vercel deployment and `VERCEL_DEPLOYMENT_GUIDE.md`
