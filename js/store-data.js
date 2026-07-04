/* ═══════════════════════════════════════════════════
   STORE DATA ENGINE — TheDeepVerse
   Manages products via localStorage with JSON import/export
   ═══════════════════════════════════════════════════ */

const StoreEngine = (function() {
  const STORAGE_KEY = 'tdv_products';
  const ADMIN_KEY = 'tdv_admin_auth';

  // ── Default Products ──
  const DEFAULT_PRODUCTS = [
    {
      id: 'master-bundle',
      type: 'bundle',
      category: 'bundle',
      title: 'TheDeepVerse Master Bundle',
      description: 'Everything you need to master psychology AND build a psychology content empire. Get all courses, notes, the Master Prompt, and the Video Creation Method — at one unbeatable price.',
      price: 699,
      originalPrice: 1499,
      tag: 'Launch Offer — 53% OFF',
      tagColor: 'gold',
      thumbnail: '',
      emoji: '🧠',
      features: [
        'All premium courses included',
        'Complete psychology notes library',
        'TheDeepVerse Master Prompt (AI)',
        'Video Creation Method (full system)',
        'Future products — free forever',
        'Priority community access'
      ],
      featured: true,
      active: true,
      downloadUrl: '',
      createdAt: Date.now()
    },
    {
      id: 'dark-psych-course',
      type: 'course',
      category: 'course',
      title: 'Dark Psychology Mastery',
      description: 'The complete guide to understanding manipulation, persuasion, and the dark side of human behavior. 12 chapters, real-world examples, case studies.',
      price: 349,
      originalPrice: 499,
      tag: '30% OFF',
      tagColor: 'red',
      thumbnail: '',
      emoji: '🕵️',
      features: [],
      featured: false,
      active: true,
      downloadUrl: '',
      createdAt: Date.now()
    },
    {
      id: 'biases-course',
      type: 'course',
      category: 'course',
      title: 'Cognitive Biases Decoded',
      description: '50+ cognitive biases explained with real-life examples. Learn how your brain tricks you — and how to use this knowledge to your advantage.',
      price: 279,
      originalPrice: 399,
      tag: '30% OFF',
      tagColor: 'purple',
      thumbnail: '',
      emoji: '🧩',
      features: [],
      featured: false,
      active: true,
      downloadUrl: '',
      createdAt: Date.now()
    },
    {
      id: 'eq-course',
      type: 'course',
      category: 'course',
      title: 'Emotional Intelligence Blueprint',
      description: 'Master your emotions, read others like a book, and build unbreakable relationships. The skill that matters more than IQ.',
      price: 245,
      originalPrice: 349,
      tag: '30% OFF',
      tagColor: 'purple',
      thumbnail: '',
      emoji: '💡',
      features: [],
      featured: false,
      active: true,
      downloadUrl: '',
      createdAt: Date.now()
    },
    {
      id: 'psych-notes',
      type: 'notes',
      category: 'notes',
      title: 'Complete Psychology Notes',
      description: '200+ pages of handcrafted notes covering every major psychology concept, bias, and manipulation technique. PDF format, beautifully designed.',
      price: 139,
      originalPrice: 199,
      tag: '30% OFF',
      tagColor: 'red',
      thumbnail: '',
      emoji: '📝',
      features: [],
      featured: false,
      active: true,
      downloadUrl: '',
      createdAt: Date.now()
    },
    {
      id: 'dark-cheatsheet',
      type: 'notes',
      category: 'notes',
      title: 'Dark Psychology Cheat Sheet',
      description: 'Quick-reference guide to all manipulation tactics, persuasion techniques, and defense strategies. Print it. Keep it. Use it.',
      price: 69,
      originalPrice: 99,
      tag: '30% OFF',
      tagColor: 'red',
      thumbnail: '',
      emoji: '📋',
      features: [],
      featured: false,
      active: true,
      downloadUrl: '',
      createdAt: Date.now()
    },
    {
      id: 'master-prompt',
      type: 'prompt',
      category: 'prompt',
      title: 'TheDeepVerse Master Prompt',
      description: 'The exact AI master prompt that powers all TheDeepVerse content — scripts, thumbnails, branding, and storytelling. Copy-paste and create content like a pro.',
      price: 299,
      originalPrice: 599,
      tag: 'Exclusive',
      tagColor: 'gold',
      thumbnail: '',
      emoji: '⚡',
      features: [],
      featured: false,
      active: true,
      downloadUrl: 'https://drive.google.com/file/d/1lZSjJrwewEiMNqZLR3eX1czTNhaHeJgq/view?usp=sharing',
      createdAt: Date.now()
    },
    {
      id: 'video-method',
      type: 'method',
      category: 'method',
      title: 'Video Creation Method',
      description: 'The complete system behind every TheDeepVerse video — from research to scripting, editing to thumbnails, SEO to publishing. Build your own psychology channel.',
      price: 599,
      originalPrice: 1199,
      tag: 'Most Requested',
      tagColor: 'red',
      thumbnail: '',
      emoji: '🎬',
      features: [],
      featured: false,
      active: true,
      downloadUrl: '',
      createdAt: Date.now()
    },
    {
      id: 'thumbnail-method',
      type: 'method',
      category: 'method',
      title: 'Thumbnail Design Mastery',
      description: 'Create click-worthy thumbnails that stop the scroll. Templates, psychology of colors, face expressions, text placement — everything.',
      price: 249,
      originalPrice: 0,
      tag: '',
      tagColor: '',
      thumbnail: '',
      emoji: '🖼️',
      features: [],
      featured: false,
      active: true,
      downloadUrl: '',
      createdAt: Date.now()
    },
    {
      id: 'starter-kit',
      type: 'free',
      category: 'free',
      title: 'Psychology Starter Kit',
      description: '10 must-know psychology concepts, 5 cognitive bias breakdowns, and a self-analysis worksheet. Start your journey — completely free.',
      price: 0,
      originalPrice: 0,
      tag: 'Free',
      tagColor: 'green',
      thumbnail: '',
      emoji: '🎁',
      features: [],
      featured: false,
      active: true,
      downloadUrl: '',
      createdAt: Date.now()
    }
  ];
  // ── Data versioning — bump this when DEFAULT_PRODUCTS prices/data change ──
  const DATA_VERSION = '2026-07-04-v2'; // Updated: 30% discount on courses/notes
  const VERSION_KEY = 'tdv_data_version';

  // ── Firebase Reference (set after Firebase loads) ──
  let firebaseDB = null;
  let firebaseReady = false;
  let firebaseProducts = null; // Cached Firebase data

  function initFirebase() {
    if (typeof FIREBASE_ENABLED === 'undefined' || !FIREBASE_ENABLED) return;
    if (typeof firebase === 'undefined') return;

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      firebaseDB = firebase.database();
      firebaseReady = true;
      console.log('[StoreEngine] Firebase connected ✅');

      // Listen for realtime changes
      firebaseDB.ref('products').on('value', function(snapshot) {
        const data = snapshot.val();
        if (data && Array.isArray(data)) {
          firebaseProducts = data;
          // Also update localStorage cache
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
          console.log('[StoreEngine] Products synced from Firebase (' + data.length + ' products)');
        }
      });
    } catch(e) {
      console.error('[StoreEngine] Firebase init failed:', e);
      firebaseReady = false;
    }
  }

  // ── Core Methods ──
  function getProducts() {
    // If Firebase has data cached, use it
    if (firebaseProducts && firebaseProducts.length > 0) {
      return [...firebaseProducts];
    }

    try {
      // Auto-reset if data version has changed (e.g., after pricing update)
      const storedVersion = localStorage.getItem(VERSION_KEY);
      if (storedVersion !== DATA_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(VERSION_KEY, DATA_VERSION);
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch(e) { console.error('StoreEngine: Error reading products', e); }
    return [...DEFAULT_PRODUCTS];
  }

  function saveProducts(products) {
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch(e) { console.error('StoreEngine: Error saving to localStorage', e); }

    // Save to Firebase (if connected)
    if (firebaseReady && firebaseDB) {
      firebaseDB.ref('products').set(products)
        .then(function() { console.log('[StoreEngine] Saved to Firebase ✅'); })
        .catch(function(e) { console.error('[StoreEngine] Firebase save failed:', e); });
    }
    return true;
  }

  function getProduct(id) {
    return getProducts().find(p => p.id === id);
  }

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

  function exportJSON() {
    return JSON.stringify(getProducts(), null, 2);
  }

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
  function isAuthenticated() {
    return sessionStorage.getItem(ADMIN_KEY) === 'true';
  }

  function login(password) {
    // Default password — user should change this
    const ADMIN_PASSWORD = 'deepverse2026';
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_KEY, 'true');
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(ADMIN_KEY);
  }

  function isFirebaseConnected() {
    return firebaseReady;
  }

  // Auto-init Firebase when script loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
  } else {
    initFirebase();
  }

  return {
    getProducts, saveProducts, getProduct,
    addProduct, updateProduct, deleteProduct,
    resetToDefaults, exportJSON, importJSON,
    generateId, isAuthenticated, login, logout,
    isFirebaseConnected, initFirebase,
    DEFAULT_PRODUCTS
  };
})();
