/* ============================================================
   THEDEEPVERSE — AUTOMATIC YOUTUBE VIDEO FETCHER
   ============================================================
   Automatically loads latest videos from TheDeepVerse YouTube 
   channel via RSS feed. No API key needed. Updates every visit.
   
   Usage: Include this script in any page. Add elements with
   these IDs/classes:
   - #latestVideos .videos-grid → Homepage (6 videos)
   - #allVideosGrid → Videos page (all videos)
   - #latestShorts .shorts-grid → Homepage shorts
   ============================================================ */

(function() {
  'use strict';

  var CHANNEL_ID = 'UCndkEWkBoAVlMXbi--_2QjA';
  var RSS_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + CHANNEL_ID;
  var CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?'
  ];
  var CACHE_KEY = 'tdv_yt_videos';
  var CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes cache

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
      var updated = entry.querySelector('updated') ? entry.querySelector('updated').textContent : '';
      
      // Get media group info
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
        // Detect if it's a short (title patterns or very short description)
        var isShort = title.length < 100 && (
          title.toLowerCase().includes('#shorts') ||
          title.toLowerCase().includes('#short') ||
          (description && description.length < 50)
        );

        videos.push({
          id: videoId,
          title: title,
          published: published,
          updated: updated,
          description: description,
          thumbnail: thumbnail || 'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg',
          maxresThumbnail: 'https://i.ytimg.com/vi/' + videoId + '/maxresdefault.jpg',
          isShort: isShort,
          url: 'https://www.youtube.com/watch?v=' + videoId
        });
      }
    });

    return videos;
  }

  // ── Fetch with CORS proxy fallback ──
  function fetchRSS(callback) {
    // Check cache first
    try {
      var cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        var data = JSON.parse(cached);
        if (Date.now() - data.timestamp < CACHE_EXPIRY) {
          callback(data.videos);
          return;
        }
      }
    } catch (e) {}

    // Try each CORS proxy
    var proxyIndex = 0;

    function tryNextProxy() {
      if (proxyIndex >= CORS_PROXIES.length) {
        console.warn('[TheDeepVerse] All CORS proxies failed, using cache/fallback');
        // Try to use expired cache
        try {
          var cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            callback(JSON.parse(cached).videos);
            return;
          }
        } catch (e) {}
        callback([]);
        return;
      }

      var proxyUrl = CORS_PROXIES[proxyIndex] + encodeURIComponent(RSS_URL);
      proxyIndex++;

      fetch(proxyUrl)
        .then(function(response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          return response.text();
        })
        .then(function(xml) {
          var videos = parseRSS(xml);
          if (videos.length > 0) {
            // Cache the result
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify({
                videos: videos,
                timestamp: Date.now()
              }));
            } catch (e) {}
            callback(videos);
          } else {
            tryNextProxy();
          }
        })
        .catch(function() {
          tryNextProxy();
        });
    }

    tryNextProxy();
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
    return '<div class="video-card reveal" data-videoid="' + video.id + '" id="videoCard' + (index + 1) + '">' +
      '<div class="video-card__thumbnail">' +
        '<img src="' + video.thumbnail + '" ' +
          'alt="' + video.title.replace(/"/g, '&quot;') + '" ' +
          'loading="lazy" ' +
          'onerror="this.src=\'https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg\'" ' +
          'style="width:100%;height:100%;object-fit:cover;">' +
        '<a href="' + video.url + '" target="_blank" rel="noopener noreferrer" ' +
          'class="video-card__play" aria-label="Play: ' + video.title.replace(/"/g, '&quot;') + '">' +
          '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>' +
        '</a>' +
      '</div>' +
      '<div class="video-card__body">' +
        '<h3 class="video-card__title">' + video.title + '</h3>' +
        '<div class="video-card__meta">' +
          '<span>TheDeepVerse</span>' +
          '<span>' + formatDate(video.published) + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // ── Create Short Card HTML ──
  function createShortCard(video, index) {
    return '<div class="short-card reveal" id="shortCard' + (index + 1) + '">' +
      '<a href="' + video.url + '" target="_blank" rel="noopener noreferrer" class="short-card__link">' +
        '<div class="short-card__thumbnail" style="background-image:url(' + video.thumbnail + ');background-size:cover;background-position:center;">' +
          '<div class="short-card__play">&#9654;</div>' +
          (index === 0 ? '<div class="short-card__badge">NEW</div>' : '') +
        '</div>' +
        '<p class="short-card__title">' + (video.title.length > 40 ? video.title.substring(0, 40) + '...' : video.title) + '</p>' +
      '</a>' +
    '</div>';
  }

  // ── Render Videos on Homepage ──
  function renderHomepageVideos(videos) {
    var regularVideos = videos.filter(function(v) { return !v.isShort; });
    
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

    // Homepage shorts (max 4)
    var shortsGrid = document.querySelector('#latestShorts .shorts-grid');
    var shorts = videos.filter(function(v) { return v.isShort; });
    if (shortsGrid && shorts.length > 0) {
      var shortsHtml = '';
      var shortsCount = Math.min(shorts.length, 4);
      for (var j = 0; j < shortsCount; j++) {
        shortsHtml += createShortCard(shorts[j], j);
      }
      shortsGrid.innerHTML = shortsHtml;
    }
  }

  // ── Render All Videos on Videos Page ──
  function renderVideosPage(videos) {
    var allVideosGrid = document.getElementById('allVideosGrid');
    if (!allVideosGrid) return;

    var regularVideos = videos.filter(function(v) { return !v.isShort; });
    if (regularVideos.length > 0) {
      var html = '';
      for (var i = 0; i < regularVideos.length; i++) {
        html += createVideoCard(regularVideos[i], i);
      }
      allVideosGrid.innerHTML = html;
    }
  }

  // ── Render Shorts Page ──
  function renderShortsPage(videos) {
    var shortsGrid = document.querySelector('.shorts-page-grid');
    if (!shortsGrid) return;

    var shorts = videos.filter(function(v) { return v.isShort; });
    if (shorts.length > 0) {
      var html = '';
      for (var i = 0; i < shorts.length; i++) {
        html += createShortCard(shorts[i], i);
      }
      shortsGrid.innerHTML = html;
    }
  }

  // ── Initialize ──
  function init() {
    fetchRSS(function(videos) {
      if (videos.length === 0) {
        console.log('[TheDeepVerse] No videos loaded from RSS feed');
        return;
      }

      console.log('[TheDeepVerse] Loaded ' + videos.length + ' videos from YouTube RSS');

      // Render based on current page
      renderHomepageVideos(videos);
      renderVideosPage(videos);
      renderShortsPage(videos);
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for admin use
  window.TheDeepVerse = window.TheDeepVerse || {};
  window.TheDeepVerse.refreshVideos = function() {
    localStorage.removeItem(CACHE_KEY);
    init();
  };

})();
