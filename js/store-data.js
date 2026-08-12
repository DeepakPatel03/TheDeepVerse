/* ═══════════════════════════════════════════════════
   STORE DATA ENGINE — TheDeepVerse
   Manages products via localStorage + Firebase
   ═══════════════════════════════════════════════════ */

const StoreEngine = (function() {
  const STORAGE_KEY = 'tdv_products';
  const ADMIN_KEY = 'tdv_admin_auth';

  // ── Default Products (with full detail page data) ──
  const DEFAULT_PRODUCTS = [
    {
      id: 'psychology-book',
      type: 'ebook',
      category: 'ebook',
      title: 'The Dangerous Trap of Psychology',
      description: 'Manovigyan Ka Khatarnak Jal — Available in both Hindi and English. Learn the hidden psychological traps that control human behavior, decision-making, and manipulation.',
      overview: 'This book exposes the dangerous psychological traps that silently control our thoughts, decisions, and relationships. Written by Deepak Patel, it covers manipulation tactics, cognitive biases, emotional traps, and dark psychology patterns that most people never recognize. Available in both Hindi and English editions — or grab the Combo deal for both at a discounted price.',
      curriculum: [
        'Chapter 1: The Psychology of Control',
        'Chapter 2: Hidden Manipulation Tactics',
        'Chapter 3: Cognitive Bias Traps',
        'Chapter 4: Emotional Manipulation Patterns',
        'Chapter 5: Social Engineering & Influence',
        'Chapter 6: Dark Psychology in Daily Life',
        'Chapter 7: How to Defend Your Mind',
        'Chapter 8: Breaking Free from Psychological Traps'
      ],
      method: 'Step 1: Choose your preferred edition (Hindi, English, or Combo).\nStep 2: Complete payment via Razorpay.\nStep 3: Download your PDF instantly after payment.\nStep 4: Read at your own pace — works on any device.',
      price: 65,
      originalPrice: 99,
      tag: 'New Launch',
      tagColor: 'gold',
      thumbnail: '',
      thumbnailUrl: '',
      emoji: '📖',
      images: [],
      features: [
        'Available in Hindi & English',
        'PDF format — read on any device',
        'Combo deal: Both editions for ₹99',
        'Instant download after payment',
        'Written by Deepak Patel'
      ],
      featured: false,
      active: true,
      downloadUrl: 'https://drive.google.com/file/d/1sjbMKaaFCE-lWQd-B-aEmdBj559E_ipm/view?usp=drive_link',
      variants: [
        { id: 'eng', name: 'English Edition', price: 65, originalPrice: 99, downloadUrl: 'https://drive.google.com/file/d/1sjbMKaaFCE-lWQd-B-aEmdBj559E_ipm/view?usp=drive_link' },
        { id: 'hin', name: 'Hindi Edition (Manovigyan Ka Khatarnak Jal)', price: 65, originalPrice: 99, downloadUrl: 'https://drive.google.com/file/d/1L3i0_gV25u9sIeSWI1mtgufKRxwS0V0J/view?usp=drive_link' }
      ],
      comboPrice: 99,
      comboOriginalPrice: 198,
      instructor: 'Deepak Patel',
      duration: 'Complete Book',
      language: 'Hindi + English',
      level: 'All Levels',
      students: '100+',
      lastUpdated: '2026-07-22',
      createdAt: Date.now()
    },
    {
      id: 'ai-masterclass',
      type: 'video-course',
      category: 'course',
      title: 'AI Content Creation Masterclass',
      description: 'Complete Practical Course — Zero to Hero AI Workflow. Learn Script Writing, AI Image & Video Generation, Voice Generation, Professional Editing & SEO. 2+ Hours of HD Video + 2 FREE Master Prompts.',
      overview: 'Agar aap AI ki madad se YouTube Videos, Shorts, Instagram Reels ya Documentary Style Content banana chahte hain, to ye Complete Practical Masterclass aapke liye hai. Is course mein aap Step-by-Step seekhenge: Professional Script Writing, Psychology Storytelling, Viral Hooks, Scene Breakdown, AI Image Generation, Character Consistency, AI Video Generation, Google Flow Workflow, Image to Video Prompting, AI Voice Generation, Voice Enhancement, Professional Video Editing, Color Grading, Background Music, Sound Effects, aur Complete AI Content Creation Workflow.',
      curriculum: [
        '🎬 First Video Live Practical — Complete Walkthrough',
        '📋 Master Prompt Copy Paste — AI Setup',
        '✨ See the Magic of Master Prompt — Live Demo',
        '📝 Script Writing — Professional AI Scripts',
        '🎯 Scene Breakdown — Visual Planning',
        '🖼️ Image + Video Prompt — AI Generation',
        '🌊 Google Flow — Complete Workflow',
        '👤 Same Character Idea — Consistency Technique',
        '🎙️ Voice Generation — ElevenLabs Setup',
        '🎵 Voice Editing — Enhancement & Mixing',
        '🔐 VPN Setup — Access Global Tools',
        '🎥 Video Editing — Professional Editing',
        '📊 SEO — Optimize for Maximum Reach',
        '🎬 Second Video Practical — Advanced Workflow'
      ],
      videoId: 'SJ0RlWMPCXI',
      chapters: [
        { time: 179, title: 'First Video Live Practical', icon: '🎬' },
        { time: 181, title: 'Master Prompt Copy Paste', icon: '📋' },
        { time: 312, title: 'See the Magic of Master Prompt', icon: '✨' },
        { time: 460, title: 'Script Writing', icon: '📝' },
        { time: 625, title: 'Scene Breakdown', icon: '🎯' },
        { time: 660, title: 'Image + Video Prompt', icon: '🖼️' },
        { time: 713, title: 'Google Flow', icon: '🌊' },
        { time: 1145, title: 'Same Character Idea', icon: '👤' },
        { time: 1975, title: 'Voice Generation (ElevenLabs)', icon: '🎙️' },
        { time: 2161, title: 'Voice Editing', icon: '🎵' },
        { time: 2274, title: 'VPN Setup', icon: '🔐' },
        { time: 2330, title: 'Video Editing', icon: '🎥' },
        { time: 3505, title: 'SEO', icon: '📊' },
        { time: 3660, title: 'Second Video Practical', icon: '🎬' }
      ],
      bonuses: [
        '🖤 Master Prompt 1 — Deep Black & White Cinematic Style, High Contrast Engraving Look, Psychological Documentary Style',
        '🎨 Master Prompt 2 — Same Engraving & Cinematic Style with Soft Natural Colors, Realistic Cinematic Feel'
      ],
      method: 'Step 1: Purchase the course and login to your account.\\nStep 2: Open the Course Player from your Dashboard.\\nStep 3: Follow along with the video — pause and practice each step.\\nStep 4: Use the FREE Master Prompts to generate your own content.\\nStep 5: Create your first AI-powered video using the complete workflow.',
      price: 175,
      originalPrice: 499,
      tag: '65% OFF',
      tagColor: 'red',
      thumbnail: '',
      thumbnailUrl: '',
      emoji: '🤖',
      images: [],
      features: [
        '2+ Hours HD Video Course',
        'Complete AI Workflow — Zero to Hero',
        '2 FREE Premium Master Prompts',
        'Script Writing + Voice + Editing',
        'Google Flow + Character Consistency',
        'SEO Optimization Included',
        'Lifetime Access'
      ],
      featured: true,
      active: true,
      downloadUrl: '',
      instructor: 'Deepak Patel',
      duration: '2+ Hours Video',
      language: 'Hindi',
      level: 'Beginner to Advanced',
      students: 'New',
      lastUpdated: '2026-08-06',
      createdAt: Date.now()
    }
  ];

  // ── Data versioning ──
  const DATA_VERSION = '2026-08-12-v4'; // v4: Firebase Storage for images, auth dropdown fix
  const VERSION_KEY = 'tdv_data_version';

  // ── Firebase ──
  let firebaseDB = null;
  let firebaseReady = false;
  let firebaseProducts = null;

  function initFirebase() {
    if (typeof FIREBASE_ENABLED === 'undefined' || !FIREBASE_ENABLED) return;
    if (typeof firebase === 'undefined') return;
    try {
      if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      firebaseDB = firebase.database();
      firebaseReady = true;
      console.log('[StoreEngine] Firebase connected ✅');
      firebaseDB.ref('products').on('value', function(snapshot) {
        const data = snapshot.val();
        if (data && Array.isArray(data)) {
          firebaseProducts = data;
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
          console.log('[StoreEngine] Products synced from Firebase (' + data.length + ')');
        }
      });
      // Check cacheVersion — if admin triggered Force Refresh, clear local cache
      firebaseDB.ref('cacheVersion').on('value', function(snapshot) {
        var serverVersion = snapshot.val();
        if (serverVersion) {
          var localVersion = localStorage.getItem('tdv_cache_version');
          if (localVersion !== serverVersion) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.setItem('tdv_cache_version', serverVersion);
            console.log('[StoreEngine] Cache cleared by admin Force Refresh');
          }
        }
      });
    } catch(e) {
      console.error('[StoreEngine] Firebase init failed:', e);
      firebaseReady = false;
    }
  }

  // ── Core Methods ──
  function mergeNewDefaults(products) {
    // If DEFAULT_PRODUCTS has new items not in the cached list, add them
    var existingIds = {};
    products.forEach(function(p) { existingIds[p.id] = true; });
    var added = false;
    DEFAULT_PRODUCTS.forEach(function(dp) {
      if (!existingIds[dp.id]) {
        products.push({...dp});
        added = true;
      }
    });
    if (added) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); } catch(e) {}
    }
    return products;
  }

  function getProducts() {
    var products = null;
    if (firebaseProducts && firebaseProducts.length > 0) {
      products = [...firebaseProducts];
    } else {
      try {
        const storedVersion = localStorage.getItem(VERSION_KEY);
        if (storedVersion !== DATA_VERSION) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.setItem(VERSION_KEY, DATA_VERSION);
        }
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) products = JSON.parse(stored);
      } catch(e) { console.error('StoreEngine: Error reading products', e); }
    }
    if (!products || products.length === 0) return [...DEFAULT_PRODUCTS];
    return mergeNewDefaults(products);
  }

  function saveProducts(products) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); } catch(e) {}
    if (firebaseReady && firebaseDB) {
      firebaseDB.ref('products').set(products)
        .then(function() { console.log('[StoreEngine] Saved to Firebase ✅'); })
        .catch(function(e) { console.error('[StoreEngine] Firebase save failed:', e); });
    }
    return true;
  }

  function getProduct(id) { return getProducts().find(p => p.id === id); }

  function addProduct(product) {
    const products = getProducts();
    product.id = product.id || 'product-' + Date.now();
    product.createdAt = Date.now();
    product.active = product.active !== false;
    products.push(product);
    saveProducts(products);
    return product;
  }

  function updateProduct(id, updates) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
    return products[index];
  }

  function deleteProduct(id) {
    const products = getProducts().filter(p => p.id !== id);
    saveProducts(products);
    return true;
  }

  function resetToDefaults() {
    const defaults = [...DEFAULT_PRODUCTS];
    saveProducts(defaults);
    return defaults;
  }

  function exportJSON() { return JSON.stringify(getProducts(), null, 2); }

  function importJSON(jsonString) {
    try {
      const products = JSON.parse(jsonString);
      if (!Array.isArray(products)) throw new Error('Invalid format');
      saveProducts(products);
      return products;
    } catch(e) { throw new Error('Invalid JSON: ' + e.message); }
  }

  function generateId(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // ── Auth ──
  function isAuthenticated() { return sessionStorage.getItem(ADMIN_KEY) === 'true'; }

  function login(password) {
    const ADMIN_PASSWORD = 'deepverse2026';
    if (password === ADMIN_PASSWORD) { sessionStorage.setItem(ADMIN_KEY, 'true'); return true; }
    return false;
  }

  function logout() { sessionStorage.removeItem(ADMIN_KEY); }
  function isFirebaseConnected() { return firebaseReady; }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
  } else { initFirebase(); }

  return {
    getProducts, saveProducts, getProduct,
    addProduct, updateProduct, deleteProduct,
    resetToDefaults, exportJSON, importJSON,
    generateId, isAuthenticated, login, logout,
    isFirebaseConnected, initFirebase,
    DEFAULT_PRODUCTS
  };
})();
