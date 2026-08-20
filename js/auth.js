/* ═══════════════════════════════════════════════════
   AUTHENTICATION — TheDeepVerse
   (updated safe global fallbacks)
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Shared auth modal markup (injected on pages that don't include it) ──
  const AUTH_MODAL_HTML = [
    '<div class="auth-modal" id="authModal" style="display:none;">',
    '<div class="auth-modal__backdrop" id="authModalBackdrop"></div>',
    '<div class="auth-modal__box">',
    '<button class="auth-modal__close" id="authModalClose">&times;</button>',
    '<div class="auth-modal__tabs">',
    '<button class="auth-tab is-active" id="tabSignIn">Sign In</button>',
    '<button class="auth-tab" id="tabSignUp">Sign Up</button>',
    '<button class="auth-tab" id="tabPhone">Phone</button>',
    '</div>',
    '<form class="auth-form" id="formSignIn">',
    '<div class="auth-form__group"><label class="auth-form__label" for="signInEmail">Email</label>',
    '<input type="email" class="auth-form__input" id="signInEmail" placeholder="you@example.com" required></div>',
    '<div class="auth-form__group"><label class="auth-form__label" for="signInPassword">Password</label>',
    '<input type="password" class="auth-form__input" id="signInPassword" placeholder="••••••" required></div>',
    '<button type="submit" class="btn btn--primary btn--md auth-form__submit" style="width:100%;margin-top:16px;">Sign In</button>',
    '<p class="auth-form__footer">Don\'t have an account? <span class="auth-switch-tab" data-tab="signup">Sign Up</span></p>',
    '</form>',
    '<form class="auth-form" id="formSignUp" style="display:none;">',
    '<div class="auth-form__group"><label class="auth-form__label" for="signUpName">Full Name</label>',
    '<input type="text" class="auth-form__input" id="signUpName" placeholder="Your Name" required></div>',
    '<div class="auth-form__group"><label class="auth-form__label" for="signUpEmail">Email</label>',
    '<input type="email" class="auth-form__input" id="signUpEmail" placeholder="you@example.com" required></div>',
    '<div class="auth-form__group"><label class="auth-form__label" for="signUpPassword">Password</label>',
    '<input type="password" class="auth-form__input" id="signUpPassword" placeholder="••••••" minlength="6" required></div>',
    '<div class="auth-form__group"><label class="auth-form__label" for="signUpConfirmPassword">Confirm Password</label>',
    '<input type="password" class="auth-form__input" id="signUpConfirmPassword" placeholder="••••••" minlength="6" required></div>',
    '<button type="submit" class="btn btn--primary btn--md auth-form__submit" style="width:100%;margin-top:16px;">Create Account</button>',
    '<p class="auth-form__footer">Already have an account? <span class="auth-switch-tab" data-tab="signin">Sign In</span></p>',
    '</form>',
    '<form class="auth-form" id="formPhone" style="display:none;">',
    '<div id="phoneNumberSection"><div class="auth-form__group"><label class="auth-form__label" for="phoneNumber">Phone Number</label>',
    '<input type="tel" class="auth-form__input" id="phoneNumber" placeholder="+91 98765 43210" required></div>',
    '<div class="auth-form__group"><button type="button" class="btn btn--primary btn--md auth-form__submit" id="sendCodeBtn" style="width:100%;margin-top:8px;">Send Verification Code</button></div>',
    '<div id="verificationSection" style="display:none;"><div class="auth-form__group"><label class="auth-form__label" for="verificationCode">Verification Code</label>',
    '<input type="text" class="auth-form__input" id="verificationCode" placeholder="Enter 6-digit code" required></div>',
    '<button type="button" class="btn btn--link btn--sm" id="resendCodeBtn" style="margin-top:8px;">Didn\'t receive the code? Resend</button></div>',
    '<button type="button" class="btn btn--primary btn--md auth-form__submit" id="verifyPhoneBtn" style="width:100%;margin-top:16px;">Verify &amp; Sign In</button>',
    '<p class="auth-form__footer">Or sign in with <span class="auth-switch-tab" data-tab="signin">Email</span> instead</p>',
    '</form>',
    '<div class="auth-divider"><span>Or continue with</span></div>',
    '<button type="button" class="btn btn--secondary btn--md auth-google-btn" id="googleSignInBtn">',
    '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/></svg>',
    'Continue with Google</button>',
    '<div class="auth-error" id="authError" style="display:none;"></div>',
    '<div class="auth-loading" id="authLoading" style="display:none;justify-content:center;align-items:center;padding:0 24px 24px;">',
    '<div class="spinner" style="width:24px;height:24px;border:2px solid rgba(255,255,255,0.1);border-top-color:#d4af37;border-radius:50%;animation:spin 0.8s linear infinite;"></div>',
    '<span style="margin-left:8px;color:#888;font-size:0.8rem;">Signing in...</span></div>',
    '</div></div>'
  ].join('');

  // ── State ──
  let auth = null;
  let googleProvider = null;
  let currentUser = null;
  let modalOpen = false;
  let phoneVerificationInProgress = false;
  let confirmationResult = null;
  let initStarted = false;
  let initRetries = 0;
  let loginWaiters = [];

  // ── DOM Elements ──
  let loginBtn = null;
  let navUser = null;
  let userProfileBtn = null;
  let userDropdown = null;
  let authModal = null;
  let authModalBackdrop = null;
  let authModalClose = null;
  let tabSignIn = null;
  let tabSignUp = null;
  let tabPhone = null;
  let formSignIn = null;
  let formSignUp = null;
  let formPhone = null;
  let googleSignInBtn = null;
  let phoneSignInBtn = null;
  let verifyPhoneBtn = null;
  let resendCodeBtn = null;
  let authError = null;
  let authLoading = null;

  // ── Inject shared auth modal + styles if the page doesn't already have them ──
  function ensureAuthModal() {
    if (document.getElementById('authModal')) return;

    const style = document.createElement('style');
    style.id = 'tdvAuthStyles';
    style.textContent =
      '.auth-modal{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;display:flex;align-items:center;justify-content:center}' +
      '.auth-modal__backdrop{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(5,5,5,0.85);backdrop-filter:blur(4px)}' +
      '.auth-modal__box{position:relative;background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;width:100%;max-width:420px;margin:0 24px;max-height:90vh;overflow-y:auto}' +
      '.auth-modal__close{position:absolute;top:12px;right:12px;width:24px;height:24px;background:transparent;border:none;font-size:1.5rem;color:#888;cursor:pointer;line-height:1;padding:0;z-inde[...';
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.innerHTML = AUTH_MODAL_HTML;
    document.body.appendChild(wrap.firstElementChild);
  }

  // ── Initialize Auth ──
  function initAuth() {
    if (initStarted) return;
    initStarted = true;

    // Wait for Firebase to be ready
    if (!window.FirebaseAuth) {
      initRetries++;
      if (initRetries > 600) {
        console.warn('[Auth] Firebase Auth still not available after ' + initRetries + ' attempts. Reload to retry.');
        initStarted = false;
        initRetries = 0;
        return;
      }
      initStarted = false;
      setTimeout(initAuth, 100);
      return;
    }

    auth = window.FirebaseAuth;

    if (!auth) {
      console.warn('[Auth] Firebase Auth not available');
      initStarted = false;
      setTimeout(initAuth, 100);
      return;
    }

    // Make sure the modal markup exists before we cache/bind elements
    ensureAuthModal();

    // Initialize Google Provider
    if (typeof firebase !== 'undefined' && firebase.auth) {
      googleProvider = new firebase.auth.GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: 'select_account' });
    }

    // Cache DOM elements
    cacheElements();

    // Set up event listeners. Pages that bundle a static auth modal get the
    // same handlers here; auth.js injects the modal when none exists.
    setupEventListeners();

    // Auth state observer
    auth.onAuthStateChanged(handleAuthStateChanged);

    resolveLoginWaiters();

    console.log('[Auth] Initialized');
  }

  function cacheElements() {
    loginBtn = document.getElementById('navLoginBtn');
    navUser = document.getElementById('navUser');
    userProfileBtn = document.getElementById('navUserBtn') || document.getElementById('navUserProfileBtn');
    userDropdown = document.getElementById('navUserDropdown');
    authModal = document.getElementById('authModal');
    authModalBackdrop = document.getElementById('authModalBackdrop');
    authModalClose = document.getElementById('authModalClose');
    tabSignIn = document.getElementById('tabSignIn');
    tabSignUp = document.getElementById('tabSignUp');
    tabPhone = document.getElementById('tabPhone');
    formSignIn = document.getElementById('formSignIn');
    formSignUp = document.getElementById('formSignUp');
    formPhone = document.getElementById('formPhone');
    googleSignInBtn = document.getElementById('googleSignInBtn');
    phoneSignInBtn = document.getElementById('phoneSignInBtn');
    verifyPhoneBtn = document.getElementById('verifyPhoneBtn');
    resendCodeBtn = document.getElementById('resendCodeBtn');
    authError = document.getElementById('authError');
    authLoading = document.getElementById('authLoading');
  }

  function setupEventListeners() {
    // Login button opens modal
    if (loginBtn) {
      loginBtn.addEventListener('click', openAuthModal);
    }

    // Close modal
    if (authModalClose) {
      authModalClose.addEventListener('click', closeAuthModal);
    }
    if (authModalBackdrop) {
      authModalBackdrop.addEventListener('click', closeAuthModal);
    }

    // Tab switching
    if (tabSignIn) {
      tabSignIn.addEventListener('click', () => switchTab('signin'));
    }
    if (tabSignUp) {
      tabSignUp.addEventListener('click', () => switchTab('signup'));
    }
    if (tabPhone) {
      tabPhone.addEventListener('click', () => switchTab('phone'));
    }

    // In-form switch links (e.g. "Don't have an account? Sign Up")
    document.querySelectorAll('.auth-switch-tab').forEach((el) => {
      el.addEventListener('click', () => {
        const tab = el.getAttribute('data-tab');
        if (tab) switchTab(tab);
      });
    });

    // Forms
    if (formSignIn) {
      formSignIn.addEventListener('submit', handleSignIn);
    }
    if (formSignUp) {
      formSignUp.addEventListener('submit', handleSignUp);
    }
    // The phone form submit now delegates to a helper that decides whether to send code or verify
    if (formPhone) {
      formPhone.addEventListener('submit', function(e) { e.preventDefault(); handlePhoneSignIn(); });
    }

    // Google Sign-In
    if (googleSignInBtn) {
      googleSignInBtn.addEventListener('click', handleGoogleSignIn);
    }

    // Phone Sign-In (send code button)
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    if (sendCodeBtn) {
      sendCodeBtn.addEventListener('click', handlePhoneSignInStart);
    }
    if (verifyPhoneBtn) {
      verifyPhoneBtn.addEventListener('click', handleVerifyPhone);
    }
    if (resendCodeBtn) {
      resendCodeBtn.addEventListener('click', handleResendCode);
    }

    // User dropdown toggle
    if (userProfileBtn) {
      userProfileBtn.addEventListener('click', toggleUserDropdown);
    }

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (userDropdown && userProfileBtn && !userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('is-open');
      }
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeAuthModal();
      }
    });

    // Logout button
    const logoutBtn = document.getElementById('navLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleSignOut);
    }
  }

  // ── Auth State Handler ──
  function handleAuthStateChanged(user) {
    currentUser = user;
    updateNavUI(user);
    if (user) resolveLoginWaiters();
    else rejectLoginWaiters();
  }

  // small helper: unified phone form submit handler
  async function handlePhoneSignIn() {
    // If verification not started, send code; otherwise try to verify
    if (!phoneVerificationInProgress) {
      await handlePhoneSignInStart();
    } else {
      await handleVerifyPhone();
    }
  }

  // Export for global use (safe: reference fallbacks)
  function _safeOpenAuthModal() {
    try {
      if (typeof openAuthModal === 'function') return openAuthModal();
      // fallback: ensure modal exists and show it
      ensureAuthModal();
      var m = document.getElementById('authModal');
      if (m) { m.style.display = 'block'; modalOpen = true; }
      try { if (typeof switchTab === 'function') switchTab('signin'); } catch(e) {}
    } catch (e) { console.warn('[Auth] safeOpenAuthModal failed', e); }
  }

  function _safeCloseAuthModal() {
    try {
      if (typeof closeAuthModal === 'function') return closeAuthModal();
      var m = document.getElementById('authModal');
      if (m) { m.style.display = 'none'; modalOpen = false; }
    } catch (e) { console.warn('[Auth] safeCloseAuthModal failed', e); }
  }

  function _safeRequireLogin() {
    return new Promise(function(resolve) {
      _safeOpenAuthModal();
      // wait for auth state change or timeout
      var resolved = false;
      function check() {
        if (window.FirebaseAuth && window.FirebaseAuth.currentUser) {
          resolved = true; resolve(window.FirebaseAuth.currentUser); return;
        }
        if (resolved) return;
        setTimeout(check, 500);
      }
      check();
      // fallback timeout
      setTimeout(function() { if (!resolved) resolve(null); }, 60000);
    });
  }

  window.TDVAuth = {
    openAuthModal: _safeOpenAuthModal,
    closeAuthModal: _safeCloseAuthModal,
    getCurrentUser: function () { return currentUser; },
    requireLogin: _safeRequireLogin
  };
  // Convenience globals used by some inline handlers (safe assignments)
  if (typeof window.openAuthModal !== 'function') window.openAuthModal = _safeOpenAuthModal;
  if (typeof window.requireLogin !== 'function') window.requireLogin = _safeRequireLogin;

  // ── Initialize ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }

})();

// Extra safety: if some pages load auth.js and earlier inline scripts expected openAuthModal immediately
if (typeof window.openAuthModal !== 'function') {
  window.openAuthModal = function() {
    try { var m = document.getElementById('authModal'); if (m) m.style.display = 'block'; } catch(e){}
  };
}
if (typeof window.requireLogin !== 'function') {
  window.requireLogin = function() { return new Promise(function(res){ window.openAuthModal(); setTimeout(function(){ res(null); }, 60000); }); };
}
