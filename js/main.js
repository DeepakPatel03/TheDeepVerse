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

})();
