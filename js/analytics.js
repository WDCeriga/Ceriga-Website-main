/**
 * Ceriga — Google Analytics 4 + custom event tracking
 * Requires js/analytics-config.js (CERIGA_GA_MEASUREMENT_ID)
 */
(function () {
  'use strict';

  var CONSENT_KEY = 'ceriga_analytics_consent';
  var measurementId = typeof window.CERIGA_GA_MEASUREMENT_ID !== 'undefined'
    ? window.CERIGA_GA_MEASUREMENT_ID
    : '';

  function hasConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY) === 'accepted';
    } catch (e) {
      return false;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {}
  }

  function loadGA() {
    if (!measurementId || measurementId === 'G-XXXXXXXXXX') return;
    if (window.gtag) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: true,
      anonymize_ip: true
    });

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(s);
  }

  /** Public helper — safe to call before consent (no-ops until accepted) */
  window.cerigaTrack = function (eventName, params) {
    if (!hasConsent() || !window.gtag) return;
    window.gtag('event', eventName, params || {});
  };

  function showBanner() {
    if (document.getElementById('ceriga-cookie-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'ceriga-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p>We use cookies to understand how visitors use our site and improve your experience. ' +
      '<a href="/privacy-policy.html">Privacy Policy</a></p>' +
      '<div class="ceriga-cookie-actions">' +
      '<button type="button" id="ceriga-cookie-accept">Accept</button>' +
      '<button type="button" id="ceriga-cookie-decline">Decline</button>' +
      '</div>';

    document.body.appendChild(banner);

    document.getElementById('ceriga-cookie-accept').addEventListener('click', function () {
      setConsent('accepted');
      banner.remove();
      loadGA();
      window.cerigaTrack('cookie_consent', { consent_status: 'accepted' });
      initEventTracking();
    });

    document.getElementById('ceriga-cookie-decline').addEventListener('click', function () {
      setConsent('declined');
      banner.remove();
    });
  }

  function getLinkLabel(el) {
    var text = (el.textContent || '').trim().replace(/\s+/g, ' ');
    if (text) return text.slice(0, 80);
    var aria = el.getAttribute('aria-label');
    if (aria) return aria;
    return el.getAttribute('href') || 'unknown';
  }

  function classifyOutboundLink(href) {
    if (!href) return null;
    if (href.indexOf('blanks.ceriga.co') !== -1) return 'our_blanks';
    if (href.indexOf('studio.ceriga.co') !== -1) return 'studio_login';
    if (href.indexOf('instagram.com') !== -1) return 'instagram';
    if (href.indexOf('linkedin.com') !== -1) return 'linkedin';
    if (href.indexOf('facebook.com') !== -1) return 'facebook';
    if (href.indexOf('twitter.com') !== -1 || href.indexOf('x.com') !== -1) return 'twitter';
    if (href.indexOf('mailto:') === 0) return 'email';
    if (href.indexOf('tel:') === 0) return 'phone';
    if (href.indexOf('http') === 0 && href.indexOf('ceriga.co') === -1) return 'external';
    return null;
  }

  function classifyInternalLink(href, el) {
    if (!href) return null;
    var path = href.split('?')[0].split('#')[0];
    var query = href.indexOf('?') !== -1 ? href.split('?')[1] : '';
    var label = getLinkLabel(el).toLowerCase();
    var title = (el.getAttribute('title') || '').toLowerCase();

    if (query.indexOf('notice=rebuilding') !== -1) {
      if (label.indexOf('sign') !== -1 || title.indexOf('sign') !== -1) return 'sign_up';
      return 'login';
    }

    if (path === '/contact-us.html' || path.endsWith('/contact-us.html')) return 'contact';
    if (path === '/gallery.html' || path.endsWith('/gallery.html')) return 'gallery';
    if (path === '/faq.html' || path.endsWith('/faq.html')) return 'faq';
    if (path === '/about-us.html' || path.endsWith('/about-us.html')) return 'about';
    if (path === '/how-works.html' || path.endsWith('/how-works.html')) return 'how_works';
    if (path === '/privacy-policy.html' || path.endsWith('/privacy-policy.html')) return 'privacy';
    if (path === '/terms.html' || path.endsWith('/terms.html')) return 'terms';
    if (path === '/cookies.html' || path.endsWith('/cookies.html')) return 'cookies';
    if (path === '/' || path.endsWith('/index.html')) return 'home';
  }

  function initEventTracking() {
    if (window.__cerigaAnalyticsInit) return;
    window.__cerigaAnalyticsInit = true;

    /* Delegated click tracking */
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;

      var href = link.getAttribute('href') || '';
      var outbound = classifyOutboundLink(href);
      var internal = classifyInternalLink(href, link);

      if (outbound) {
        window.cerigaTrack('click', {
          link_type: outbound,
          link_url: href,
          link_text: getLinkLabel(link),
          page_location: window.location.pathname
        });
        return;
      }

      if (internal) {
        window.cerigaTrack('navigation_click', {
          destination: internal,
          link_url: href,
          link_text: getLinkLabel(link),
          page_location: window.location.pathname
        });
        return;
      }

      /* CTA buttons that are not links */
      var btn = e.target.closest('button, .btn, .cta-button, [data-track]');
      if (btn && !link) {
        var trackName = btn.getAttribute('data-track') || getLinkLabel(btn);
        window.cerigaTrack('button_click', {
          button_name: trackName,
          page_location: window.location.pathname
        });
      }
    }, true);

    /* Contact form — listen for custom events from contact-us.html */
    document.addEventListener('ceriga:contact_submit', function () {
      window.cerigaTrack('contact_form_submit', { page_location: window.location.pathname });
    });
    document.addEventListener('ceriga:contact_success', function () {
      window.cerigaTrack('contact_form_success', { page_location: window.location.pathname });
    });
    document.addEventListener('ceriga:contact_error', function (e) {
      window.cerigaTrack('contact_form_error', {
        page_location: window.location.pathname,
        error_message: (e.detail && e.detail.message) ? String(e.detail.message).slice(0, 100) : 'unknown'
      });
    });

    /* Rebuilding notice viewed */
    if (window.location.search.indexOf('notice=rebuilding') !== -1) {
      window.cerigaTrack('rebuilding_notice_view', { page_location: window.location.pathname });
    }
  }

  if (hasConsent()) {
    loadGA();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initEventTracking);
    } else {
      initEventTracking();
    }
  } else if (measurementId && measurementId !== 'G-XXXXXXXXXX') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
