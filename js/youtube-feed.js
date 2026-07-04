/* ============================================================
   THEDEEPVERSE — YOUTUBE VIDEO & SHORTS LOADER
   ============================================================
   Shows videos & shorts from TheDeepVerse YouTube channel.
   - Hardcoded fallback videos & shorts ALWAYS show instantly
   - RSS feed tried in background for fresh updates
   - If RSS works, cache + show new videos
   - If RSS fails, fallback videos still visible
   ============================================================ */

(function() {
  'use strict';

  var CHANNEL_ID = 'UCndkEWkBoAVlMXbi--_2QjA';
  var RSS_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + CHANNEL_ID;
  var CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
  ];
  var CACHE_KEY = 'tdv_yt_videos';
  var CACHE_EXPIRY = 30 * 60 * 1000;

  // ── FALLBACK VIDEOS (always available) ──
  var FALLBACK_VIDEOS = [
    // ── Shorts ──
    { id: 'iPz96kxqhcI', title: 'You Think It\'s Love... But You\'re Slowly Killing Them. #shorts', published: '2026-07-01T10:12:20Z', isShort: true },
    { id: 'xK43iBwzr6k', title: 'The Darkest Psychology Trick Ever #shorts', published: '2026-06-28T08:00:00Z', isShort: true },
    { id: 'E-9hmCi4PTo', title: 'Never Trust Someone Who Does This #shorts', published: '2026-06-25T08:00:00Z', isShort: true },
    { id: 'tnpOQIu3W8E', title: 'Your Brain Is Lying To You Right Now #shorts', published: '2026-06-22T08:00:00Z', isShort: true },
    { id: 'Cv4v2QND490', title: '3 Signs You Are Being Manipulated #shorts', published: '2026-06-20T08:00:00Z', isShort: true },
    // ── Regular Videos ──
    { id: 'Tgbay2J7bZk', title: '💰 पैसा आपका जुनून क्यों छीन लेता है? | Deci Effect Psychology', published: '2026-06-30T15:10:36Z', isShort: false },
    { id: 'IqVC343UJY8', title: 'Why Good People Become Evil? | Moral Disengagement Explained', published: '2026-06-29T16:03:43Z', isShort: false },
    { id: 'xK43iBwzr6k', title: '5 Psychology Truths That Are Secretly Destroying Your Life', published: '2025-06-01T00:00:00Z', isShort: false },
    { id: 'E-9hmCi4PTo', title: 'Escape These 4 Mental Traps Before It\'s Too Late', published: '2025-05-10T00:00:00Z', isShort: false },
    { id: 'tnpOQIu3W8E', title: '3 Psychology Stories That Will Change The Way You See People', published: '2025-05-03T00:00:00Z', isShort: false },
    { id: 'Cv4v2QND490', title: '10 Mental Traps Jo Aapki Life Barbaad Kar Rahe Hain', published: '2025-04-25T00:00:00Z', isShort: false }
  ];

  // Add thumbnail URLs to fallback
  FALLBACK_VIDEOS.forEach(function(v) {
    v.thumbnail = 'https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg';
    v.maxresThumbnail = 'https://i.ytimg.com/vi/' + v.id + '/maxresdefault.jpg';
    v.url = v.isShort ? 'https://www.youtube.com/shorts/' + v.id : 'https://www.youtube.com/watch?v=' + v.id;
    v.description = '';
  });

  // ── Parse YouTube RSS XML ──
  function parseRSS(xml) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(xml, 'text/xml');
    var entries = doc.querySelectorAll('entry');
    var videos = [];

    entries.forEach(function(entry) {
      var videoId = '';
      var vidIdEl = entry.querySelector('videoId');
      if (vidIdEl) {
        videoId = vidIdEl.textContent;
      } else {
        var link = entry.querySelector('link');
        if (link) {
          var href = link.getAttribute('href') || '';
          var match = href.match(/v=([^&]+)/);
          if (match) videoId = match[1];
        }
      }

      var title = entry.querySelector('title') ? entry.querySelector('title').textContent : '';
      var published = entry.querySelector('published') ? entry.querySelector('published').textContent : '';

      var mediaGroup = entry.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'group')[0];
      var description = '';
      var thumbnail = '';

      if (mediaGroup) {
        var descEl = mediaGroup.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'description')[0];
        if (descEl) description = descEl.textContent;
        var thumbEl = mediaGroup.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')[0];
        if (thumbEl) thumbnail = thumbEl.getAttribute('url');
      }

      if (videoId) {
        var isShort = title.toLowerCase().includes('#shorts') || title.toLowerCase().includes('#short');

        videos.push({
          id: videoId,
          title: title,
          published: published,
          description: description,
          thumbnail: thumbnail || 'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg',
          maxresThumbnail: 'https://i.ytimg.com/vi/' + videoId + '/maxresdefault.jpg',
          isShort: isShort,
          url: isShort ? 'https://www.youtube.com/shorts/' + videoId : 'https://www.youtube.com/watch?v=' + videoId
        });
      }
    });

    return videos;
  }

  // ── Format date ──
  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    var now = new Date();
    var diff = now - d;
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return days + ' days ago';
    if (days < 30) return Math.floor(days / 7) + ' weeks ago';
    if (days < 365) return Math.floor(days / 30) + ' months ago';
    return Math.floor(days / 365) + ' years ago';
  }

  // ── Create Video Card HTML ──
  function createVideoCard(video, index) {
    return '<a href="' + video.url + '" target="_blank" rel="noopener noreferrer" class="video-card reveal" data-videoid="' + video.id + '" id="videoCard' + (index + 1) + '" style="text-decoration:none;color:inherit;display:block;">' +
      '<div class="video-card__thumbnail">' +
        '<img src="' + video.thumbnail + '" ' +
          'alt="' + video.title.replace(/"/g, '&quot;') + '" ' +
          'loading="lazy" ' +
          'onerror="this.src=\'https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg\'" ' +
          'style="width:100%;height:100%;object-fit:cover;">' +
        '<div class="video-card__play">' +
          '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>' +
        '</div>' +
      '</div>' +
      '<div class="video-card__body">' +
        '<h3 class="video-card__title">' + video.title + '</h3>' +
        '<div class="video-card__meta">' +
          '<span>TheDeepVerse</span>' +
          '<span>' + formatDate(video.published) + '</span>' +
        '</div>' +
      '</div>' +
    '</a>';
  }

  // ── Create Short Card HTML ──
  function createShortCard(video, index, isFirst) {
    var cleanTitle = video.title.replace(/#\w+/g, '').replace(/\s+/g, ' ').trim();
    if (cleanTitle.length > 60) cleanTitle = cleanTitle.substring(0, 57) + '...';

    return '<a href="' + video.url + '" target="_blank" rel="noopener noreferrer" class="short-card reveal" id="shortCard' + (index + 1) + '" style="text-decoration:none;color:inherit;">' +
      '<div class="short-card__thumbnail" style="background-image:url(https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg);background-size:cover;background-position:center;">' +
        '<div class="short-card__play">&#9654;</div>' +
        (isFirst ? '<div class="short-card__badge">NEW</div>' : '') +
      '</div>' +
      '<p class="short-card__title">' + cleanTitle + '</p>' +
    '</a>';
  }

  // ── Render Videos & Shorts ──
  function renderVideos(videos) {
    var regularVideos = videos.filter(function(v) { return !v.isShort; });
    var shortVideos = videos.filter(function(v) { return v.isShort; });

    // Homepage latest videos (max 6)
    var videosGrid = document.querySelector('#latestVideos .videos-grid');
    if (videosGrid && regularVideos.length > 0) {
      var html = '';
      var count = Math.min(regularVideos.length, 6);
      for (var i = 0; i < count; i++) {
        html += createVideoCard(regularVideos[i], i);
      }
      videosGrid.innerHTML = html;
    }

    // Videos page (all videos)
    var allVideosGrid = document.getElementById('allVideosGrid');
    if (allVideosGrid && regularVideos.length > 0) {
      var allHtml = '';
      for (var j = 0; j < regularVideos.length; j++) {
        allHtml += createVideoCard(regularVideos[j], j);
      }
      allVideosGrid.innerHTML = allHtml;
    }

    // Homepage shorts section
    var homeShortsGrid = document.querySelector('#latestShorts .shorts-grid');
    if (homeShortsGrid && shortVideos.length > 0) {
      var shortsHtml = '';
      var shortsCount = Math.min(shortVideos.length, 4);
      for (var s = 0; s < shortsCount; s++) {
        shortsHtml += createShortCard(shortVideos[s], s, s === 0);
      }
      homeShortsGrid.innerHTML = shortsHtml;
    }

    // Shorts page grid
    var shortPageGrid = document.querySelector('.shorts-page-grid');
    if (shortPageGrid && shortVideos.length > 0) {
      var spHtml = '';
      for (var sp = 0; sp < shortVideos.length; sp++) {
        spHtml += createShortCard(shortVideos[sp], sp, sp === 0);
      }
      shortPageGrid.innerHTML = spHtml;
    }
  }

  // ── Try RSS feed with CORS proxies ──
  function tryRSSFeed(callback) {
    // Check cache first
    try {
      var cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        var data = JSON.parse(cached);
        if (Date.now() - data.timestamp < CACHE_EXPIRY && data.videos && data.videos.length > 0) {
          callback(data.videos);
          return;
        }
      }
    } catch (e) {}

    var proxyIndex = 0;
    function tryNext() {
      if (proxyIndex >= CORS_PROXIES.length) {
        callback(null); // All failed
        return;
      }
      var proxyUrl = CORS_PROXIES[proxyIndex] + encodeURIComponent(RSS_URL);
      proxyIndex++;

      fetch(proxyUrl, { signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined })
        .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
        .then(function(xml) {
          var videos = parseRSS(xml);
          if (videos.length > 0) {
            try { localStorage.setItem(CACHE_KEY, JSON.stringify({ videos: videos, timestamp: Date.now() })); } catch(e) {}
            callback(videos);
          } else { tryNext(); }
        })
        .catch(function() { tryNext(); });
    }
    tryNext();
  }

  // ── Initialize ──
  function init() {
    // Step 1: IMMEDIATELY show fallback videos & shorts (no waiting)
    renderVideos(FALLBACK_VIDEOS);
    console.log('[TheDeepVerse] Fallback videos & shorts loaded instantly');

    // Step 2: Try RSS in background for fresh data
    tryRSSFeed(function(freshVideos) {
      if (freshVideos && freshVideos.length > 0) {
        renderVideos(freshVideos);
        console.log('[TheDeepVerse] Updated with ' + freshVideos.length + ' fresh videos from YouTube RSS');
      } else {
        console.log('[TheDeepVerse] RSS unavailable, using fallback videos');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.TheDeepVerse = window.TheDeepVerse || {};
  window.TheDeepVerse.refreshVideos = function() {
    localStorage.removeItem(CACHE_KEY);
    init();
  };

})();
