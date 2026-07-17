(function () {
  const CONSENT_KEY = 'ceriga_analytics_consent';
  const measurementId = window.CERIGA_GA_MEASUREMENT_ID;

  function hasValidMeasurementId() {
    return (
      typeof measurementId === 'string' &&
      /^G-[A-Z0-9]+$/.test(measurementId) &&
      measurementId !== 'G-XXXXXXXXXX'
    );
  }

  function loadGoogleAnalytics() {
    if (!hasValidMeasurementId() || window.__cerigaGaLoaded) return;

    window.__cerigaGaLoaded = true;
    window.dataLayer = window.dataLayer || [];

    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);

    if (value === 'accepted') {
      loadGoogleAnalytics();
    }

    const banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.remove();
  }

  function createBanner() {
    if (document.getElementById('cookie-consent-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = `
      <div class="cookie-consent__inner">
        <p>
          We use analytics cookies to understand how visitors use our site and improve your experience.
          <a href="/cookies.html">Learn more</a>
        </p>
        <div class="cookie-consent__actions">
          <button type="button" class="btn-primary-custom cookie-consent__accept">Accept</button>
          <button type="button" class="btn-primary-custom secondary-custom-btn cookie-consent__decline">Decline</button>
        </div>
      </div>
    `;

    banner.querySelector('.cookie-consent__accept').addEventListener('click', function () {
      setConsent('accepted');
    });

    banner.querySelector('.cookie-consent__decline').addEventListener('click', function () {
      setConsent('declined');
    });

    document.body.appendChild(banner);
  }

  function init() {
    if (!hasValidMeasurementId()) return;

    const consent = localStorage.getItem(CONSENT_KEY);

    if (consent === 'accepted') {
      loadGoogleAnalytics();
      return;
    }

    if (consent === 'declined') return;

    createBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
