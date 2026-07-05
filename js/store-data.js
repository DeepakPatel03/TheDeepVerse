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
      id: 'master-bundle',
      type: 'bundle',
      category: 'bundle',
      title: 'TheDeepVerse Master Bundle',
      description: 'Everything you need to master psychology AND build a psychology content empire. Get all courses, notes, the Master Prompt, and the Video Creation Method — at one unbeatable price.',
      overview: 'The Master Bundle is your all-access pass to everything TheDeepVerse has ever created — and everything we will create in the future. Whether you want to understand human psychology deeply, create psychology content on YouTube, or simply master the hidden forces that drive human behavior — this bundle has it all. You get instant access to all premium courses, complete psychology notes, the AI Master Prompt, and the Video Creation Method. Plus, any new product we launch in the future is automatically included — free forever.',
      curriculum: [
        'All premium courses (Dark Psychology, Cognitive Biases, Emotional Intelligence)',
        'Complete Psychology Notes (200+ pages)',
        'TheDeepVerse Master Prompt (AI content creation)',
        'Video Creation Method (full YouTube system)',
        'Dark Psychology Cheat Sheet',
        'Thumbnail Design Mastery',
        'All future products — free forever',
        'Priority community access & support'
      ],
      method: 'Step 1: Purchase the bundle and receive instant access via email.\nStep 2: Download all included products from your access link.\nStep 3: Start with whichever course interests you most.\nStep 4: Use the Master Prompt for AI-powered content creation.\nStep 5: Follow the Video Creation Method to build your own channel.',
      price: 699,
      originalPrice: 1499,
      tag: 'Launch Offer — 53% OFF',
      tagColor: 'gold',
      thumbnail: '',
      thumbnailUrl: '',
      emoji: '🧠',
      images: [],
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
      instructor: 'Deepak Patel',
      duration: 'Lifetime Access',
      language: 'Hindi + English',
      level: 'All Levels',
      students: '500+',
      lastUpdated: '2026-07-04',
      createdAt: Date.now()
    },
    {
      id: 'dark-psych-course',
      type: 'course',
      category: 'course',
      title: 'Dark Psychology Mastery',
      description: 'The complete guide to understanding manipulation, persuasion, and the dark side of human behavior. 12 chapters, real-world examples, case studies.',
      overview: 'Dark Psychology Mastery is a deep dive into the hidden mechanisms of human manipulation, persuasion, and influence. This course exposes the psychological tactics used by con artists, cult leaders, advertisers, and manipulative people — not to teach you to manipulate, but to help you recognize and defend against these tactics. With 12 comprehensive chapters, real-world case studies, and actionable defense strategies, this is the most complete dark psychology resource available in Hindi.',
      curriculum: [
        'Chapter 1: What is Dark Psychology? — Origins & Core Concepts',
        'Chapter 2: The Dark Triad — Narcissism, Machiavellianism, Psychopathy',
        'Chapter 3: Manipulation Tactics — 15 Techniques Exposed',
        'Chapter 4: Persuasion Psychology — The Science of Influence',
        'Chapter 5: Gaslighting — How to Detect & Defend Against It',
        'Chapter 6: Emotional Manipulation — Love Bombing, Guilt Tripping',
        'Chapter 7: Social Engineering — How People Hack Humans',
        'Chapter 8: Body Language Deception — Reading Hidden Signals',
        'Chapter 9: Mind Control Techniques — From Cults to Advertising',
        'Chapter 10: Defense Strategies — Protecting Your Mind',
        'Chapter 11: Real Case Studies — Dark Psychology in Action',
        'Chapter 12: Ethical Application — Using Psychology for Good'
      ],
      method: 'Step 1: Download the PDF course material.\nStep 2: Read one chapter per day for maximum retention.\nStep 3: Complete the reflection exercises at the end of each chapter.\nStep 4: Practice identifying dark psychology tactics in daily life.\nStep 5: Use the defense strategies to protect yourself and others.',
      price: 349,
      originalPrice: 499,
      tag: '30% OFF',
      tagColor: 'red',
      thumbnail: '',
      thumbnailUrl: '',
      emoji: '🕵️',
      images: [],
      features: [
        '12 in-depth chapters',
        'Real-world case studies',
        'Defense strategies included',
        'PDF format — read anywhere',
        'Lifetime access'
      ],
      featured: false,
      active: true,
      downloadUrl: '',
      instructor: 'Deepak Patel',
      duration: '12 Chapters',
      language: 'Hindi + English',
      level: 'Beginner to Advanced',
      students: '350+',
      lastUpdated: '2026-07-04',
      createdAt: Date.now()
    },
    {
      id: 'biases-course',
      type: 'course',
      category: 'course',
      title: 'Cognitive Biases Decoded',
      description: '50+ cognitive biases explained with real-life examples. Learn how your brain tricks you — and how to use this knowledge to your advantage.',
      overview: 'Your brain lies to you every single day — and you don\'t even notice. Cognitive Biases Decoded reveals the 50+ hidden mental shortcuts that distort your thinking, decisions, and relationships. From the Dunning-Kruger Effect to Confirmation Bias, from Anchoring to the Halo Effect — each bias is explained with relatable real-life examples, scientific research, and practical tips to overcome them.',
      curriculum: [
        'Section 1: Introduction to Cognitive Biases — Why Your Brain Lies',
        'Section 2: Decision-Making Biases — Anchoring, Availability, Framing',
        'Section 3: Social Biases — Halo Effect, Bandwagon, In-group',
        'Section 4: Memory Biases — Misinformation Effect, Rosy Retrospection',
        'Section 5: Self-Assessment Biases — Dunning-Kruger, Overconfidence',
        'Section 6: Attention Biases — Selective Attention, Change Blindness',
        'Section 7: Emotional Biases — Affect Heuristic, Loss Aversion',
        'Section 8: Biases in Relationships — How They Destroy Trust',
        'Section 9: Biases in Business — Marketing & Sales Tricks',
        'Section 10: Overcoming Biases — Practical Debiasing Techniques'
      ],
      method: 'Step 1: Download and start reading from Section 1.\nStep 2: After each bias, try to recall a personal experience where it affected you.\nStep 3: Use the "Bias Spotter" checklist to identify biases in daily decisions.\nStep 4: Share one bias per day with friends/family to reinforce learning.',
      price: 279,
      originalPrice: 399,
      tag: '30% OFF',
      tagColor: 'purple',
      thumbnail: '',
      thumbnailUrl: '',
      emoji: '🧩',
      images: [],
      features: [
        '50+ biases explained',
        'Real-life examples for each',
        'Bias Spotter checklist included',
        'Scientific references',
        'Lifetime access'
      ],
      featured: false,
      active: true,
      downloadUrl: '',
      instructor: 'Deepak Patel',
      duration: '10 Sections',
      language: 'Hindi + English',
      level: 'Beginner to Intermediate',
      students: '200+',
      lastUpdated: '2026-07-04',
      createdAt: Date.now()
    },
    {
      id: 'eq-course',
      type: 'course',
      category: 'course',
      title: 'Emotional Intelligence Blueprint',
      description: 'Master your emotions, read others like a book, and build unbreakable relationships. The skill that matters more than IQ.',
      overview: 'Research shows that Emotional Intelligence (EQ) predicts success better than IQ. This course is your complete blueprint to mastering the 5 pillars of emotional intelligence: Self-Awareness, Self-Regulation, Motivation, Empathy, and Social Skills. Learn to manage your emotions under pressure, read people accurately, and build deep meaningful relationships.',
      curriculum: [
        'Module 1: What is Emotional Intelligence? — Science & Research',
        'Module 2: Self-Awareness — Knowing Your Emotional Patterns',
        'Module 3: Self-Regulation — Controlling Impulses & Reactions',
        'Module 4: Motivation — Internal Drive & Resilience',
        'Module 5: Empathy — Reading Others Like an Open Book',
        'Module 6: Social Skills — Communication & Conflict Resolution',
        'Module 7: EQ in Relationships — Love, Family & Friendships',
        'Module 8: EQ at Work — Leadership & Team Dynamics',
        'Module 9: EQ Self-Assessment — Where Do You Stand?',
        'Module 10: Daily EQ Practices — Building Habits That Last'
      ],
      method: 'Step 1: Take the EQ Self-Assessment in Module 9 FIRST to know your baseline.\nStep 2: Read modules sequentially — each builds on the previous.\nStep 3: Practice the daily exercises at the end of each module.\nStep 4: Re-take the assessment after 30 days to measure growth.',
      price: 245,
      originalPrice: 349,
      tag: '30% OFF',
      tagColor: 'purple',
      thumbnail: '',
      thumbnailUrl: '',
      emoji: '💡',
      images: [],
      features: [
        '10 comprehensive modules',
        'EQ Self-Assessment included',
        'Daily practice exercises',
        'Relationship & career focus',
        'Lifetime access'
      ],
      featured: false,
      active: true,
      downloadUrl: '',
      instructor: 'Deepak Patel',
      duration: '10 Modules',
      language: 'Hindi + English',
      level: 'All Levels',
      students: '150+',
      lastUpdated: '2026-07-04',
      createdAt: Date.now()
    },
    {
      id: 'psych-notes',
      type: 'notes',
      category: 'notes',
      title: 'Complete Psychology Notes',
      description: '200+ pages of handcrafted notes covering every major psychology concept, bias, and manipulation technique. PDF format, beautifully designed.',
      overview: 'These are not your typical boring academic notes. The Complete Psychology Notes is a beautifully designed 200+ page PDF that covers every major psychology concept — from cognitive biases and personality theories to dark psychology tactics and behavioral economics. Each concept is explained in simple language with visual examples.',
      curriculum: [
        'Part 1: Foundations of Psychology — Core Theories & Concepts',
        'Part 2: Cognitive Psychology — How the Mind Processes Information',
        'Part 3: Social Psychology — Group Behavior & Influence',
        'Part 4: Personality Psychology — Types, Traits & Disorders',
        'Part 5: Dark Psychology — Manipulation & Persuasion',
        'Part 6: Behavioral Economics — Psychology of Money & Decisions',
        'Part 7: Developmental Psychology — How Humans Grow & Change',
        'Part 8: Quick Reference — All Key Concepts in One Place'
      ],
      method: 'Step 1: Download the PDF.\nStep 2: Use as a reference guide — no need to read cover to cover.\nStep 3: Use the Quick Reference section for fast lookups.\nStep 4: Great for content creators as a research resource.',
      price: 139,
      originalPrice: 199,
      tag: '30% OFF',
      tagColor: 'red',
      thumbnail: '',
      thumbnailUrl: '',
      emoji: '📝',
      images: [],
      features: [
        '200+ beautifully designed pages',
        'Covers all major psychology concepts',
        'Visual examples & diagrams',
        'Quick reference section',
        'PDF format — print or digital'
      ],
      featured: false,
      active: true,
      downloadUrl: '',
      instructor: 'Deepak Patel',
      duration: '200+ Pages',
      language: 'Hindi + English',
      level: 'All Levels',
      students: '400+',
      lastUpdated: '2026-07-04',
      createdAt: Date.now()
    },
    {
      id: 'dark-cheatsheet',
      type: 'notes',
      category: 'notes',
      title: 'Dark Psychology Cheat Sheet',
      description: 'Quick-reference guide to all manipulation tactics, persuasion techniques, and defense strategies. Print it. Keep it. Use it.',
      overview: 'A compact, printable cheat sheet that gives you instant access to every dark psychology tactic, persuasion technique, and defense strategy — all on a few pages. Perfect for quick reference when you suspect someone is trying to manipulate you.',
      curriculum: [
        'Page 1: Top 15 Manipulation Tactics — Quick Identification Guide',
        'Page 2: Persuasion Principles — Cialdini\'s 6 Weapons of Influence',
        'Page 3: Gaslighting Red Flags — Warning Signs Checklist',
        'Page 4: Body Language Deception Cues — Visual Guide',
        'Page 5: Defense Strategies — Instant Counter-Tactics',
        'Page 6: Emotional Manipulation Patterns — Flowchart'
      ],
      method: 'Step 1: Download and print the cheat sheet.\nStep 2: Keep it handy — in your notebook, wallet, or phone.\nStep 3: Review it whenever you sense manipulation.\nStep 4: Use defense strategies to respond appropriately.',
      price: 69,
      originalPrice: 99,
      tag: '30% OFF',
      tagColor: 'red',
      thumbnail: '',
      thumbnailUrl: '',
      emoji: '📋',
      images: [],
      features: [
        'Printable quick-reference format',
        'All manipulation tactics listed',
        'Defense strategies included',
        'Visual flowcharts & checklists',
        'Fits in a notebook'
      ],
      featured: false,
      active: true,
      downloadUrl: '',
      instructor: 'Deepak Patel',
      duration: '6 Pages',
      language: 'Hindi + English',
      level: 'All Levels',
      students: '600+',
      lastUpdated: '2026-07-04',
      createdAt: Date.now()
    },
    {
      id: 'master-prompt',
      type: 'prompt',
      category: 'prompt',
      title: 'TheDeepVerse Master Prompt',
      description: 'The exact AI master prompt that powers all TheDeepVerse content — scripts, thumbnails, branding, and storytelling. Copy-paste and create content like a pro.',
      overview: 'Ever wondered how TheDeepVerse creates such cinematic, engaging psychology content? The secret is our AI Master Prompt — a carefully engineered set of prompts that works with ChatGPT, Claude, and other AI tools to generate viral-worthy scripts, thumbnail ideas, branding concepts, and storytelling frameworks.',
      curriculum: [
        'Prompt 1: Video Script Generator — Cinematic psychology documentaries',
        'Prompt 2: Thumbnail Concept Creator — Click-worthy designs',
        'Prompt 3: Title & Hook Generator — Viral-ready titles',
        'Prompt 4: Branding Voice Prompt — Consistent TheDeepVerse style',
        'Prompt 5: Research Summarizer — Turn papers into stories',
        'Prompt 6: SEO Description Writer — Optimized for YouTube',
        'Bonus: Custom Prompt Template — Create your own niche prompts'
      ],
      method: 'Step 1: Open ChatGPT, Claude, or any AI tool.\nStep 2: Copy the Master Prompt from the PDF/Doc file.\nStep 3: Paste it and add your topic (e.g., "Dark Psychology").\nStep 4: The AI will generate a complete, cinematic script.\nStep 5: Customize the output to match your style.\nStep 6: Use additional prompts for thumbnails, titles, and SEO.',
      price: 299,
      originalPrice: 599,
      tag: 'Exclusive',
      tagColor: 'gold',
      thumbnail: '',
      thumbnailUrl: '',
      emoji: '⚡',
      images: [],
      features: [
        '7 specialized AI prompts',
        'Works with ChatGPT, Claude & more',
        'Instant cinematic scripts',
        'Thumbnail & title generators',
        'Customizable for any niche',
        'Regular updates included'
      ],
      featured: false,
      active: true,
      downloadUrl: 'https://drive.google.com/file/d/1lZSjJrwewEiMNqZLR3eX1czTNhaHeJgq/view?usp=sharing',
      instructor: 'Deepak Patel',
      duration: 'Instant Access',
      language: 'English',
      level: 'All Levels',
      students: '300+',
      lastUpdated: '2026-07-04',
      createdAt: Date.now()
    },
    {
      id: 'video-method',
      type: 'method',
      category: 'method',
      title: 'Video Creation Method',
      description: 'The complete system behind every TheDeepVerse video — from research to scripting, editing to thumbnails, SEO to publishing. Build your own psychology channel.',
      overview: 'This is the exact system Deepak Patel uses to create every TheDeepVerse video — from the initial idea to the final upload. It covers research methodology, scriptwriting frameworks, AI-assisted editing workflows, thumbnail psychology, SEO optimization, and publishing strategies.',
      curriculum: [
        'Phase 1: Research & Topic Selection — Finding viral-worthy ideas',
        'Phase 2: Scriptwriting — The TheDeepVerse storytelling framework',
        'Phase 3: AI Tools Setup — ChatGPT, ElevenLabs, Midjourney',
        'Phase 4: Video Editing — Pacing, transitions, B-roll strategies',
        'Phase 5: Thumbnail Design — Psychology of click-worthy thumbnails',
        'Phase 6: SEO & Publishing — Titles, descriptions, tags optimization',
        'Phase 7: Growth Strategy — How to go from 0 to 10K subscribers',
        'Bonus: TheDeepVerse Tech Stack — All tools & software revealed'
      ],
      method: 'Step 1: Read the complete method document.\nStep 2: Set up your tech stack using the provided tool list.\nStep 3: Follow Phase 1-2 to create your first script.\nStep 4: Use Phase 3-4 to produce your first video.\nStep 5: Apply Phase 5-6 for thumbnails and publishing.\nStep 6: Follow Phase 7 for consistent growth.',
      price: 599,
      originalPrice: 1199,
      tag: 'Most Requested',
      tagColor: 'red',
      thumbnail: '',
      thumbnailUrl: '',
      emoji: '🎬',
      images: [],
      features: [
        'Complete video creation system',
        'AI tools & workflows included',
        'Scriptwriting framework',
        'Thumbnail design psychology',
        'SEO & growth strategies',
        'Full tech stack revealed'
      ],
      featured: false,
      active: true,
      downloadUrl: '',
      instructor: 'Deepak Patel',
      duration: '8 Phases',
      language: 'Hindi + English',
      level: 'Beginner to Advanced',
      students: '250+',
      lastUpdated: '2026-07-04',
      createdAt: Date.now()
    },
    {
      id: 'thumbnail-method',
      type: 'method',
      category: 'method',
      title: 'Thumbnail Design Mastery',
      description: 'Create click-worthy thumbnails that stop the scroll. Templates, psychology of colors, face expressions, text placement — everything.',
      overview: 'Your thumbnail is the first impression — and on YouTube, it\'s everything. This course teaches you the psychology behind click-worthy thumbnails: which colors trigger curiosity, how facial expressions drive clicks, and where to place text for maximum impact. Includes ready-to-use templates.',
      curriculum: [
        'Lesson 1: Psychology of Thumbnails — Why People Click',
        'Lesson 2: Color Psychology — Colors that Trigger Curiosity',
        'Lesson 3: Face Expressions — The Science of Emotional Faces',
        'Lesson 4: Text Placement — Readable, Bold, Click-worthy',
        'Lesson 5: Composition Rules — Balance, Contrast, Hierarchy',
        'Lesson 6: Templates & Tools — Ready-to-use designs',
        'Lesson 7: A/B Testing — How to Test & Improve CTR'
      ],
      method: 'Step 1: Read lessons 1-5 to understand thumbnail psychology.\nStep 2: Download the templates from Lesson 6.\nStep 3: Customize a template for your next video.\nStep 4: Use the A/B testing guide to measure performance.',
      price: 249,
      originalPrice: 0,
      tag: '',
      tagColor: '',
      thumbnail: '',
      thumbnailUrl: '',
      emoji: '🖼️',
      images: [],
      features: [
        '7 practical lessons',
        'Ready-to-use templates',
        'Color & expression psychology',
        'A/B testing guide',
        'All tools listed'
      ],
      featured: false,
      active: true,
      downloadUrl: '',
      instructor: 'Deepak Patel',
      duration: '7 Lessons',
      language: 'Hindi + English',
      level: 'Beginner',
      students: '180+',
      lastUpdated: '2026-07-04',
      createdAt: Date.now()
    },
    {
      id: 'starter-kit',
      type: 'free',
      category: 'free',
      title: 'Psychology Starter Kit',
      description: '10 must-know psychology concepts, 5 cognitive bias breakdowns, and a self-analysis worksheet. Start your journey — completely free.',
      overview: 'Not sure where to start with psychology? The Starter Kit covers the 10 most important psychology concepts, breaks down 5 cognitive biases with real examples, and includes a self-analysis worksheet. The perfect first step into the world of human psychology.',
      curriculum: [
        '10 Must-Know Psychology Concepts',
        '5 Cognitive Bias Breakdowns with Examples',
        'Self-Analysis Worksheet',
        'Recommended Reading List',
        'Bonus: Quick Psychology Quiz'
      ],
      method: 'Step 1: Download the free PDF.\nStep 2: Read the 10 core concepts.\nStep 3: Complete the Self-Analysis Worksheet.\nStep 4: Take the Quick Psychology Quiz.\nStep 5: Explore our premium courses for deeper learning.',
      price: 0,
      originalPrice: 0,
      tag: 'Free',
      tagColor: 'green',
      thumbnail: '',
      thumbnailUrl: '',
      emoji: '🎁',
      images: [],
      features: [
        '10 core psychology concepts',
        '5 cognitive bias breakdowns',
        'Self-analysis worksheet',
        'Quick psychology quiz',
        'Completely free'
      ],
      featured: false,
      active: true,
      downloadUrl: '',
      instructor: 'Deepak Patel',
      duration: 'Quick Read',
      language: 'Hindi + English',
      level: 'Beginner',
      students: '1000+',
      lastUpdated: '2026-07-04',
      createdAt: Date.now()
    }
  ];

  // ── Data versioning ──
  const DATA_VERSION = '2026-07-04-v3'; // v3: Added course detail fields
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
    } catch(e) {
      console.error('[StoreEngine] Firebase init failed:', e);
      firebaseReady = false;
    }
  }

  // ── Core Methods ──
  function getProducts() {
    if (firebaseProducts && firebaseProducts.length > 0) return [...firebaseProducts];
    try {
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
