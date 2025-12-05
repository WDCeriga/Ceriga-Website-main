#!/usr/bin/env python3
import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
# Match Vercel serverless function body limit (~4.5MB)
MAX_FILE_SIZE = int(4.5 * 1024 * 1024)  # 4.5MB
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'zip', 'txt'}

# Email configuration
SMTP_SERVER = "smtp.gmail.com"  # Using Gmail SMTP
SMTP_PORT = 587
SENDER_EMAIL = "wdceriga@gmail.com"  # Replace with your Gmail
SENDER_PASSWORD = "ekvt mdlv cvet sayv"  # Replace with Gmail App Password
RECIPIENT_EMAIL = "info@ceriga.co"

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def send_email(name, email, subject, country, message, file_path=None):
    """Send email with form data and optional file attachment"""
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECIPIENT_EMAIL
        msg['Subject'] = f"New Contact Form: {subject}"
        msg['Reply-To'] = email

        # Create HTML body
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #c80f0f; color: white; padding: 20px; text-align: center;">
                <h2 style="margin: 0;">New Contact Form Submission</h2>
                <p style="margin: 5px 0 0 0;">CERIGA Website</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd;">
                <p style="font-size: 16px; color: #333;">You have received a new message:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; background: #f0f0f0; font-weight: bold;">Name</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">{name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; background: #f0f0f0; font-weight: bold;">Email</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">{email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; background: #f0f0f0; font-weight: bold;">Subject</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">{subject}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; background: #f0f0f0; font-weight: bold;">Country</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">{country}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd; background: #f0f0f0; font-weight: bold;">Message</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">{message}</td>
                    </tr>
                </table>
            </div>
            
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
                <p>This email was sent from the Ceriga website contact form.</p>
                <p>You can reply directly to this email to reach the sender.</p>
            </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(html_body, 'html'))

        # Attach file if provided
        if file_path and os.path.exists(file_path):
            with open(file_path, "rb") as attachment:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header(
                    'Content-Disposition',
                    f'attachment; filename= {os.path.basename(file_path)}'
                )
                msg.attach(part)

        # Send email
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)

        logger.info(f"Email sent successfully to {RECIPIENT_EMAIL}")
        return True

    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

@app.route('/contact', methods=['POST'])
@app.route('/api/contact', methods=['POST'])
def contact():
    """Handle contact form submission"""
    try:
        # Get form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        country = request.form.get('country', '').strip()
        message = request.form.get('message', '').strip()

        # Validate required fields
        if not all([name, email, subject, country, message]):
            return jsonify({
                'success': False,
                'error': 'All fields are required'
            }), 400

        # Handle file upload
        file_path = None
        if 'file' in request.files:
            file = request.files['file']
            if file and file.filename != '':
                if file.content_length > MAX_FILE_SIZE:
                    return jsonify({
                        'success': False,
                        'error': f'File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB'
                    }), 400

                if allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(UPLOAD_FOLDER, filename)
                    file.save(file_path)
                    logger.info(f"File uploaded: {filename}")
                else:
                    return jsonify({
                        'success': False,
                        'error': 'File type not allowed'
                    }), 400

        # Send email
        if send_email(name, email, subject, country, message, file_path):
            # Clean up uploaded file
            if file_path and os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"File cleaned up: {file_path}")

            return jsonify({
                'success': True,
                'message': 'Message sent successfully!'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to send email. Please try again.'
            }), 500

    except Exception as e:
        logger.error(f"Contact form error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred. Please try again.'
        }), 500

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

@app.route('/')
def serve_index():
    """Serve index.html"""
    return send_from_directory('.', 'index.html')

if __name__ == "__main__":
    print("=" * 50)
    print("CERIGA Website Server")
    print("=" * 50)
    print(f"Email will be sent to: {RECIPIENT_EMAIL}")
    print(f"File uploads: {MAX_FILE_SIZE // (1024*1024)}MB max")
    print(f"Server running at: http://localhost:5000")
    print("=" * 50)
    print("IMPORTANT: Update email settings in server.py")
    print("   1. Set SENDER_EMAIL to your Gmail")
    print("   2. Set SENDER_PASSWORD to Gmail App Password")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
