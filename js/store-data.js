/* ═══════════════════════════════════════════════════
   STORE DATA ENGINE — TheDeepVerse
   Manages products via localStorage + Firebase
   ═══════════════════════════════════════════════════ */

const StoreEngine = (function() {
  const STORAGE_KEY = 'tdv_products';
  const ADMIN_KEY = 'tdv_admin_auth';

  // ── Default Products (with full detail page data) ──
  const DEFAULT_PRODUCTS = [
    
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
      modules: [
        {
          id: 'module-1', title: 'Section 1 - AI Content Creation', lessons: [
            { id: 'l1-1', title: 'Introduction', timestamp: 0, timeText: '00:00' },
            { id: 'l1-2', title: 'First Video Live Practical', timestamp: 179, timeText: '02:59' },
            { id: 'l1-3', title: 'Master Prompt Copy Paste', timestamp: 181, timeText: '03:01' },
            { id: 'l1-4', title: 'See the Magic of Master Prompt', timestamp: 312, timeText: '05:12' },
            { id: 'l1-5', title: 'Script Writing', timestamp: 460, timeText: '07:40' },
            { id: 'l1-6', title: 'Scene Breakdown', timestamp: 625, timeText: '10:25' }
          ]
        },
        {
          id: 'module-2', title: 'Section 2 - AI Generation', lessons: [
            { id: 'l2-1', title: 'Image + Video Prompt', timestamp: 660, timeText: '11:00' },
            { id: 'l2-2', title: 'Google Flow', timestamp: 713, timeText: '11:53' },
            { id: 'l2-3', title: 'Same Character Idea', timestamp: 1145, timeText: '19:05' }
          ]
        },
        {
          id: 'module-3', title: 'Section 3 - Audio & Editing', lessons: [
            { id: 'l3-1', title: 'Voice Generation (ElevenLabs)', timestamp: 1975, timeText: '32:55' },
            { id: 'l3-2', title: 'Voice Editing', timestamp: 2161, timeText: '36:01' },
            { id: 'l3-3', title: 'VPN Setup', timestamp: 2274, timeText: '37:54' },
            { id: 'l3-4', title: 'Video Editing', timestamp: 2330, timeText: '38:50' }
          ]
        },
        {
          id: 'module-4', title: 'Section 4 - Final Steps', lessons: [
            { id: 'l4-1', title: 'SEO', timestamp: 3505, timeText: '58:25' },
            { id: 'l4-2', title: 'Second Video Practical', timestamp: 3660, timeText: '01:01:00' }
          ]
        }
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
  let listeners = [];

  function notifyChange() {
    listeners.forEach(function(cb) {
      try { cb(getProducts()); } catch(e) { console.error('[StoreEngine] Listener error:', e); }
    });
  }

  // Subscribe to product changes (e.g. after Firebase image sync). Returns unsubscribe.
  function subscribe(cb) {
    if (typeof cb !== 'function') return function() {};
    listeners.push(cb);
    // Immediately fire with current data
    try { cb(getProducts()); } catch(e) {}
    return function() {
      listeners = listeners.filter(function(l) { return l !== cb; });
    };
  }

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
          cacheProductsLocal(data);
          notifyChange();
          console.log('[StoreEngine] Products synced from Firebase (' + data.length + ')');
        }
      });
      // Sync deleted products
      firebaseDB.ref('deleted_products').on('value', function(snapshot) {
        const data = snapshot.val();
        if (data && Array.isArray(data)) {
          localStorage.setItem('tdv_deleted_ids', JSON.stringify(data));
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

  // Safely cache a product list. Base64 images can exceed localStorage quota,
  // so we only cache when the serialized payload is reasonably small.
  function cacheProductsLocal(data) {
    try {
      var json = JSON.stringify(data);
      // ~250 KB max cached payload; larger lists (with base64 images) are still
      // served live from Firebase instead of localStorage.
      if (json.length < 250000) {
        localStorage.setItem(STORAGE_KEY, json);
      }
    } catch(e) {
      try { localStorage.removeItem(STORAGE_KEY); } catch(_) {}
      console.warn('[StoreEngine] Skipped localStorage cache (size/quota)', e.message);
    }
  }

  // ── Core Methods ──
  function getDeletedIds() {
    try {
      return JSON.parse(localStorage.getItem('tdv_deleted_ids') || '[]');
    } catch(e) { return []; }
  }

  function addDeletedId(id) {
    var deleted = getDeletedIds();
    if (deleted.indexOf(id) === -1) {
      deleted.push(id);
      localStorage.setItem('tdv_deleted_ids', JSON.stringify(deleted));
      if (firebaseReady && firebaseDB) {
        firebaseDB.ref('deleted_products').set(deleted).catch(function(){});
      }
    }
  }

  function mergeNewDefaults(products) {
    // If DEFAULT_PRODUCTS has new items not in the cached list (and not explicitly deleted), add them
    var existingIds = {};
    products.forEach(function(p) { existingIds[p.id] = true; });
    var deletedIds = getDeletedIds();
    
    var added = false;
    DEFAULT_PRODUCTS.forEach(function(dp) {
      if (!existingIds[dp.id] && deletedIds.indexOf(dp.id) === -1) {
        products.push({...dp});
        added = true;
      }
    });
    if (added) {
      cacheProductsLocal(products);
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
    cacheProductsLocal(products);
    if (firebaseReady && firebaseDB) {
      firebaseDB.ref('products').set(products)
        .then(function() { console.log('[StoreEngine] Saved to Firebase ✅'); notifyChange(); })
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
    addDeletedId(id);
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

  // Legacy sync login (default password only). Used by inline fallbacks.
  function login(password) {
    const ADMIN_PASSWORD = 'deepverse2026';
    if (password === ADMIN_PASSWORD) { sessionStorage.setItem(ADMIN_KEY, 'true'); return true; }
    return false;
  }

  const DEFAULT_ADMIN_PASSWORD = 'deepverse2026';

  // Async login that honours the Firebase-configured admin password when set.
  function loginAsync(password, cb) {
    var done = function(valid) {
      if (valid) sessionStorage.setItem(ADMIN_KEY, 'true');
      if (typeof cb === 'function') cb(valid);
    };

    if (!firebaseReady || !firebaseDB) {
      done(password === DEFAULT_ADMIN_PASSWORD);
      return;
    }
    firebaseDB.ref('config/adminPassword').once('value').then(function(snap) {
      var configured = snap.val();
      if (configured) {
        done(password === configured);
      } else {
        done(password === DEFAULT_ADMIN_PASSWORD);
      }
    }).catch(function() {
      done(password === DEFAULT_ADMIN_PASSWORD);
    });
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
    generateId, isAuthenticated, login, loginAsync, logout,
    isFirebaseConnected, initFirebase, subscribe,
    DEFAULT_PRODUCTS
  };
})();


