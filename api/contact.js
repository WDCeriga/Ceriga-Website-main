const nodemailer = require('nodemailer');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

// Configure Vercel to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Email configuration
const SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
};

// File upload configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'zip', 'txt'];

function allowedFile(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

function createEmailHTML(name, email, subject, country, message) {
  return `
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
            <td style="padding: 12px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; background: #f0f0f0; font-weight: bold;">Email</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; background: #f0f0f0; font-weight: bold;">Subject</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; background: #f0f0f0; font-weight: bold;">Country</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${country}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; background: #f0f0f0; font-weight: bold;">Message</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${message}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
        <p>This email was sent from the Ceriga website contact form.</p>
        <p>You can reply directly to this email to reach the sender.</p>
      </div>
    </body>
    </html>
  `;
}

async function sendEmail(name, email, subject, country, message, filePath = null) {
  try {
    const transporter = nodemailer.createTransporter(SMTP_CONFIG);
    
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form: ${subject}`,
      html: createEmailHTML(name, email, subject, country, message),
      replyTo: email,
    };

    // Add file attachment if provided
    if (filePath && fs.existsSync(filePath)) {
      mailOptions.attachments = [{
        filename: path.basename(filePath),
        path: filePath,
      }];
    }

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Parse form data
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      uploadDir: '/tmp', // Vercel's temporary directory
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    
    // Extract form data
    const name = fields.name?.[0]?.trim() || '';
    const email = fields.email?.[0]?.trim() || '';
    const subject = fields.subject?.[0]?.trim() || '';
    const country = fields.country?.[0]?.trim() || '';
    const message = fields.message?.[0]?.trim() || '';

    // Validate required fields
    if (!name || !email || !subject || !country || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Handle file upload
    let filePath = null;
    if (files.file && files.file[0]) {
      const file = files.file[0];
      
      if (!allowedFile(file.originalFilename)) {
        return res.status(400).json({
          success: false,
          error: 'File type not allowed'
        });
      }

      filePath = file.filepath;
      console.log('File uploaded:', file.originalFilename);
    }

    // Send email
    const emailSent = await sendEmail(name, email, subject, country, message, filePath);
    
    if (emailSent) {
      // Clean up uploaded file
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('File cleaned up:', filePath);
      }

      return res.status(200).json({
        success: true,
        message: 'Message sent successfully!'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to send email. Please try again.'
      });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again.'
    });
  }
}
