import os
import re

file_path = r"c:\Users\basic\Documents\New folder\TheDeepVerse\course-detail.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Geo script
geo_code = """  <script src="https://www.paypal.com/sdk/js?client-id=BAArKqbNWhZR0TiQkI_tP&currency=USD" data-sdk-integration-source="button-factory"></script>
  <!-- VERIFY: Full PayPal Client ID needed -->

  <script>
  (function() {
    'use strict';

    // Geo-detection for payment method
    var userCountry = 'IN'; // Default to India
    var geoDetected = false;
    (function detectCountry() {
      try {
        fetch('https://ipapi.co/country_code/', { mode: 'cors' })
          .then(function(r) { return r.text(); })
          .then(function(code) {
            code = (code || '').trim().toUpperCase();
            if (code.length === 2) { userCountry = code; geoDetected = true; }
            // Re-render sidebar if product already loaded
            if (currentProduct) renderHero(currentProduct);
          })
          .catch(function() { userCountry = 'IN'; });
      } catch(e) { userCountry = 'IN'; }
    })();

    function isIndianUser() { return userCountry === 'IN'; }"""
content = content.replace("  <script>\n  (function() {\n    'use strict';", geo_code)

# 2. Variants loop
variant_old = re.search(r"// Each variant as its own section.*?}\);", content, re.DOTALL)
if variant_old:
    variant_new = """// Each variant as its own section
        p.variants.forEach(function(v, i) {
          sidebarHtml += '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;display:flex;align-items:center;justify-content:space-between;gap:12px">';
          sidebarHtml += '<div><div style="font-weight:700;font-size:0.95rem;color:var(--text-primary)">' + (v.name || 'Edition ' + (i+1)) + '</div></div>';
          if (isIndianUser()) {
            sidebarHtml += '<div style="text-align:right"><div style="font-size:1.1rem;font-weight:800;color:var(--accent)">₹' + v.price + '</div>';
            if (v.originalPrice && v.originalPrice > v.price) sidebarHtml += '<div style="font-size:0.8rem;text-decoration:line-through;color:var(--text-muted)">₹' + v.originalPrice + '</div>';
            sidebarHtml += '</div></div>';
            sidebarHtml += '<a href="#" onclick="event.preventDefault(); buyEdition(' + i + ')" style="flex-shrink:0;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:700;padding:10px 16px;border-radius:8px;text-decoration:none;font-size:0.85rem;box-shadow:0 4px 15px rgba(34,197,94,0.3)">🛒 Buy — ₹' + v.price + '</a>';
          } else {
            var vUsd = v.priceUSD || 2;
            sidebarHtml += '<div style="text-align:right"><div style="font-size:1.1rem;font-weight:800;color:var(--accent)">$' + vUsd + '</div></div></div>';
            sidebarHtml += '<div id="paypal-button-variant-' + i + '" style="margin-top:8px"></div>';
          }
          if (isIndianUser()) sidebarHtml += '</div>';
        });"""
    content = content.replace(variant_old.group(0), variant_new)
else:
    print("Could not find variant_old")

# 3. Combo deal
combo_old = re.search(r"// Combo Deal Section.*?sidebarHtml \+= '</div>';\n\s*}", content, re.DOTALL)
if combo_old:
    combo_new = """// Combo Deal Section
        if (p.comboPrice && p.variants.length >= 2) {
          var comboLabel = p.variants.length === 2 ? 'Combo — Both' : 'Combo — All ' + p.variants.length;
          var comboDesc = p.variants.map(function(v) { return v.name; }).join(' + ');
          sidebarHtml += '<div style="background:linear-gradient(135deg,rgba(212,175,55,0.08),rgba(212,175,55,0.02));border:2px solid rgba(212,175,55,0.3);border-radius:12px;padding:16px;margin-bottom:12px;position:relative">';
          sidebarHtml += '<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:var(--accent);color:#000;padding:2px 12px;border-radius:10px;font-size:0.7rem;font-weight:700;letter-spacing:0.5px">🔥 BEST DEAL</div>';
          sidebarHtml += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;margin-top:4px">';
          sidebarHtml += '<div><div style="font-weight:700;font-size:1rem;color:var(--text-primary)">📦 ' + comboLabel + '</div>';
          sidebarHtml += '<div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px">' + comboDesc + '</div></div>';
          if (isIndianUser()) {
            sidebarHtml += '<div style="text-align:right"><div style="font-size:1.2rem;font-weight:800;color:var(--accent)">₹' + p.comboPrice + '</div>';
            if (p.comboOriginalPrice && p.comboOriginalPrice > p.comboPrice) {
              var savePct = Math.round((1 - p.comboPrice / p.comboOriginalPrice) * 100);
              sidebarHtml += '<div style="font-size:0.8rem;text-decoration:line-through;color:var(--text-muted)">₹' + p.comboOriginalPrice + '</div>';
            }
            sidebarHtml += '</div></div>';
            sidebarHtml += '<a href="#" class="purchase-card__buy" onclick="event.preventDefault(); buyCombo()" style="display:block;text-align:center;background:linear-gradient(135deg,#d4af37,#b8962e);color:#000;font-weight:800;padding:12px;border-radius:8px;text-decoration:none;font-size:0.95rem;box-shadow:0 4px 15px rgba(212,175,55,0.4);transition:all 0.2s">🛒 Buy ' + comboLabel + ' — ₹' + p.comboPrice + (savePct ? ' (Save ' + savePct + '%)' : '') + '</a>';
          } else {
            var cUsd = p.comboPriceUSD || 3;
            var cOriginal = p.comboPriceOriginalUSD || 5;
            sidebarHtml += '<div style="text-align:right"><div style="font-size:1.2rem;font-weight:800;color:var(--accent)">$' + cUsd + '</div>';
            if (cOriginal > cUsd) {
              sidebarHtml += '<div style="font-size:0.8rem;text-decoration:line-through;color:var(--text-muted)">$' + cOriginal + '</div>';
            }
            sidebarHtml += '</div></div>';
            sidebarHtml += '<div id="paypal-button-combo" style="margin-top:12px"></div>';
          }
          sidebarHtml += '</div>';
        }"""
    content = content.replace(combo_old.group(0), combo_new)
else:
    print("Could not find combo_old")

# 4. Simple product
simple_old = re.search(r"// ── SIMPLE PRODUCT \(no variants\) ──.*?} else {", content, re.DOTALL)
if simple_old:
    simple_new = """// ── SIMPLE PRODUCT (no variants) ──
        if (isIndianUser()) {
          var priceH = p.price === 0
            ? '<span class="purchase-card__price-free">Free</span>'
            : '<span class="purchase-card__price-current">₹' + p.price.toLocaleString('en-IN') + '</span>' +
              (p.originalPrice ? '<span class="purchase-card__price-original">₹' + p.originalPrice.toLocaleString('en-IN') + '</span>' : '');
          sidebarHtml += '<div class="purchase-card__price">' + priceH + '</div>';
          if (discount) sidebarHtml += '<div class="purchase-card__discount">🔥 ' + discount + '</div>';
          if (p.price === 0) {
            sidebarHtml += '<a href="#" class="purchase-card__buy purchase-card__buy--free" onclick="event.preventDefault(); buySimple()">🎁 Download Free</a>';
          } else {
            sidebarHtml += '<a href="#" class="purchase-card__buy" onclick="event.preventDefault(); buySimple()" style="background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:700;box-shadow:0 4px 20px rgba(34,197,94,0.4)">🛒 Buy Now — ₹' + p.price.toLocaleString('en-IN') + '</a>';
          }
          sidebarHtml += '<div class="purchase-card__guarantee" style="margin-top:8px;font-size:0.7rem;color:var(--text-muted);text-align:center">🇮🇳 Paying from India via Razorpay</div>';
        } else {
          // International user — PayPal
          var usdPrice = p.priceUSD || 3;
          var usdOriginal = p.originalPriceUSD || 0;
          var priceH = '<span class="purchase-card__price-current">$' + usdPrice + '</span>' +
            (usdOriginal > usdPrice ? '<span class="purchase-card__price-original">$' + usdOriginal + '</span>' : '');
          sidebarHtml += '<div class="purchase-card__price">' + priceH + '</div>';
          if (discount) sidebarHtml += '<div class="purchase-card__discount">🔥 ' + discount + '</div>';
          sidebarHtml += '<div id="paypal-button-simple" style="margin-top:12px"></div>';
          sidebarHtml += '<div class="purchase-card__guarantee" style="margin-top:8px;font-size:0.7rem;color:var(--text-muted);text-align:center">🌍 International Payment via PayPal</div>';
        }
      } else {"""
    content = content.replace(simple_old.group(0), simple_new)
else:
    print("Could not find simple_old")

# 5. Guarantee text
guarantee_old = re.search(r"sidebarHtml \+= '<div class=\"purchase-card__guarantee\">.*?</div>';", content)
if guarantee_old:
    guarantee_new = """sidebarHtml += '<div class="purchase-card__guarantee"><span class="purchase-card__guarantee-icon">🔒</span>' + (isLive ? (isIndianUser() ? 'Secure payment via Razorpay. Instant access after purchase.' : 'Secure payment via PayPal. Instant access after purchase.') : 'This product is launching soon. Stay tuned!') + '</div>';"""
    content = content.replace(guarantee_old.group(0), guarantee_new)
else:
    print("Could not find guarantee_old")

# 6. Init PayPal Buttons + Call it
init_paypal_code = """
    // Initialize PayPal buttons for international users
    setTimeout(function() { initPayPalButtons(); }, 100);
"""

# replace `document.getElementById('heroSidebar').innerHTML = sidebarHtml;`
sidebar_inner_old = "document.getElementById('heroSidebar').innerHTML = sidebarHtml;"
if sidebar_inner_old in content:
    content = content.replace(sidebar_inner_old, sidebar_inner_old + init_paypal_code)
else:
    print("Could not find sidebar_inner_old")

paypal_func = """
    function initPayPalButtons() {
      if (isIndianUser() || typeof paypal === 'undefined' || !currentProduct) return;

      var p = currentProduct;
      var isVideoCourse = p.type === 'video-course';

      // Simple product PayPal button
      var simpleContainer = document.getElementById('paypal-button-simple');
      if (simpleContainer) {
        paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 45 },
          createOrder: function(data, actions) {
            return actions.order.create({
              purchase_units: [{
                description: p.title,
                amount: { value: String(p.priceUSD || 3), currency_code: 'USD' }
              }]
            });
          },
          onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
              if (isVideoCourse) {
                savePurchaseToFirebase(p.id, 'PAYPAL-' + details.id);
              } else {
                var dlUrl = p.downloadUrl || '';
                if (dlUrl) {
                  showDownloadSection('PAYPAL-' + details.id, p.title, [dlUrl]);
                } else {
                  alert('Payment successful! ID: PAYPAL-' + details.id);
                }
              }
            });
          },
          onError: function(err) {
            console.error('PayPal error:', err);
            alert('Payment failed. Please try again.');
          }
        }).render('#paypal-button-simple');
      }

      // Variant PayPal buttons
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach(function(v, i) {
          var containerId = 'paypal-button-variant-' + i;
          var container = document.getElementById(containerId);
          if (container) {
            paypal.Buttons({
              style: { layout: 'horizontal', color: 'gold', shape: 'rect', label: 'pay', height: 35 },
              createOrder: function(data, actions) {
                return actions.order.create({
                  purchase_units: [{
                    description: v.name || p.title,
                    amount: { value: String(v.priceUSD || 2), currency_code: 'USD' }
                  }]
                });
              },
              onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                  var dlUrl = v.downloadUrl || '';
                  if (dlUrl) {
                    showDownloadSection('PAYPAL-' + details.id, v.name || p.title, [dlUrl]);
                  } else {
                    alert('Payment successful! ID: PAYPAL-' + details.id);
                  }
                });
              },
              onError: function(err) {
                console.error('PayPal error:', err);
                alert('Payment failed. Please try again.');
              }
            }).render('#' + containerId);
          }
        });

        // Combo PayPal button
        var comboContainer = document.getElementById('paypal-button-combo');
        if (comboContainer) {
          paypal.Buttons({
            style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 45 },
            createOrder: function(data, actions) {
              return actions.order.create({
                purchase_units: [{
                  description: p.title + ' — Combo',
                  amount: { value: String(p.comboPriceUSD || 3), currency_code: 'USD' }
                }]
              });
            },
            onApprove: function(data, actions) {
              return actions.order.capture().then(function(details) {
                var allUrls = p.variants.map(function(v) { return v.downloadUrl; }).filter(Boolean);
                if (allUrls.length > 0) {
                  showDownloadSection('PAYPAL-' + details.id, p.title + ' — Combo', allUrls);
                } else {
                  alert('Payment successful! ID: PAYPAL-' + details.id);
                }
              });
            },
            onError: function(err) {
              console.error('PayPal error:', err);
              alert('Payment failed. Please try again.');
            }
          }).render('#paypal-button-combo');
        }
      }
    }
"""

content = content.replace("    // ── Render Content Sections ──", paypal_func + "\n    // ── Render Content Sections ──")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
