import re

file_path = r"c:\Users\basic\Documents\New folder\TheDeepVerse\course-detail.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

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

content = re.sub(r"// \D+SIMPLE PRODUCT \(no variants\)\D+.*?else \{", simple_new, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done editing simple product block.")
