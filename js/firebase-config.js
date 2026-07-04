/* ═══════════════════════════════════════════════════
   FIREBASE CONFIG — TheDeepVerse
   ═══════════════════════════════════════════════════
   
   SETUP INSTRUCTIONS:
   1. Go to https://console.firebase.google.com
   2. Click "Add Project" → Name: "thedeepverse" → Create
   3. Go to Build → Realtime Database → Create Database
   4. Choose location → Start in TEST MODE → Enable
   5. Go to Project Settings (gear icon) → General
   6. Scroll down → "Your apps" → Click Web icon (</>)
   7. Register app name: "thedeepverse-web"
   8. Copy the firebaseConfig object and paste below
   
   ═══════════════════════════════════════════════════ */

// ⚠️ PASTE YOUR FIREBASE CONFIG HERE (from Firebase Console)
const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// ── Firebase Status ──
const FIREBASE_ENABLED = FIREBASE_CONFIG.apiKey !== "" && FIREBASE_CONFIG.databaseURL !== "";
