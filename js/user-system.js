/* ═══════════════════════════════════════════════════
   USER SYSTEM — TheDeepVerse
   Shared layer for the AUTH → PURCHASE → ACCESS flow.

   Covers:
   - Reading the CURRENT user's purchases only (never other users')
   - Recording purchases after payment
   - Product type classification (course / ebook / digital)
   - Curriculum stored in Firebase RTDB (admin-controlled)
   - Course progress ("Continue Learning") per user
   ═══════════════════════════════════════════════════ */

const UserSystem = (function () {
  'use strict';

  // ── Low-level helpers ──
  function db() {
    return window.FirebaseDatabase || null;
  }

  function uidOf(user) {
    return user && user.uid ? user.uid : null;
  }

  // ── Product type classification ──
  // Used to decide which section of My Dashboard a product belongs to.
  function getProductType(product) {
    if (!product) return 'digital';
    var type = String(product.type || '').toLowerCase();
    var category = String(product.category || '').toLowerCase();
    if (type === 'video-course' || type === 'course' || category === 'course') return 'course';
    if (type === 'ebook' || type === 'book' || category === 'ebook') return 'ebook';
    return 'digital';
  }

  // ── Purchases (scoped strictly to the given Firebase Auth UID) ──
  // Existing record shape: users/{uid}/purchases/{productId} = true
  //                          + users/{uid}/purchaseDetails/{productId} = {…}
  function getPurchases(uid) {
    return new Promise(function (resolve) {
      if (!db() || !uid) { resolve({}); return; }
      db().ref('users/' + uid + '/purchases').once('value').then(function (snap) {
        var data = snap.val() || {};
        // A purchase may exist as `true` or as an object (older imports).
        Object.keys(data).forEach(function (k) {
          if (data[k] === true) data[k] = true;
          else if (data[k] && typeof data[k] === 'object') data[k] = true;
          else delete data[k];
        });
        resolve(data);
      }).catch(function () { resolve({}); });
    });
  }

  function getPurchasedIds(uid) {
    return getPurchases(uid).then(function (purchases) {
      return Object.keys(purchases).filter(function (k) { return purchases[k]; });
    });
  }

  function isPurchased(uid, productId) {
    if (!uid || !productId || !db()) return Promise.resolve(false);
    return getPurchases(uid).then(function (purchases) {
      if (purchases[productId]) return true;
      // Also check parent courses or variant aliases
      if (productId.startsWith('ai-masterclass') && purchases['ai-masterclass']) return true;
      if (purchases['ai-masterclass'] && (productId === 'master-prompt-1' || productId === 'master-prompt-2' || productId === 'ai-masterclass-full')) return true;
      if (productId.startsWith('psychology-book') && purchases['psychology-book']) return true;
      if (purchases['psychology-book'] && (productId === 'eng' || productId === 'hin')) return true;

      // Generic prefix check (e.g. courseId_variantId)
      var parts = productId.split('_');
      if (parts.length > 1 && purchases[parts[0]]) return true;

      return false;
    });
  }

  // Records a successful purchase against the logged-in user.
  function recordPurchase(user, productId, details) {
    return new Promise(function (resolve, reject) {
      var uid = uidOf(user);
      if (!db() || !uid || !productId) { resolve(false); return; }
      var updates = {};
      updates['users/' + uid + '/purchases/' + productId] = true;
      updates['users/' + uid + '/purchaseDetails/' + productId] = details || {
        purchasedAt: new Date().toISOString()
      };

      // If full course is purchased (e.g. ai-masterclass), also grant access to its included prompts
      if (productId === 'ai-masterclass' || productId.startsWith('ai-masterclass')) {
        updates['users/' + uid + '/purchases/ai-masterclass'] = true;
        updates['users/' + uid + '/purchases/master-prompt-1'] = true;
        updates['users/' + uid + '/purchases/master-prompt-2'] = true;
        updates['users/' + uid + '/purchases/ai-masterclass-full'] = true;
      }

      db().ref().update(updates).then(function () { resolve(true); }).catch(reject);
    });
  }

  // Extracts downloadable resources (prompts, scripts, files) from a product
  function getCourseResources(product) {
    if (!product) return [];
    var resources = [];
    if (product.variants && product.variants.length) {
      product.variants.forEach(function (v) {
        var url = (v.downloadUrl || '').trim();
        if (url && url.indexOf('youtu') === -1) {
          resources.push({
            id: v.id || ('res_' + Math.random().toString(36).substr(2, 5)),
            name: v.name || 'Resource',
            downloadUrl: url,
            type: (v.name && v.name.toLowerCase().indexOf('prompt') !== -1) ? 'prompt' : 'file'
          });
        }
      });
    }
    var mainUrl = (product.downloadUrl || '').trim();
    if (mainUrl && mainUrl.indexOf('youtu') === -1) {
      var exists = resources.some(function(r) { return r.downloadUrl === mainUrl; });
      if (!exists) {
        resources.push({
          id: 'main_file',
          name: product.title + ' (Files & Prompts)',
          downloadUrl: mainUrl,
          type: 'file'
        });
      }
    }
    return resources;
  }

  // Splits purchased product objects into the three dashboard sections.
  function classifyPurchases(products, purchasedIds) {
    var owned = [];
    var ownedMap = {};

    (purchasedIds || []).forEach(function (pid) {
      var p = null;
      for (var i = 0; i < products.length; i++) {
        if (products[i] && products[i].id === pid) { p = products[i]; break; }
      }

      // If not top-level product, search inside product variants
      if (!p) {
        for (var i = 0; i < products.length; i++) {
          var parent = products[i];
          if (parent && parent.variants && parent.variants.length) {
            for (var j = 0; j < parent.variants.length; j++) {
              var v = parent.variants[j];
              if (v && (v.id === pid || (parent.id + '_' + v.id) === pid || (parent.id + '_' + (v.name || '').replace(/[^a-zA-Z0-9]/g, '')) === pid)) {
                p = {
                  id: pid,
                  title: v.name || parent.title,
                  type: 'digital',
                  category: (v.name && v.name.toLowerCase().indexOf('prompt') !== -1) ? 'prompt' : 'digital',
                  downloadUrl: v.downloadUrl || '',
                  emoji: (v.name && v.name.toLowerCase().indexOf('prompt') !== -1) ? '⚡' : '📄',
                  parentCourseId: parent.id,
                  parentCourseTitle: parent.title,
                  active: true
                };
                break;
              }
            }
          }
          if (p) break;
        }
      }

      if (p) {
        if (!ownedMap[p.id]) {
          ownedMap[p.id] = true;
          owned.push(p);
        }
      } else {
        if (!ownedMap[pid]) {
          ownedMap[pid] = true;
          owned.push({ id: pid, title: pid, type: 'digital', category: 'digital', emoji: '📦', active: false });
        }
      }
    });

    var courses = owned.filter(function (p) { return getProductType(p) === 'course'; });
    var ebooks = owned.filter(function (p) { return getProductType(p) === 'ebook'; });
    var digital = owned.filter(function (p) { return getProductType(p) === 'digital'; });

    // For any course owned, make sure its downloadable prompts/materials are readily available
    courses.forEach(function (c) {
      var res = getCourseResources(c);
      c.downloadableResources = res;
      res.forEach(function (r) {
        var resId = c.id + '_' + r.id;
        if (!ownedMap[r.id] && !ownedMap[resId]) {
          ownedMap[r.id] = true;
          digital.push({
            id: r.id,
            title: r.name,
            type: 'digital',
            category: r.type === 'prompt' ? 'prompt' : 'digital',
            downloadUrl: r.downloadUrl,
            emoji: r.type === 'prompt' ? '⚡' : '📄',
            parentCourseId: c.id,
            parentCourseTitle: c.title,
            isIncludedBonus: true,
            active: true
          });
        }
      });
    });

    return {
      courses: courses,
      ebooks: ebooks,
      digital: digital,
      all: owned
    };
  }

  // ── Timestamp helpers ──
  function parseTimestamp(value) {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return Math.max(0, Math.floor(value));
    var s = String(value).trim();
    if (!s) return 0;
    // Allow plain seconds input too
    if (/^\d{1,5}$/.test(s)) return parseInt(s, 10);
    var parts = s.split(':').map(function (p) { return parseInt(p, 10) || 0; });
    var sec = 0;
    for (var i = 0; i < parts.length; i++) sec = sec * 60 + parts[i];
    return Math.max(0, sec);
  }

  function formatTimestamp(seconds, withHours) {
    seconds = Math.max(0, Math.floor(seconds || 0));
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = seconds % 60;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    if (h > 0 || withHours) return pad(h) + ':' + pad(m) + ':' + pad(s);
    return m + ':' + pad(s);
  }

  // ── Curriculum (admin-controlled, stored in Firebase RTDB) ──
  // Node: curriculum/{productId} = { modules: [ { id, title, lessons: [ … ] } ], updatedAt }
  function curriculumRef(productId) {
    return db() ? db().ref('curriculum/' + productId) : null;
  }

  // Seeds a curriculum from the product's static data if the admin hasn't
  // saved one yet. Keeps the existing chapters as lessons so nothing breaks.
  function seedCurriculum(product) {
    if (!product) return [];
    if (product.modules && product.modules.length > 0) {
      return normalizeModules(JSON.parse(JSON.stringify(product.modules)));
    }
    var modules = [];
    var lessons = [];
    var chapters = product.chapters || [];

    if (chapters.length > 0) {
      // Ensure an "Introduction" at 00:00 when the first chapter doesn't start at 0
      if (chapters[0].time > 0) {
        lessons.push({ id: 'lesson-' + Date.now() + '-intro', title: 'Introduction', timestamp: 0, timeText: '00:00', description: 'Course introduction', duration: '', published: true });
      }
      chapters.forEach(function (ch, i) {
        var sec = parseInt(ch.time, 10);
        if (isNaN(sec) || sec < 0) sec = 0;
        lessons.push({
          id: 'lesson-' + Date.now() + '-' + i,
          title: String(ch.title || 'Lesson'),
          timestamp: sec,
          timeText: formatTimestamp(sec, true),
          description: '',
          duration: '',
          published: true
        });
      });
    } else if (product.curriculum && product.curriculum.length) {
      product.curriculum.forEach(function (item, i) {
        lessons.push({
          id: 'lesson-' + Date.now() + '-' + i,
          title: String(item).replace(/^[^\w]+/, ''),
          timestamp: 0,
          timeText: '00:00',
          description: '',
          duration: '',
          published: true
        });
      });
    }

    if (lessons.length) {
      modules.push({ id: 'module-' + Date.now() + '-0', title: product.title || 'Course Content', lessons: lessons });
    }
    return normalizeModules(modules);
  }

  // Loads curriculum for a course. Falls back to seeds from the product data.
  function getCurriculum(product) {
    return new Promise(function (resolve) {
      var pid = product && product.id;
      if (!pid || !db()) { resolve(seedCurriculum(product)); return; }
      curriculumRef(pid).once('value').then(function (snap) {
        var val = snap.val();
        if (val && Array.isArray(val.modules) && val.modules.length > 0) {
          resolve(normalizeModules(val.modules));
        } else {
          resolve(seedCurriculum(product));
        }
      }).catch(function () { resolve(seedCurriculum(product)); });
    });
  }

  function subscribeCurriculum(productId, cb) {
    if (!db() || !productId) return function () {};
    var ref = curriculumRef(productId);
    var handler = function (snap) {
      var val = snap.val();
      var modules = (val && Array.isArray(val.modules)) ? normalizeModules(val.modules) : [];
      cb(modules);
    };
    ref.on('value', handler);
    return function () { ref.off('value', handler); };
  }

  function normalizeModules(modules) {
    return (modules || []).map(function (m, mi) {
      return {
        id: m.id || ('module-' + mi),
        title: m.title || 'Module',
        lessons: (m.lessons || []).map(function (l, li) {
          var sec = parseTimestamp(l.timestamp);
          return {
            id: l.id || ('lesson-' + mi + '-' + li),
            title: l.title || 'Lesson',
            timestamp: sec,
            timeText: l.timeText || formatTimestamp(sec, true),
            description: l.description || '',
            duration: l.duration || '',
            published: l.published !== false
          };
        })
      };
    });
  }

  function saveCurriculum(productId, modules) {
    return new Promise(function (resolve, reject) {
      if (!db() || !productId) { resolve(false); return; }
      var payload = {
        modules: (modules || []).map(function (m) {
          return {
            id: m.id,
            title: m.title,
            lessons: (m.lessons || []).map(function (l) {
              return {
                id: l.id,
                title: l.title,
                timestamp: l.timestamp,
                timeText: l.timeText || formatTimestamp(l.timestamp, true),
                description: l.description || '',
                duration: l.duration || '',
                published: l.published === false ? false : true
              };
            })
          };
        }),
        updatedAt: new Date().toISOString()
      };
      curriculumRef(productId).set(payload).then(function () { resolve(true); }).catch(reject);
    });
  }

  // Flattens modules to a single lesson list (for progress math).
  function flattenLessons(modules) {
    var out = [];
    (modules || []).forEach(function (m) {
      (m.lessons || []).forEach(function (l) { out.push(l); });
    });
    return out;
  }

  // ── Progress ("Continue Learning") ──
  // Node: users/{uid}/courseProgress/{courseId}
  //       { lastLessonId, lastLessonTitle, lastTimestamp, updatedAt, completedLessons: { lessonId: true } }
  function progressRef(uid, courseId) {
    return db() ? db().ref('users/' + uid + '/courseProgress/' + courseId) : null;
  }

  function getProgress(uid, courseId) {
    return new Promise(function (resolve) {
      if (!uid || !db()) { resolve(null); return; }
      progressRef(uid, courseId).once('value').then(function (snap) {
        resolve(snap.val() || null);
      }).catch(function () { resolve(null); });
    });
  }

  function getProgressForUser(uid) {
    return new Promise(function (resolve) {
      if (!uid || !db()) { resolve({}); return; }
      db().ref('users/' + uid + '/courseProgress').once('value').then(function (snap) {
        resolve(snap.val() || {});
      }).catch(function () { resolve({}); });
    });
  }

  function saveProgress(uid, courseId, data) {
    if (!uid || !courseId || !db()) return Promise.resolve(false);
    var payload = {
      lastLessonId: data.lastLessonId || '',
      lastLessonTitle: data.lastLessonTitle || '',
      lastTimestamp: Math.max(0, Math.floor(data.lastTimestamp || 0)),
      completedLessons: data.completedLessons || {},
      updatedAt: new Date().toISOString()
    };
    return (progressRef(uid, courseId) && progressRef(uid, courseId).set(payload)) || Promise.resolve(false);
  }

  // Computes progress percent for a course from progress + its curriculum lessons.
  function computeProgressPercent(progress, curriculum) {
    if (!progress) return 0;
    var lessons = flattenLessons(curriculum).filter(function (l) { return l.published; });
    if (!lessons.length) return 0;
    var completed = 0;
    var done = progress.completedLessons || {};
    lessons.forEach(function (l) { if (done[l.id]) completed++; });
    return Math.round((completed / lessons.length) * 100);
  }

  // ── Public API ──
  return {
    uidOf: uidOf,
    getProductType: getProductType,
    getPurchases: getPurchases,
    getPurchasedIds: getPurchasedIds,
    isPurchased: isPurchased,
    recordPurchase: recordPurchase,
    classifyPurchases: classifyPurchases,
    parseTimestamp: parseTimestamp,
    formatTimestamp: formatTimestamp,
    getCurriculum: getCurriculum,
    subscribeCurriculum: subscribeCurriculum,
    saveCurriculum: saveCurriculum,
    seedCurriculum: seedCurriculum,
    normalizeModules: normalizeModules,
    flattenLessons: flattenLessons,
    getProgress: getProgress,
    getProgressForUser: getProgressForUser,
    saveProgress: saveProgress,
    computeProgressPercent: computeProgressPercent,
    getCourseResources: getCourseResources
  };
})();

if (typeof window !== 'undefined') window.UserSystem = UserSystem;