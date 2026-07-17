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
