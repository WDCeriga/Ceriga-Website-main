# Google Analytics Setup

## 1. Create a GA4 property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create an account/property for **ceriga.co** (if you do not have one yet)
3. Add a **Web** data stream for `https://ceriga.co`
4. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

## 2. Add the Measurement ID to the site

Edit `js/analytics-config.js`:

```javascript
window.CERIGA_GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
```

Replace `G-XXXXXXXXXX` with your real Measurement ID, then deploy.

## 3. How it works

- A cookie consent banner appears for first-time visitors
- Analytics only loads if the user clicks **Accept**
- If the ID is still the placeholder `G-XXXXXXXXXX`, analytics stays disabled
- Consent choice is stored in `localStorage` as `ceriga_analytics_consent`

## 4. Verify tracking

1. Deploy the site with your real Measurement ID
2. Open the site in a browser and click **Accept** on the cookie banner
3. In GA4, go to **Reports → Realtime** and confirm your visit appears

## 5. Link Search Console (recommended)

In GA4: **Admin → Product links → Search Console links** to connect Google Search Console with Analytics.

## 6. Custom events (automatic)

After consent, the site tracks these GA4 events via `gtag`:

| Event | When it fires |
|-------|----------------|
| `navigation_click` | Internal nav links (home, about, gallery, faq, contact, etc.) |
| `click` | Outbound links — Our Blanks, social, email, phone, external |
| `navigation_click` (`destination: login`) | Log in links (rebuilding notice) |
| `navigation_click` (`destination: sign_up`) | Sign Up CTAs |
| `contact_form_submit` | Contact form submitted |
| `contact_form_success` | Message sent successfully |
| `contact_form_error` | Form submission failed |
| `rebuilding_notice_view` | User lands on contact page with `?notice=rebuilding` |
| `cookie_consent` | User accepts analytics cookies |
| `button_click` | Other buttons / elements with `data-track` attribute |

### Manual tracking

Call from any page script (only fires after consent):

```javascript
window.cerigaTrack('custom_event_name', { key: 'value' });
```

### View events in GA4

**Reports → Engagement → Events** (allow 24–48h for full reports; use **Realtime** for immediate verification).
