/* ═══════════════════════════════════════════════════
   FIREBASE CONFIG — TheDeepVerse
   ═══════════════════════════════════════════════════
   Connected to Firebase Realtime Database.
   Admin panel changes now persist for ALL visitors.
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
