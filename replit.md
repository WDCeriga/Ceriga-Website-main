# Overview

CERIGA is a premium fashion e-commerce website specializing in modern clothing for men and women. The site presents a sophisticated brand identity focused on high-quality, stylish apparel with a contemporary aesthetic.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

- **Static HTML Pages**: `index.html`, `about-us.html`, `contact-us.html`, `faq.html`, `gallery.html`, `how-works.html`, plus legal pages
- **CSS Framework**: Bootstrap 5.3.7
- **Custom Styling**: Brand CSS with Suisse International fonts
- **Interactive Components**: Swiper.js, AOS animations
- **Responsive Design**: Mobile-first layout and navigation

## Backend

- **Production**: Vercel serverless function at `api/contact.js`
- **Email**: Gmail SMTP via Nodemailer
- **Local optional backend**: `server.py` (Flask)

## Asset Notes

- Social sharing image: `img/og-image.jpg`
- Hero video: `img/hero-bg.mp4`
- Gallery images use optimized JPEG/WebP assets where possible

# External Dependencies

- Bootstrap 5.3.7
- Swiper.js 11.2.10
- AOS
- Font Awesome 7.0.0 (CDN)
- Nodemailer (contact form API)
