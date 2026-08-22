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
      modules: [
        {
          id: 'section-1',
          title: 'Section 1 — AI Content Creation',
          lessons: [
            { id: 's1-l1', title: 'Introduction', timestamp: 0, timeText: '00:00', description: '', duration: '', published: true },
            { id: 's1-l2', title: 'First Video Live Practical', timestamp: 179, timeText: '02:59', description: '', duration: '', published: true },
            { id: 's1-l3', title: 'Master Prompt Copy Paste', timestamp: 181, timeText: '03:01', description: '', duration: '', published: true },
            { id: 's1-l4', title: 'See the Magic of Master Prompt', timestamp: 312, timeText: '05:12', description: '', duration: '', published: true }
          ]
        },
        {
          id: 'section-2',
          title: 'Section 2 — AI Generation',
          lessons: [
            { id: 's2-l1', title: 'Script Writing', timestamp: 460, timeText: '07:40', description: '', duration: '', published: true },
            { id: 's2-l2', title: 'Scene Breakdown', timestamp: 625, timeText: '10:25', description: '', duration: '', published: true },
            { id: 's2-l3', title: 'Image + Video Prompt', timestamp: 660, timeText: '11:00', description: '', duration: '', published: true },
            { id: 's2-l4', title: 'Google Flow', timestamp: 713, timeText: '11:53', description: '', duration: '', published: true },
            { id: 's2-l5', title: 'Same Character Idea', timestamp: 1145, timeText: '19:05', description: '', duration: '', published: true }
          ]
        },
        {
          id: 'section-3',
          title: 'Section 3 — Voice + Editing',
          lessons: [
            { id: 's3-l1', title: 'Voice Generation (ElevenLabs)', timestamp: 1975, timeText: '32:55', description: '', duration: '', published: true },
            { id: 's3-l2', title: 'Voice Editing', timestamp: 2161, timeText: '36:01', description: '', duration: '', published: true },
            { id: 's3-l3', title: 'VPN Setup', timestamp: 2274, timeText: '37:54', description: '', duration: '', published: true },
            { id: 's3-l4', title: 'Video Editing', timestamp: 2330, timeText: '38:50', description: '', duration: '', published: true }
          ]
        },
        {
          id: 'section-4',
          title: 'Section 4 — Publishing',
          lessons: [
            { id: 's4-l1', title: 'SEO', timestamp: 3505, timeText: '58:25', description: '', duration: '', published: true },
            { id: 's4-l2', title: 'Second Video Practical', timestamp: 3660, timeText: '01:01:00', description: '', duration: '', published: true }
          ]
        }
      ],
      bonuses: [
        '🖤 Master Prompt 1 — Deep Black & White Cinematic Style, High Contrast Engraving Look, Psychological Documentary Style',
        '🎨 Master Prompt 2 — Same Engraving & Cinematic Style with Soft Natural Colors, Realistic Cinematic Feel'
      ],
      variants: [
        { id: 'master-prompt-1', name: 'Master Prompt 1 (everything in black and white)', price: 69, originalPrice: 99, downloadUrl: '' },
        { id: 'master-prompt-2', name: 'Master Prompt 2 (character is in its natural colour)', price: 69, originalPrice: 99, downloadUrl: '' },
        { id: 'ai-masterclass-full', name: 'AI Content Creation Masterclass', price: 149, originalPrice: 499, downloadUrl: '' }
      ],
      method: 'Step 1: Purchase the course and login to your account.\nStep 2: Open the Course Player from your Dashboard.\nStep 3: Follow along with the video — pause and practice each step.\nStep 4: Use the FREE Master Prompts to generate your own content.\nStep 5: Create your first AI-powered video using the complete workflow.',
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
  const DATA_VERSION = '2026-08-22-v7'; // v7: strip base64 from cache/Firebase, price fix
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
        var data = snapshot.val();
        var products = null;

        if (data) {
          if (Array.isArray(data)) {
            products = data.filter(function(p) { return p && p.id; });
          } else if (typeof data === 'object') {
            products = Object.values(data).filter(function(p) { return p && p.id; });
          }
        }

        if (products && products.length > 0) {
          firebaseProducts = products;
          cacheProductsLocal(products);
          notifyChange();
          console.log('[StoreEngine] Products synced from Firebase (' + products.length + ')');
        } else {
          // Firebase is empty — seed default products (first install)
          seedFirebaseIfEmpty(products);
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

  // Safely cache a product list.
  // Base64 images are stripped before caching (Firebase keeps the full data).
  // This ensures price/variant changes always get cached regardless of image size.
  function stripBase64(products) {
    return products.map(function(p) {
      if (!p) return p;
      var stripped = Object.assign({}, p);
      // Remove base64 data URLs — keep only http/https URLs
      if (stripped.thumbnail && stripped.thumbnail.startsWith('data:')) stripped.thumbnail = '';
      if (stripped.thumbnailUrl && stripped.thumbnailUrl.startsWith('data:')) stripped.thumbnailUrl = '';
      if (stripped.hdThumbnail && stripped.hdThumbnail.startsWith('data:')) stripped.hdThumbnail = '';
      if (Array.isArray(stripped.images)) {
        stripped.images = stripped.images.map(function(img) {
          return (img && img.startsWith && img.startsWith('data:')) ? '' : img;
        }).filter(Boolean);
      }
      return stripped;
    });
  }

  function cacheProductsLocal(data) {
    try {
      // Strip base64 images so payload stays small regardless of thumbnails
      var stripped = stripBase64(data);
      var json = JSON.stringify(stripped);
      localStorage.setItem(STORAGE_KEY, json);
    } catch(e) {
      try { localStorage.removeItem(STORAGE_KEY); } catch(_) {}
      console.warn('[StoreEngine] Skipped localStorage cache:', e.message);
    }
  }

  // ── Delete Tracking ── (prevents deleted DEFAULT products from resurrecting)
  var DELETED_KEY = 'tdv_deleted_products';
  function getDeletedIds() {
    try { return JSON.parse(localStorage.getItem(DELETED_KEY) || '[]'); } catch(e) { return []; }
  }
  function addDeletedId(id) {
    var deleted = getDeletedIds();
    if (deleted.indexOf(id) === -1) { deleted.push(id); localStorage.setItem(DELETED_KEY, JSON.stringify(deleted)); }
    // Also save to Firebase so other devices see deletions
    if (firebaseDB) { try { firebaseDB.ref('deleted_products').set(deleted); } catch(e) {} }
  }

  // ── Core Methods ──
  // Firebase is the SINGLE SOURCE OF TRUTH.
  // On first launch (empty Firebase), DEFAULT_PRODUCTS are seeded once.
  // After that, admin controls everything — no code changes needed.
  var firebaseSeeded = false;

  function seedFirebaseIfEmpty(products) {
    // Only seed if Firebase is connected and products array is empty
    if (!firebaseDB || firebaseSeeded) return;
    firebaseSeeded = true;
    if (!products || products.length === 0) {
      console.log('[StoreEngine] Firebase empty — seeding DEFAULT_PRODUCTS...');
      firebaseDB.ref('products').set(DEFAULT_PRODUCTS)
        .then(function() { console.log('[StoreEngine] Default products seeded to Firebase ✅'); })
        .catch(function(e) { console.error('[StoreEngine] Seed failed:', e); });
    }
  }

  function mergeNewDefaults(products) {
    // ONLY sync MISSING structural fields (variants, modules, comboPrice)
    // from code defaults to Firebase products that are missing them.
    // NEVER add or remove products — admin controls that.
    var defaultsMap = {};
    DEFAULT_PRODUCTS.forEach(function(dp) { defaultsMap[dp.id] = dp; });

    products.forEach(function(p, i) {
      if (!p || !p.id) return;
      var dp = defaultsMap[p.id];
      if (!dp) return;
      // Sync variants only if Firebase product has none
      if (dp.variants && dp.variants.length > 0 && (!p.variants || !p.variants.length)) {
        products[i].variants = dp.variants;
      }
      // Sync modules only if Firebase product has none
      if (dp.modules && dp.modules.length > 0 && (!p.modules || !p.modules.length)) {
        products[i].modules = dp.modules;
      }
      // Sync comboPrice only if missing
      if (dp.comboPrice && !p.comboPrice) {
        products[i].comboPrice = dp.comboPrice;
        if (dp.comboOriginalPrice) products[i].comboOriginalPrice = dp.comboOriginalPrice;
      }
    });
    return products;
  }

  function getProducts() {
    // 1. Firebase is ready and has products — USE THEM (source of truth)
    if (firebaseProducts && firebaseProducts.length > 0) {
      return mergeNewDefaults([...firebaseProducts]);
    }
    // 2. Firebase not yet connected — try localStorage cache
    try {
      var storedVersion = localStorage.getItem(VERSION_KEY);
      if (storedVersion !== DATA_VERSION) {
        // Version mismatch — clear stale cache
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(DELETED_KEY);
        localStorage.setItem(VERSION_KEY, DATA_VERSION);
      }
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        var cached = JSON.parse(stored);
        if (cached && cached.length > 0) return mergeNewDefaults(cached);
      }
    } catch(e) { console.error('[StoreEngine] Cache read error:', e); }
    // 3. Nothing available yet — return defaults as placeholder only
    return [...DEFAULT_PRODUCTS];
  }


  function saveProducts(products) {
    // Cache full data locally (images are already stripped in cacheProductsLocal)
    cacheProductsLocal(products);
    if (firebaseReady && firebaseDB) {
      // Strip base64 images before sending to Firebase — only URLs go to Firebase
      // Base64 images are too large and cause Firebase write failures silently
      var toSave = stripBase64(products);
      firebaseDB.ref('products').set(toSave)
        .then(function() {
          console.log('[StoreEngine] Saved to Firebase ✅ (' + toSave.length + ' products)');
          notifyChange();
        })
        .catch(function(e) {
          console.error('[StoreEngine] Firebase save failed:', e.code, e.message);
        });
    }
    return true;
  }

  function getProduct(id) { return getProducts().find(p => p.id === id); }

  function addProduct(product) {
    const products = getProducts();
    product.id = product.id || 'product-' + Date.now();
    // Prevent duplicate IDs
    if (products.some(p => p.id === product.id)) {
      product.id = product.id + '-' + Date.now();
    }
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
    // Track deletion so default products don't resurrect
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
