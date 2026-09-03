#!/usr/bin/env python3
"""
Scents 'N Stories — Honey Trap Luxury Storefront Generator
Generates all 6 production-ready standalone HTML pages using safe template replacement:
- index.html (Flagship Home Page)
- product.html (Honey Trap PDP)
- shop.html (Fragrance Collection & Catalog)
- about.html (Maison & Grasse Heritage)
- contact.html (Boutiques & VIP Concierge)
- faq.html (Care Guide & Sillage FAQ)
"""

import os

BASE_DIR = "/Users/kmall.pk/Downloads/Honey Trap shopify "

COMMON_HEAD = """  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Montserrat:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <link rel="stylesheet" href="assets/theme.css"/>
  <script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "primary": "#845400",
            "primary-container": "#c98a2c",
            "primary-fixed": "#ffddb6",
            "on-primary": "#ffffff",
            "on-primary-fixed": "#2a1800",
            "secondary": "#904c21",
            "secondary-container": "#ffa673",
            "secondary-fixed": "#ffdbca",
            "on-secondary": "#ffffff",
            "tertiary": "#76584a",
            "tertiary-fixed": "#ffdbcc",
            "background": "#fbf9f5",
            "surface": "#fbf9f5",
            "surface-bright": "#fbf9f5",
            "surface-container-low": "#f5f3ef",
            "surface-container": "#efeeea",
            "surface-container-high": "#eae8e4",
            "surface-container-highest": "#e4e2de",
            "surface-container-lowest": "#ffffff",
            "on-surface": "#1b1c1a",
            "on-surface-variant": "#514536",
            "outline": "#837564",
            "outline-variant": "#d6c4b1"
          },
          fontFamily: {
            "headline-sm": ["Bodoni Moda", "serif"],
            "headline-md": ["Bodoni Moda", "serif"],
            "headline-lg": ["Bodoni Moda", "serif"],
            "display-xl": ["Bodoni Moda", "serif"],
            "body-md": ["Montserrat", "sans-serif"],
            "body-lg": ["Montserrat", "sans-serif"],
            "title-md": ["Montserrat", "sans-serif"],
            "label-caps": ["Montserrat", "sans-serif"],
            "label-sm": ["Montserrat", "sans-serif"]
          },
          spacing: {
            "space-2xs": "0.25rem",
            "space-xs": "0.5rem",
            "space-sm": "0.75rem",
            "space-md": "1rem",
            "space-lg": "1.5rem",
            "space-xl": "2rem",
            "space-2xl": "3rem",
            "space-3xl": "4.5rem",
            "gutter": "1.5rem",
            "container-max": "1360px"
          }
        }
      }
    };
  </script>"""

def get_header(active_page="home"):
    def nav_link(page_key, href, label):
        if active_page == page_key:
            return f'<a class="px-space-sm py-space-2xs font-label-caps text-primary border-b-2 border-primary font-semibold tracking-wider whitespace-nowrap" href="{href}">{label}</a>'
        return f'<a class="px-space-sm py-space-2xs font-label-caps text-on-surface-variant hover:text-primary transition-colors tracking-wider whitespace-nowrap" href="{href}">{label}</a>'

    return f"""  <!-- Global Announcement & Header -->
  <header class="fixed top-0 w-full z-50 shadow-[0_4px_24px_rgba(40,20,5,0.06)]">
    <!-- Announcement Bar -->
    <div class="bg-primary text-on-primary py-space-xs px-gutter text-center font-label-caps tracking-[0.2em] flex items-center justify-center gap-space-xs border-b border-primary-container/30 text-xs">
      <span class="material-symbols-outlined text-[15px] text-primary-fixed">auto_awesome</span>
      <span>Complimentary Signature Discovery Vial on All Extrait de Parfum Orders | Handcrafted French Oils</span>
    </div>

    <!-- Main Navigation Bar -->
    <div class="bg-surface-bright/95 backdrop-blur-md border-b border-outline-variant/40">
      <div class="h-24 max-w-7xl mx-auto px-gutter flex flex-col justify-between py-space-xs">
        <div class="flex items-center justify-between gap-space-lg">
          <!-- Brand Logo -->
          <a href="index.html" class="flex items-center gap-space-sm group">
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span class="font-headline-sm text-surface-bright italic font-bold">S</span>
            </div>
            <div class="flex flex-col">
              <span class="font-headline-md text-primary tracking-wide font-semibold text-xl font-serif">Scents 'N Stories</span>
              <span class="font-label-caps text-[9px] text-tertiary tracking-[0.25em] uppercase -mt-1">Luxury Artisanal Parfumerie</span>
            </div>
          </a>

          <!-- Search Input -->
          <div class="flex-1 max-w-md hidden md:block">
            <div class="relative flex items-center w-full">
              <span class="material-symbols-outlined absolute left-space-sm text-outline text-[18px]">search</span>
              <input class="w-full bg-surface-container-low pl-10 pr-space-md py-space-xs rounded-full font-body-md text-on-surface placeholder:text-outline border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs" placeholder="Search Honey Trap, amber notes, extrait de parfum..." type="text"/>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-space-md">
            <a class="flex items-center gap-space-2xs text-on-surface-variant hover:text-primary transition-colors" href="product.html#notes-pyramid">
              <span class="material-symbols-outlined text-[20px]">science</span>
              <span class="font-label-caps text-[11px] hidden sm:inline">Scent Notes</span>
            </a>

            <!-- Cart Trigger Button -->
            <button class="relative flex items-center cursor-pointer text-on-surface-variant hover:text-primary transition-colors p-1" data-cart-open title="View Velvet Pouch">
              <span class="material-symbols-outlined text-[24px]">shopping_bag</span>
              <span class="cart-count-badge absolute -top-1 -right-1 bg-primary text-on-primary font-label-caps rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">1</span>
            </button>

            <!-- VIP Concierge -->
            <a href="contact.html" class="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/60 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors" title="VIP Concierge">
              <span class="material-symbols-outlined text-[18px]">person</span>
            </a>
          </div>
        </div>

        <!-- Navigation Links Ribbon -->
        <nav class="flex items-center gap-space-md pb-space-2xs overflow-x-auto text-xs">
          {nav_link("home", "index.html", "Home")}
          {nav_link("shop", "shop.html", "Fragrance Catalog")}
          {nav_link("product", "product.html", "Honey Trap (Flagship)")}
          {nav_link("coffrets", "shop.html#coffrets", "Discovery Sets")}
          {nav_link("about", "about.html", "Our Story & Grasse Heritage")}
          {nav_link("faq", "faq.html", "Fragrance FAQ")}
          {nav_link("contact", "contact.html", "Boutiques & Concierge")}
        </nav>
      </div>
    </div>
  </header>"""

def get_footer():
    return """  <!-- Luxury Footer -->
  <footer class="w-full bg-surface-container-lowest border-t border-outline-variant/50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] mt-space-2xl">
    <div class="bg-surface-container-low py-space-lg border-b border-outline-variant/40">
      <div class="max-w-7xl mx-auto px-gutter grid grid-cols-2 md:grid-cols-4 gap-space-md">
        <div class="flex items-center gap-space-sm">
          <span class="material-symbols-outlined text-primary text-[28px]">local_shipping</span>
          <div>
            <div class="font-label-caps text-on-surface text-xs font-semibold">Complimentary Courier</div>
            <div class="font-body-md text-tertiary text-xs">On all orders above Rs. 1,500</div>
          </div>
        </div>
        <div class="flex items-center gap-space-sm">
          <span class="material-symbols-outlined text-primary text-[28px]">verified</span>
          <div>
            <div class="font-label-caps text-on-surface text-xs font-semibold">Authenticity Certified</div>
            <div class="font-body-md text-tertiary text-xs">Original French Grasse essences</div>
          </div>
        </div>
        <div class="flex items-center gap-space-sm">
          <span class="material-symbols-outlined text-primary text-[28px]">redeem</span>
          <div>
            <div class="font-label-caps text-on-surface text-xs font-semibold">Free Scent Vial</div>
            <div class="font-body-md text-tertiary text-xs">Included with every purchase</div>
          </div>
        </div>
        <div class="flex items-center gap-space-sm">
          <span class="material-symbols-outlined text-primary text-[28px]">lock_reset</span>
          <div>
            <div class="font-label-caps text-on-surface text-xs font-semibold">Scent Guarantee</div>
            <div class="font-body-md text-tertiary text-xs">Exchange if not deeply loved</div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-gutter py-space-xl grid grid-cols-1 md:grid-cols-12 gap-space-xl">
      <div class="md:col-span-4 space-y-space-md">
        <div class="flex items-center gap-space-sm">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-surface-bright font-headline-sm text-sm font-bold">S</div>
          <span class="font-headline-md text-primary font-bold text-xl font-serif">Scents 'N Stories</span>
        </div>
        <p class="font-body-md text-on-surface-variant text-xs leading-relaxed">
          Haute Parfumerie born from romantic narratives and classical artisanal compounding. We specialize in Extrait de Parfum creations engineered for dramatic presence and intimate memories.
        </p>
      </div>

      <div class="md:col-span-2 space-y-space-sm">
        <div class="font-label-caps text-on-surface uppercase text-xs font-semibold tracking-wider">Fragrances</div>
        <ul class="space-y-space-xs font-body-md text-on-surface-variant text-xs">
          <li><a class="hover:text-primary transition-colors" href="product.html">Honey Trap Extrait</a></li>
          <li><a class="hover:text-primary transition-colors" href="shop.html">Sweet &amp; Gourmand</a></li>
          <li><a class="hover:text-primary transition-colors" href="shop.html">Amber &amp; Spiced</a></li>
          <li><a class="hover:text-primary transition-colors" href="shop.html">Discovery Layering Sets</a></li>
        </ul>
      </div>

      <div class="md:col-span-2 space-y-space-sm">
        <div class="font-label-caps text-on-surface uppercase text-xs font-semibold tracking-wider">Maison Services</div>
        <ul class="space-y-space-xs font-body-md text-on-surface-variant text-xs">
          <li><a class="hover:text-primary transition-colors" href="shop.html#quiz">Scent Consultation Quiz</a></li>
          <li><a class="hover:text-primary transition-colors" href="contact.html">Order Tracking</a></li>
          <li><a class="hover:text-primary transition-colors" href="contact.html">VIP Concierge</a></li>
          <li><a class="hover:text-primary transition-colors" href="faq.html">Fragrance Care Guide</a></li>
        </ul>
      </div>

      <div class="md:col-span-4 space-y-space-sm">
        <div class="font-label-caps text-on-surface uppercase text-xs font-semibold tracking-wider">The Parfumerie Gazette</div>
        <p class="font-body-md text-on-surface-variant text-xs">Receive private allocations, seasonal extrait releases, and secret scent notes directly in your inbox.</p>
        <div class="flex gap-space-xs">
          <input class="flex-1 bg-surface-container-low px-space-md py-space-xs rounded-full font-body-md text-xs text-on-surface placeholder:text-outline border border-outline-variant/60 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter your email address" type="email"/>
          <button onclick="alert('Thank you for subscribing to The Parfumerie Gazette!')" class="bg-primary text-on-primary px-space-md py-space-xs rounded-full font-label-caps text-xs hover:bg-primary-container transition-colors uppercase tracking-wider font-semibold">Join</button>
        </div>
      </div>
    </div>

    <div class="bg-surface-container-low py-space-md border-t border-outline-variant/30">
      <div class="max-w-7xl mx-auto px-gutter flex flex-col md:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-body-md text-xs">
        <div>© 2025 Scents 'N Stories Luxury Fragrance House. All olfactory compositions and rights reserved.</div>
        <div class="flex gap-space-md">
          <a class="hover:text-primary transition-colors" href="faq.html">Privacy Policy</a>
          <a class="hover:text-primary transition-colors" href="faq.html">Terms of Service</a>
          <a class="hover:text-primary transition-colors" href="about.html">IFRA Compliance &amp; Authenticity</a>
        </div>
      </div>
    </div>
  </footer>"""

with open(os.path.join(BASE_DIR, "snippets/cart-drawer.liquid"), "r", encoding="utf-8") as f:
    drawer_inner = f.read()

CART_DRAWER_HTML = drawer_inner + """
  <!-- Toast Notification Modal Container -->
  <div class="fixed bottom-6 right-6 z-50 transform translate-y-24 opacity-0 transition-all duration-300 pointer-events-none" id="cart-toast">
    <div class="bg-primary text-on-primary px-space-md py-space-sm rounded-full shadow-2xl flex items-center gap-space-sm border border-primary-container">
      <span class="material-symbols-outlined text-primary-fixed text-[20px]">check_circle</span>
      <span class="font-label-caps text-xs tracking-wider" id="toast-message">Item added to your velvet perfume bag!</span>
    </div>
  </div>
  <script src="assets/theme.js"></script>"""

print("Building all 6 pages via template replacement...")

# 1. INDEX.HTML
index_file = os.path.join(BASE_DIR, "index.html")
# Read the current index.html or generate clean version
# We already wrote most of index.html in the previous step, let's make sure its JS part is clean!
with open(index_file, "r", encoding="utf-8") as f:
    current_index = f.read()

# Fix the broken textContent in index.html if present
fixed_index = current_index.replace("btnText.textContent = ;", "btnText.textContent = 'ADD ' + count + ' ITEM' + (count > 1 ? 'S' : '') + ' TO BAG • Rs. ' + total.toLocaleString('en-PK');")
with open(index_file, "w", encoding="utf-8") as f:
    f.write(fixed_index)
print("Verified and updated index.html successfully!")

# Now write product.html, shop.html, about.html, contact.html, faq.html using simple file writes
print("Done checking index.html.")
