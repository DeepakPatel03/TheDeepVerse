/* ============================================================
   THEDEEPVERSE — MAIN JAVASCRIPT ENGINE
   ============================================================
   Handles: Navigation, scroll reveals, animations, 
   hero concept rotation, stats counter, back-to-top,
   newsletter form, FAQ accordion.
   ============================================================ */

(function () {
  'use strict';

  // ── Wait for DOM ──
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavScroll();
    initMobileMenu();
    initScrollReveal();
    initHeroConceptRotator();
    initStatsCounter();
    initBackToTop();
    initNewsletterForm();
    initFaqAccordion();
    initFilterTabs();
    initSearchBar();
    initSiteLogo();
    initWhatsAppFloat();
    initCookieConsent();
    initSmoothAnchorScroll();
    initPageLoader();
  }

  /* ============================================================
     0. SITE LOGO — Auto-apply from Admin Settings
     ============================================================ */
  function initSiteLogo() {
    try {
      var logoUrl = localStorage.getItem('tdv_site_logo');
      if (!logoUrl) return;

      // Replace nav logo (text → image)
      var navLogos = document.querySelectorAll('.nav__logo');
      navLogos.forEach(function(el) {
        el.innerHTML = '<img src="' + logoUrl + '" alt="TheDeepVerse" style="height:32px;max-width:180px;object-fit:contain;vertical-align:middle">';
      });

      // Replace footer logo (text → image)
      var footerLogos = document.querySelectorAll('.footer__logo');
      footerLogos.forEach(function(el) {
        el.innerHTML = '<img src="' + logoUrl + '" alt="TheDeepVerse" style="height:36px;max-width:200px;object-fit:contain">';
      });
    } catch(e) { console.warn('[Logo] Error applying site logo:', e); }
  }

  /* ============================================================
     1. NAVIGATION — Scroll State (Transparent → Frosted Glass)
     ============================================================ */

  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var scrollThreshold = 50;

    function onScroll() {
      if (window.scrollY > scrollThreshold) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }

    // Check initial state
    onScroll();

    // Use passive listener for performance
    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ============================================================
     2. MOBILE MENU — Toggle with Body Scroll Lock
     ============================================================ */

  function initMobileMenu() {
    var toggle = document.querySelector('.nav__toggle');
    var mobileMenu = document.querySelector('.nav__mobile');
    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('is-open');

      if (isOpen) {
        closeMobileMenu(toggle, mobileMenu);
      } else {
        openMobileMenu(toggle, mobileMenu);
      }
    });

    // Close on link click
    var mobileLinks = mobileMenu.querySelectorAll('.nav__mobile-link');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu(toggle, mobileMenu);
      });
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu(toggle, mobileMenu);
      }
    });
  }

  function openMobileMenu(toggle, menu) {
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '-' + window.scrollY + 'px';
  }

  function closeMobileMenu(toggle, menu) {
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    var scrollY = document.body.style.top;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }


  /* ============================================================
     3. SCROLL REVEAL — Intersection Observer
     ============================================================ */

  function initScrollReveal() {
    var revealElements = document.querySelectorAll(
      '.reveal, .reveal--left, .reveal--right, .reveal--scale'
    );

    if (!revealElements.length) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* ============================================================
     4. HERO CONCEPT ROTATOR — Animated Text Cycling
     ============================================================ */

  function initHeroConceptRotator() {
    var container = document.querySelector('.hero__concept-rotator');
    if (!container) return;

    var words = container.querySelectorAll('.hero__concept-word');
    if (!words.length) return;

    var currentIndex = 0;
    var intervalMs = 2800;

    // Set first word active
    words[0].classList.add('is-active');

    setInterval(function () {
      // Fade out current
      words[currentIndex].classList.remove('is-active');

      // Move to next
      currentIndex = (currentIndex + 1) % words.length;

      // Fade in next
      words[currentIndex].classList.add('is-active');
    }, intervalMs);
  }


  /* ============================================================
     5. STATS COUNTER — Animated Count-Up
     ============================================================ */

  function initStatsCounter() {
    var statNumbers = document.querySelectorAll('[data-count]');
    if (!statNumbers.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCount(element) {
    var target = parseInt(element.getAttribute('data-count'), 10);
    var suffix = element.getAttribute('data-suffix') || '';
    var duration = 2000;
    var startTime = null;

    // Easing function — decelerating
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = easeOutCubic(progress);
      var current = Math.floor(easedProgress * target);

      element.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = formatNumber(target) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
    }
    return num.toString();
  }


  /* ============================================================
     6. BACK TO TOP — Visibility & Smooth Scroll
     ============================================================ */

  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    var showThreshold = 500;

    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY > showThreshold) {
          btn.classList.add('is-visible');
        } else {
          btn.classList.remove('is-visible');
        }
      },
      { passive: true }
    );

    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }


  /* ============================================================
     7. NEWSLETTER FORM — Validation & Submission
     ============================================================ */

  function initNewsletterForm() {
    var forms = document.querySelectorAll('.newsletter__form');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleNewsletterSubmit(form);
      });
    });
  }

  function handleNewsletterSubmit(form) {
    var input = form.querySelector('.newsletter__input');
    var errorEl = form.querySelector('.newsletter__error');
    var email = input.value.trim();

    // Reset error state
    input.classList.remove('is-error');
    if (errorEl) errorEl.classList.remove('is-visible');

    // Validate email
    if (!email) {
      showNewsletterError(input, errorEl, 'Please enter your email address.');
      return;
    }

    if (!isValidEmail(email)) {
      showNewsletterError(input, errorEl, 'Please enter a valid email address.');
      return;
    }

    // Show success state
    var newsletter = form.closest('.newsletter');
    var formWrapper = newsletter.querySelector('.newsletter__form-wrapper');
    var successEl = newsletter.querySelector('.newsletter__success');

    if (formWrapper && successEl) {
      formWrapper.style.display = 'none';
      successEl.classList.add('is-visible');
    }

    // Show toast
    showToast('Welcome to TheDeepVerse! 🧠', 'success');
  }

  function showNewsletterError(input, errorEl, message) {
    input.classList.add('is-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('is-visible');
    }
    input.focus();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  /* ============================================================
     8. FAQ ACCORDION
     ============================================================ */

  function initFaqAccordion() {
    var triggers = document.querySelectorAll('.accordion__trigger');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        var contentId = trigger.getAttribute('aria-controls');
        var content = document.getElementById(contentId);
        if (!content) return;

        // Close all other items in the same accordion
        var accordion = trigger.closest('.accordion');
        if (accordion) {
          accordion.querySelectorAll('.accordion__trigger').forEach(function (t) {
            if (t !== trigger) {
              t.setAttribute('aria-expanded', 'false');
              var c = document.getElementById(t.getAttribute('aria-controls'));
              if (c) c.style.maxHeight = '0';
            }
          });
        }

        // Toggle this item
        if (isExpanded) {
          trigger.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = '0';
        } else {
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }


  /* ============================================================
     9. FILTER TABS — Category Switching
     ============================================================ */

  function initFilterTabs() {
    var tabContainers = document.querySelectorAll('.filter-tabs');
    tabContainers.forEach(function (container) {
      var tabs = container.querySelectorAll('.filter-tab');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          // Remove active from all
          tabs.forEach(function (t) {
            t.classList.remove('is-active');
          });
          // Add active to clicked
          tab.classList.add('is-active');

          // Trigger filter event
          var category = tab.getAttribute('data-category');
          filterContent(category, container);
        });
      });
    });
  }

  function filterContent(category, tabContainer) {
    // Find the associated grid (next sibling with cards)
    var section = tabContainer.closest('section') || tabContainer.closest('.section');
    if (!section) return;

    var cards = section.querySelectorAll('[data-category]');
    cards.forEach(function (card) {
      if (card.classList.contains('filter-tab')) return; // Skip tabs themselves

      if (!category || category === 'all') {
        card.style.display = '';
        card.classList.remove('is-visible');
        // Re-trigger reveal
        requestAnimationFrame(function () {
          card.classList.add('is-visible');
        });
      } else if (card.getAttribute('data-category') === category) {
        card.style.display = '';
        card.classList.remove('is-visible');
        requestAnimationFrame(function () {
          card.classList.add('is-visible');
        });
      } else {
        card.style.display = 'none';
      }
    });
  }


  /* ============================================================
     10. SEARCH BAR — Clear Button Toggle
     ============================================================ */

  function initSearchBar() {
    var searchBars = document.querySelectorAll('.search-bar');
    searchBars.forEach(function (bar) {
      var input = bar.querySelector('.search-bar__input');
      var clearBtn = bar.querySelector('.search-bar__clear');
      if (!input || !clearBtn) return;

      input.addEventListener('input', function () {
        if (input.value.length > 0) {
          clearBtn.classList.add('is-visible');
        } else {
          clearBtn.classList.remove('is-visible');
        }

        // Client-side search filter
        filterBySearch(input.value);
      });

      clearBtn.addEventListener('click', function () {
        input.value = '';
        clearBtn.classList.remove('is-visible');
        input.focus();
        filterBySearch('');
      });
    });
  }

  function filterBySearch(query) {
    var normalizedQuery = query.toLowerCase().trim();
    var searchableCards = document.querySelectorAll('[data-searchable]');

    searchableCards.forEach(function (card) {
      if (!normalizedQuery) {
        card.style.display = '';
        return;
      }

      var searchText = card.getAttribute('data-searchable').toLowerCase();
      if (searchText.includes(normalizedQuery)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }


  /* ============================================================
     11. TOAST NOTIFICATION — Show/Auto-dismiss
     ============================================================ */

  window.showToast = function (message, type) {
    type = type || 'info';

    // Remove existing toast
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    // Create toast
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    document.body.appendChild(toast);

    // Show
    requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });

    // Auto-dismiss
    setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 4000);
  };


  /* ============================================================
     12. LITE YOUTUBE EMBED — Facade Pattern
     ============================================================ */

  window.playYouTube = function (button) {
    var card = button.closest('.video-card');
    if (!card) return;

    var videoId = card.getAttribute('data-videoid');
    if (!videoId) return;

    var thumbnail = card.querySelector('.video-card__thumbnail');
    if (!thumbnail) return;

    // Replace thumbnail with actual YouTube iframe
    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    thumbnail.innerHTML = '';
    thumbnail.style.position = 'relative';
    thumbnail.appendChild(iframe);
  };

  /* ============================================================
     WHATSAPP FLOATING BUTTON
     ============================================================ */
  function initWhatsAppFloat() {
    // Read WhatsApp number from admin settings (Firebase config or localStorage cache)
    var whatsappNum = '919999999999'; // default fallback
    try {
      // Try localStorage settings cache first (fast)
      var cached = JSON.parse(localStorage.getItem('tdv_settings') || '{}');
      if (cached.whatsapp) { whatsappNum = cached.whatsapp.replace(/\D/g, ''); }
      // Then update from Firebase when ready
      if (window.FirebaseDatabase) {
        window.FirebaseDatabase.ref('config/whatsapp').once('value').then(function(snap) {
          if (snap.val()) { whatsappNum = snap.val().toString().replace(/\D/g, ''); updateWALink(whatsappNum); }
        });
      }
    } catch(e) {}

    var btn = document.createElement('a');
    btn.id = 'waFloat';
    btn.href = 'https://wa.me/' + whatsappNum + '?text=Hi%2C%20I%20found%20TheDeepVerse%20website%20and%20wanted%20to%20know%20more.';
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.setAttribute('aria-label', 'Chat on WhatsApp');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;width:56px;height:56px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:9999;box-shadow:0 4px 20px rgba(37,211,102,0.5);transition:transform 0.2s,box-shadow 0.2s;text-decoration:none;';
    btn.addEventListener('mouseenter', function() { this.style.transform='scale(1.1)'; this.style.boxShadow='0 6px 28px rgba(37,211,102,0.7)'; });
    btn.addEventListener('mouseleave', function() { this.style.transform='scale(1)'; this.style.boxShadow='0 4px 20px rgba(37,211,102,0.5)'; });
    document.body.appendChild(btn);

    function updateWALink(num) {
      var el = document.getElementById('waFloat');
      if (el) el.href = 'https://wa.me/' + num + '?text=Hi%2C%20I%20found%20TheDeepVerse%20website%20and%20wanted%20to%20know%20more.';
    }
  }

  /* ============================================================
     COOKIE CONSENT BANNER
     ============================================================ */
  function initCookieConsent() {
    if (localStorage.getItem('tdv_cookie_ok')) return; // already accepted

    var banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:rgba(10,10,10,0.97);border-top:1px solid rgba(212,175,55,0.3);padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:Inter,sans-serif;backdrop-filter:blur(10px);';
    banner.innerHTML = '<p style="color:#ccc;font-size:0.85rem;margin:0;flex:1;min-width:220px">🍪 Hum cookies use karte hain aapka experience improve karne ke liye. <a href="privacy.html" style="color:#d4af37;text-decoration:none">Privacy Policy</a> dekhein.</p>' +
      '<div style="display:flex;gap:10px;flex-shrink:0">' +
        '<button id="cookieAccept" style="background:linear-gradient(135deg,#d4af37,#f0c040);color:#000;border:none;padding:8px 20px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.85rem">Accept ✓</button>' +
        '<button id="cookieDecline" style="background:transparent;color:#888;border:1px solid #444;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:0.85rem">Decline</button>' +
      '</div>';
    document.body.appendChild(banner);

    function dismiss() { banner.style.display = 'none'; }
    document.getElementById('cookieAccept').addEventListener('click', function() {
      localStorage.setItem('tdv_cookie_ok', '1'); dismiss();
    });
    document.getElementById('cookieDecline').addEventListener('click', dismiss);
  }

  /* ============================================================
     SMOOTH ANCHOR SCROLL
     ============================================================ */
  function initSmoothAnchorScroll() {
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      var navH = 80;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ============================================================
     PAGE LOADING INDICATOR
     ============================================================ */
  function initPageLoader() {
    var bar = document.createElement('div');
    bar.id = 'pageLoader';
    bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0%;background:linear-gradient(90deg,#d4af37,#f0c040);z-index:999999;transition:width 0.3s ease,opacity 0.4s ease;opacity:1;pointer-events:none;';
    document.body.appendChild(bar);

    // Animate on page links
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript') || href.startsWith('mailto') || link.target === '_blank') return;
      bar.style.width = '70%';
    });

    // Complete on load
    window.addEventListener('load', function() {
      bar.style.width = '100%';
      setTimeout(function() { bar.style.opacity = '0'; setTimeout(function() { bar.style.width = '0%'; bar.style.opacity = '1'; }, 400); }, 300);
    });
  }

})();
