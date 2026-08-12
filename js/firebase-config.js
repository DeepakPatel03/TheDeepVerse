/* ═══════════════════════════════════════════════════
   FIREBASE CONFIG — TheDeepVerse
   ═══════════════════════════════════════════════════
   Connected to Firebase Realtime Database.
   Admin panel changes now persist for ALL visitors.
   Firebase Auth enabled for user authentication.
   Firebase Storage enabled for image uploads.
   ═══════════════════════════════════════════════════ */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBnXmrZfVrww5Ka-Hot-vI7FPTp6LcLErw",
  authDomain: "thedeepverse-9cc85.firebaseapp.com",
  databaseURL: "https://thedeepverse-9cc85-default-rtdb.firebaseio.com",
  projectId: "thedeepverse-9cc85",
  storageBucket: "thedeepverse-9cc85.firebasestorage.app",
  messagingSenderId: "879010852853",
  appId: "1:879010852853:web:7658c86ddbc63c97783abc",
  measurementId: "G-PVYDKFSY16"
};

// ── Firebase Status ──
const FIREBASE_ENABLED = FIREBASE_CONFIG.apiKey !== "" && FIREBASE_CONFIG.databaseURL !== "";

// ── Initialize Firebase App ──
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDatabase = null;
let firebaseStorage = null;

if (FIREBASE_ENABLED && typeof firebase !== 'undefined') {
  try {
    // Use existing app if already initialized, otherwise create new
    if (firebase.apps.length > 0) {
      firebaseApp = firebase.apps[0];
    } else {
      firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    }
    firebaseAuth = firebaseApp.auth();
    firebaseDatabase = firebaseApp.database();
    // Initialize Storage if SDK is loaded
    if (typeof firebase.storage === 'function') {
      firebaseStorage = firebaseApp.storage();
      console.log('[Firebase] Storage initialized');
    }
    console.log('[Firebase] Initialized successfully');
  } catch (e) {
    console.error('[Firebase] Initialization error:', e);
  }
}

// ── Export for global use ──
window.FirebaseAuth = firebaseAuth;
window.FirebaseDatabase = firebaseDatabase;
window.FirebaseApp = firebaseApp;
window.FirebaseStorage = firebaseStorage;

