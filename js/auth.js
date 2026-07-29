/* ═══════════════════════════════════════════════════
   AUTHENTICATION — TheDeepVerse
   ═══════════════════════════════════════════════════
   Handles: Google Sign-In, Email/Password Auth,
   Auth State Observer, Login Modal, User Profile UI
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── State ──
  let auth = null;
  let googleProvider = null;
  let currentUser = null;
  let modalOpen = false;

  // ── DOM Elements ──
  let loginBtn = null;
  let userProfileBtn = null;
  let userDropdown = null;
  let authModal = null;
  let authModalBackdrop = null;
  let authModalClose = null;
  let tabSignIn = null;
  let tabSignUp = null;
  let formSignIn = null;
  let formSignUp = null;
  let googleSignInBtn = null;
  let authError = null;
  let authLoading = null;

  // ── Initialize Auth ──
  function initAuth() {
    // Wait for Firebase to be ready
    if (!window.FirebaseAuth) {
      setTimeout(initAuth, 100);
      return;
    }

    auth = window.FirebaseAuth;

    if (!auth) {
      console.warn('[Auth] Firebase Auth not available');
      return;
    }

    // Initialize Google Provider
    if (typeof firebase !== 'undefined' && firebase.auth) {
      googleProvider = new firebase.auth.GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: 'select_account' });
    }

    // Cache DOM elements
    cacheElements();

    // Set up event listeners
    setupEventListeners();

    // Auth state observer
    auth.onAuthStateChanged(handleAuthStateChanged);

    console.log('[Auth] Initialized');
  }

  function cacheElements() {
    loginBtn = document.getElementById('navLoginBtn');
    userProfileBtn = document.getElementById('navUserProfileBtn');
    userDropdown = document.getElementById('navUserDropdown');
    authModal = document.getElementById('authModal');
    authModalBackdrop = document.getElementById('authModalBackdrop');
    authModalClose = document.getElementById('authModalClose');
    tabSignIn = document.getElementById('tabSignIn');
    tabSignUp = document.getElementById('tabSignUp');
    formSignIn = document.getElementById('formSignIn');
    formSignUp = document.getElementById('formSignUp');
    googleSignInBtn = document.getElementById('googleSignInBtn');
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

    // Forms
    if (formSignIn) {
      formSignIn.addEventListener('submit', handleSignIn);
    }
    if (formSignUp) {
      formSignUp.addEventListener('submit', handleSignUp);
    }

    // Google Sign-In
    if (googleSignInBtn) {
      googleSignInBtn.addEventListener('click', handleGoogleSignIn);
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
  }

  function updateNavUI(user) {
    if (user) {
      // User is signed in
      if (loginBtn) loginBtn.style.display = 'none';
      if (userProfileBtn) {
        userProfileBtn.style.display = 'flex';
        // Update user name/email in dropdown
        const userNameEl = document.getElementById('navUserName');
        const userEmailEl = document.getElementById('navUserEmail');
        const userAvatarEl = document.getElementById('navUserAvatar');

        if (userNameEl) userNameEl.textContent = user.displayName || 'User';
        if (userEmailEl) userEmailEl.textContent = user.email || '';
        if (userAvatarEl) {
          if (user.photoURL) {
            userAvatarEl.innerHTML = `<img src="${user.photoURL}" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
          } else {
            userAvatarEl.textContent = (user.displayName || user.email || 'U')[0].toUpperCase();
          }
        }
      }
    } else {
      // User is signed out
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      if (userProfileBtn) userProfileBtn.style.display = 'none';
      if (userDropdown) userDropdown.classList.remove('is-open');
    }
  }

  // ── Modal Controls ──
  function openAuthModal() {
    if (!authModal) return;
    authModal.style.display = 'flex';
    authModalBackdrop.style.display = 'block';
    modalOpen = true;
    document.body.style.overflow = 'hidden';

    // Reset to sign-in tab
    switchTab('signin');
    clearError();

    // Focus email input
    setTimeout(() => {
      const emailInput = document.getElementById('signInEmail');
      if (emailInput) emailInput.focus();
    }, 100);
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.style.display = 'none';
    authModalBackdrop.style.display = 'none';
    modalOpen = false;
    document.body.style.overflow = '';
    clearError();
    resetForms();
  }

  function switchTab(tab) {
    if (tab === 'signin') {
      if (tabSignIn) tabSignIn.classList.add('is-active');
      if (tabSignUp) tabSignUp.classList.remove('is-active');
      if (formSignIn) formSignIn.style.display = 'block';
      if (formSignUp) formSignUp.style.display = 'none';
    } else {
      if (tabSignIn) tabSignIn.classList.remove('is-active');
      if (tabSignUp) tabSignUp.classList.add('is-active');
      if (formSignIn) formSignIn.style.display = 'none';
      if (formSignUp) formSignUp.style.display = 'block';
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
    }
  }

  function setLoading(loading) {
    if (authLoading) {
      authLoading.style.display = loading ? 'flex' : 'none';
    }
    if (googleSignInBtn) {
      googleSignInBtn.disabled = loading;
    }
    const submitBtns = document.querySelectorAll('#formSignIn button[type="submit"], #formSignUp button[type="submit"]');
    submitBtns.forEach(btn => btn.disabled = loading);
  }

  function resetForms() {
    if (formSignIn) formSignIn.reset();
    if (formSignUp) formSignUp.reset();
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
    if (!auth) return;

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
      let message = 'Sign-in failed. Please check your credentials.';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
      }
      showError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    if (!auth) return;

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

  // ── Initialize ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }

})();