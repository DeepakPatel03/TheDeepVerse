/* ═══════════════════════════════════════════════════
   AUTHENTICATION — TheDeepVerse
   ═══════════════════════════════════════════════════
   Handles: Google Sign-In, Email/Password Auth,
   Phone Number Auth, Auth State Observer, Login Modal, User Profile UI
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
    '<div class="auth-form__group"><button type="button" class="btn btn--primary btn--md auth-form__submit" id="sendCodeBtn" style="width:100%;margin-top:8px;">Send Verification Code</button></div></div>',
    '<div id="verificationSection" style="display:none;"><div class="auth-form__group"><label class="auth-form__label" for="verificationCode">Verification Code</label>',
    '<input type="text" class="auth-form__input" id="verificationCode" placeholder="Enter 6-digit code" required></div>',
    '<button type="button" class="btn btn--link btn--sm" id="resendCodeBtn" style="margin-top:8px;">Didn\'t receive the code? Resend</button></div>',
    '<button type="button" class="btn btn--primary btn--md auth-form__submit" id="verifyPhoneBtn" style="width:100%;margin-top:16px;">Verify &amp; Sign In</button>',
    '<p class="auth-form__footer">Or sign in with <span class="auth-switch-tab" data-tab="signin">Email</span> instead</p>',
    '</form>',
    '<div class="auth-divider"><span>Or continue with</span></div>',
    '<button type="button" class="btn btn--secondary btn--md auth-google-btn" id="googleSignInBtn">',
    '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>',
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
  // This keeps one source of truth: any page that loads auth.js gets a working
  // login/signup modal, even if its HTML doesn't include the markup.
  function ensureAuthModal() {
    if (document.getElementById('authModal')) return;

    const style = document.createElement('style');
    style.id = 'tdvAuthStyles';
    style.textContent =
      '.auth-modal{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;display:flex;align-items:center;justify-content:center}' +
      '.auth-modal__backdrop{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(5,5,5,0.85);backdrop-filter:blur(4px)}' +
      '.auth-modal__box{position:relative;background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;width:100%;max-width:420px;margin:0 24px;max-height:90vh;overflow-y:auto}' +
      '.auth-modal__close{position:absolute;top:12px;right:12px;width:24px;height:24px;background:transparent;border:none;font-size:1.5rem;color:#888;cursor:pointer;line-height:1;padding:0;z-index:1}' +
      '.auth-modal__close:hover{color:#f5f5f5}' +
      '.auth-modal__tabs{display:flex;border-bottom:1px solid rgba(255,255,255,0.08)}' +
      '.auth-tab{flex:1;padding:16px;font-size:0.85rem;font-weight:500;color:#888;background:transparent;border:none;cursor:pointer;text-align:center}' +
      '.auth-tab.is-active{color:#f5f5f5;border-bottom:2px solid #d4af37}' +
      '.auth-tab:hover:not(.is-active){color:#aaa}' +
      '.auth-form{padding:24px}.auth-form__group{margin-bottom:16px}' +
      '.auth-form__label{display:block;margin-bottom:8px;font-size:0.75rem;font-weight:500;color:#888}' +
      '.auth-form__input{width:100%;padding:10px 16px;background:#050505;border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#f5f5f5;font-size:0.85rem;box-sizing:border-box}' +
      '.auth-form__input:focus{outline:none;border-color:#d4af37;box-shadow:0 0 0 3px rgba(212,175,55,0.15)}' +
      '.auth-form__input::placeholder{color:#555}' +
      '.auth-form__footer{margin-top:16px;text-align:center;font-size:0.75rem;color:#888}' +
      '.auth-switch-tab{color:#d4af37;cursor:pointer;text-decoration:underline}' +
      '.auth-divider{display:flex;align-items:center;margin:0 24px;color:#555;font-size:0.75rem}' +
      ".auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.08)}" +
      '.auth-divider span{padding:0 16px}' +
      '.auth-google-btn{display:flex;align-items:center;justify-content:center;gap:10px;background:transparent;border:1px solid rgba(255,255,255,0.12);color:#f5f5f5;font-size:0.85rem;font-weight:500;border-radius:8px;cursor:pointer;padding:12px;margin:16px 24px 24px;width:calc(100% - 48px)}' +
      '.auth-google-btn:hover{border-color:#f5f5f5;background:rgba(255,255,255,0.04)}' +
      '.auth-error{margin:16px 24px;padding:10px 16px;background:rgba(255,69,0,0.1);border:1px solid rgba(255,69,0,0.3);border-radius:8px;color:#ff4500;font-size:0.75rem}' +
      '@keyframes spin{to{transform:rotate(360deg)}}';
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
      // Keep retrying while the page is alive (page start-up race), but warn after a while.
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
    if (formPhone) {
      formPhone.addEventListener('submit', function(e) { e.preventDefault(); handlePhoneSignInStart(); });
    }

    // Google Sign-In
    if (googleSignInBtn) {
      googleSignInBtn.addEventListener('click', handleGoogleSignIn);
    }

    // Phone Sign-In
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

  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Waits until the user is signed in, then resolves with the user object.
  // Rejects (resolves with null) if the modal is closed without signing in.
  function requireLogin() {
    if (auth && auth.currentUser) return Promise.resolve(auth.currentUser);
    return new Promise(function (resolve) {
      loginWaiters.push({ resolve: resolve, active: true });
      openAuthModal();
    });
  }

  function resolveLoginWaiters() {
    if (!auth || !auth.currentUser) return;
    var waiters = loginWaiters;
    loginWaiters = [];
    waiters.forEach(function (w) { w.resolve(auth.currentUser); });
  }

  function rejectLoginWaiters() {
    var waiters = loginWaiters;
    loginWaiters = [];
    waiters.forEach(function (w) { w.resolve(null); });
  }

  function updateNavUI(user) {
    // The visible user element is the wrapper (#navUser) when present,
    // otherwise the profile button itself.
    const userEl = navUser || userProfileBtn;

    if (user) {
      // User is signed in
      if (loginBtn) loginBtn.style.display = 'none';
      if (userEl) userEl.style.display = 'flex';

      // Update user name/email/avatar in dropdown.
      // Support both naming schemes across pages (navUserName / navUserNameLg).
      const displayName = escapeHtml(user.displayName || (user.email ? user.email.split('@')[0] : 'User'));
      const initial = escapeHtml((user.displayName || user.email || 'U')[0].toUpperCase());

      ['navUserName', 'navUserNameLg'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.textContent = displayName;
      });
      const userEmailEl = document.getElementById('navUserEmail');
      if (userEmailEl) userEmailEl.textContent = escapeHtml(user.email || '');

      ['navUserAvatar', 'navUserAvatarLg'].forEach(function (id) {
        const el = document.getElementById(id);
        if (!el) return;
        if (user.photoURL) {
          el.innerHTML = `<img src="${escapeHtml(user.photoURL)}" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
        } else {
          el.textContent = initial;
        }
      });
    } else {
      // User is signed out
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      if (userEl) userEl.style.display = 'none';
      if (userDropdown) userDropdown.classList.remove('is-open');
    }
  }

  // ── Modal Controls ──
  function openAuthModal() {
    if (!authModal) return;
    authModal.style.display = 'flex';
    if (authModalBackdrop) authModalBackdrop.style.display = 'block';
    modalOpen = true;
    document.body.style.overflow = 'hidden';

    // Reset to sign-in tab
    switchTab('signin');
    clearError();
    resetForms();

    // Focus email input
    setTimeout(() => {
      const emailInput = document.getElementById('signInEmail');
      if (emailInput) emailInput.focus();
    }, 100);
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.style.display = 'none';
    if (authModalBackdrop) authModalBackdrop.style.display = 'none';
    modalOpen = false;
    document.body.style.overflow = '';
    clearError();
    resetForms();
    phoneVerificationInProgress = false;
    confirmationResult = null;
    // Resolve pending requireLogin() promises with null so buy buttons don't hang
    rejectLoginWaiters();
  }

  function switchTab(tab) {
    if (tab === 'signin') {
      if (tabSignIn) tabSignIn.classList.add('is-active');
      if (tabSignUp) tabSignUp.classList.remove('is-active');
      if (tabPhone) tabPhone.classList.remove('is-active');
      if (formSignIn) formSignIn.style.display = 'block';
      if (formSignUp) formSignUp.style.display = 'none';
      if (formPhone) formPhone.style.display = 'none';
    } else if (tab === 'signup') {
      if (tabSignIn) tabSignIn.classList.remove('is-active');
      if (tabSignUp) tabSignUp.classList.add('is-active');
      if (tabPhone) tabPhone.classList.remove('is-active');
      if (formSignIn) formSignIn.style.display = 'none';
      if (formSignUp) formSignUp.style.display = 'block';
      if (formPhone) formPhone.style.display = 'none';
    } else if (tab === 'phone') {
      if (tabSignIn) tabSignIn.classList.remove('is-active');
      if (tabSignUp) tabSignUp.classList.remove('is-active');
      if (tabPhone) tabPhone.classList.add('is-active');
      if (formSignIn) formSignIn.style.display = 'none';
      if (formSignUp) formSignUp.style.display = 'none';
      if (formPhone) formPhone.style.display = 'block';
    }
    clearError();
  }

  function clearError() {
    if (authError) {
      authError.textContent = '';
      authError.style.display = 'none';
    }
  }

  function showError(message) {
    if (authError) {
      authError.textContent = message;
      authError.style.display = 'block';
      authError.style.color = '#ef4444';
      authError.style.background = 'rgba(239,68,68,0.1)';
    }
  }

  function showSuccess(message) {
    if (authError) {
      authError.textContent = message;
      authError.style.display = 'block';
      authError.style.color = '#22c55e';
      authError.style.background = 'rgba(34,197,94,0.1)';
    }
  }

  function setLoading(loading) {
    if (authLoading) {
      authLoading.style.display = loading ? 'flex' : 'none';
    }
    if (googleSignInBtn) {
      googleSignInBtn.disabled = loading;
    }
    if (phoneSignInBtn) {
      phoneSignInBtn.disabled = loading;
    }
    const submitBtns = document.querySelectorAll('#formSignIn button[type="submit"], #formSignUp button[type="submit"], #formPhone button[type="submit"]');
    submitBtns.forEach(btn => btn.disabled = loading);
  }

  function resetForms() {
    if (formSignIn) formSignIn.reset();
    if (formSignUp) formSignUp.reset();
    if (formPhone) formPhone.reset();
  }

  // ── Authentication Handlers ──
  async function handleGoogleSignIn() {
    if (!auth || !googleProvider) return;

    setLoading(true);
    clearError();

    try {
      await auth.signInWithPopup(googleProvider);
      closeAuthModal();
      showToast('Welcome to TheDeepVerse! 🎉', 'success');
    } catch (error) {
      console.error('[Auth] Google Sign-In error:', error);
      let message = 'Google sign-in failed. Please try again.';
      if (error.code === 'auth/popup-blocked') {
        message = 'Popup blocked. Please allow popups for this site.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in cancelled.';
      } else if (error.code === 'auth/unauthorized-domain') {
        message = 'This domain is not authorized. Contact admin.';
      }
      showError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(e) {
    e.preventDefault();
    if (!auth) {
      showError('Authentication not ready. Please refresh the page and try again.');
      return;
    }

    const email = document.getElementById('signInEmail').value.trim();
    const password = document.getElementById('signInPassword').value;

    if (!email || !password) {
      showError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    clearError();

    try {
      await auth.signInWithEmailAndPassword(email, password);
      closeAuthModal();
      showToast('Welcome back! 👋', 'success');
    } catch (error) {
      console.error('[Auth] Sign-In error:', error);
      let message = 'Sign-in failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please wait a few minutes and try again.';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Network error. Check your internet connection and try again.';
      } else if (error.code === 'auth/user-disabled') {
        message = 'This account has been disabled. Contact support.';
      }
      showError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    if (!auth) {
      showError('Authentication not ready. Please refresh the page and try again.');
      return;
    }

    const name = document.getElementById('signUpName').value.trim();
    const email = document.getElementById('signUpEmail').value.trim();
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpConfirmPassword').value;

    if (!name || !email || !password) {
      showError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }

    setLoading(true);
    clearError();

    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);

      // Update profile with name
      if (result.user) {
        await result.user.updateProfile({
          displayName: name
        });
      }

      closeAuthModal();
      showToast('Account created! Welcome to TheDeepVerse 🎉', 'success');
    } catch (error) {
      console.error('[Auth] Sign-Up error:', error);
      let message = 'Sign-up failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Try signing in.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Use at least 6 characters.';
      }
      showError(message);
    } finally {
      setLoading(false);
    }
  }

  // Phone Authentication Handlers
  let recaptchaVerifier = null;

  function ensureRecaptcha() {
    // Create invisible reCAPTCHA if not already created
    if (recaptchaVerifier) return;
    // Ensure container exists
    if (!document.getElementById('recaptcha-container')) {
      var div = document.createElement('div');
      div.id = 'recaptcha-container';
      document.body.appendChild(div);
    }
    try {
      recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': function() { /* reCAPTCHA solved */ },
        'expired-callback': function() { recaptchaVerifier = null; }
      });
    } catch(e) {
      console.error('[Auth] RecaptchaVerifier error:', e);
    }
  }

  async function handlePhoneSignInStart() {
    if (!auth) return;

    const phoneNumberInput = document.getElementById('phoneNumber');
    const phoneNumber = phoneNumberInput.value.trim();

    if (!phoneNumber) {
      showError('Please enter your phone number.');
      return;
    }

    // Basic phone number validation
    if (!/^\+?[\d\s\-\(\)]+$/.test(phoneNumber) || phoneNumber.replace(/[\s\-\(\)]/g, '').length < 10) {
      showError('Please enter a valid phone number.');
      return;
    }

    // Add +91 prefix if not present
    var formattedPhone = phoneNumber;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone.replace(/^0+/, '');
    }

    setLoading(true);
    clearError();

    try {
      // Initialize reCAPTCHA verifier (required for phone auth)
      ensureRecaptcha();
      if (!recaptchaVerifier) {
        showError('reCAPTCHA failed to load. Please refresh the page.');
        setLoading(false);
        return;
      }

      // Send verification code
      confirmationResult = await auth.signInWithPhoneNumber(formattedPhone, recaptchaVerifier);
      phoneVerificationInProgress = true;

      // Show verification code input
      const verificationCodeInput = document.getElementById('verificationCode');
      if (verificationCodeInput) {
        verificationCodeInput.disabled = false;
        verificationCodeInput.focus();
      }

      // Hide phone number input, show verification inputs
      const phoneNumberSection = document.getElementById('phoneNumberSection');
      const verificationSection = document.getElementById('verificationSection');
      if (phoneNumberSection) phoneNumberSection.style.display = 'none';
      if (verificationSection) verificationSection.style.display = 'block';

      showSuccess('✅ Verification code sent! Check your phone.');
    } catch (error) {
      console.error('[Auth] Phone Sign-In error:', error);
      // Reset reCAPTCHA on failure so it can be retried
      recaptchaVerifier = null;
      let message = 'Failed to send verification code.';
      if (error.code === 'auth/invalid-phone-number') {
        message = 'Invalid phone number. Use format: +91 98765 43210';
      } else if (error.code === 'auth/missing-phone-number') {
        message = 'Please enter a phone number.';
      } else if (error.code === 'auth/quota-exceeded') {
        message = 'SMS limit reached. Please try again later or use Email/Google login.';
      } else if (error.code === 'auth/unauthorized-domain') {
        message = 'This domain is not authorized. Please use Email or Google login.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please wait and try again.';
      }
      showError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyPhone() {
    if (!auth || !phoneVerificationInProgress || !confirmationResult) return;

    const verificationCodeInput = document.getElementById('verificationCode');
    const verificationCode = verificationCodeInput.value.trim();

    if (!verificationCode) {
      showError('Please enter the verification code.');
      return;
    }

    setLoading(true);
    clearError();

    try {
      // Verify the code
      await confirmationResult.confirm(verificationCode);
      closeAuthModal();
      showToast('Welcome to TheDeepVerse! 📱', 'success');
    } catch (error) {
      console.error('[Auth] Phone Verification error:', error);
      let message = 'Invalid verification code.';
      if (error.code === 'auth/invalid-verification-code') {
        message = 'Invalid verification code. Please try again.';
      } else if (error.code === 'auth/code-expired') {
        message = 'Verification code has expired. Please request a new code.';
      } else if (error.code === 'auth/missing-verification-code') {
        message = 'Please enter the verification code.';
      }
      showError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    if (!auth || !phoneVerificationInProgress || !confirmationResult) return;

    setLoading(true);
    clearError();

    try {
      // Resend the code
      await confirmationResult.verifyPhoneNumber();
      showSuccess('✅ Verification code resent. Please check your phone.');
    } catch (error) {
      console.error('[Auth] Resend Code error:', error);
      let message = 'Failed to resend verification code.';
      if (error.code === 'auth/quota-exceeded') {
        message = 'SMS quota exceeded. Please try again later.';
      }
      showError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    if (!auth) return;

    try {
      await auth.signOut();
      if (userDropdown) userDropdown.classList.remove('is-open');
      showToast('Signed out successfully', 'info');
    } catch (error) {
      console.error('[Auth] Sign-Out error:', error);
      showToast('Failed to sign out', 'error');
    }
  }

  function toggleUserDropdown() {
    if (userDropdown) {
      userDropdown.classList.toggle('is-open');
    }
  }

  // ── Toast (reuses main.js showToast if available) ──
  function showToast(message, type) {
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      // Fallback toast
      const existing = document.querySelector('.toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = `toast toast--${type}`;
      toast.textContent = message;
      toast.setAttribute('role', 'alert');
      document.body.appendChild(toast);

      requestAnimationFrame(() => toast.classList.add('is-visible'));

      setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }
  }

  // ── Export for global use ──
  window.TDVAuth = {
    openAuthModal: openAuthModal,
    closeAuthModal: closeAuthModal,
    getCurrentUser: function () { return currentUser; },
    requireLogin: requireLogin
  };
  // Convenience globals used by some inline handlers
  window.openAuthModal = openAuthModal;
  window.requireLogin = requireLogin;

  // ── Initialize ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }

})();