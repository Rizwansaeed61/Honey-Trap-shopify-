/**
 * Scents 'N Stories - Honey Trap Luxury Haute Parfumerie Engine
 * Supports standalone static mode (with localStorage cart) and Shopify Ajax Cart API
 */

class LuxuryCartManager {
  constructor() {
    this.storageKey = 'sns_honey_trap_cart_v1';
    this.freeShippingThreshold = 1500;
    this.items = this.loadCart();
    this.initListeners();
    this.updateUI();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage not available, using memory cart');
    }
    // Default initial cart state (1 Honey Trap EDP)
    return [
      {
        id: 'honey-trap-50ml',
        title: 'Honey Trap',
        presentation: '50ml Extrait de Parfum',
        price: 2450,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYapaf1GXJUtrfPx2QOZHfNYaPSVhf38bD8toHMqtN7akXWYrdemQ-d-9U5b0Pemapq_yIEL1LI8aI1LjT2qCULxoGlwU4K9e0sSfiSKcpW31UQ0PJpc2oaqndxLUPZ9dqoJZJVlPH2nrxqQRE_Qmrht_AaBuyGa-7u_DlkWVqIOeb9e3sX6Sp5uJW2afLRAm2DTYG3Nm0OoNTIMeLcz4I2rGMVQp4J8iAmIToor1VaW3jFq8aRVKdIkcgPr4rv8q8858'
      }
    ];
  }

  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.error(e);
    }
    this.updateUI();
  }

  addItem(item) {
    const existingIndex = this.items.findIndex(i => i.id === item.id);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += (item.quantity || 1);
    } else {
      this.items.push({
        id: item.id || `perfume-${Date.now()}`,
        title: item.title || 'Honey Trap',
        presentation: item.presentation || '50ml Flacon',
        price: Number(item.price) || 2450,
        quantity: Number(item.quantity) || 1,
        image: item.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYapaf1GXJUtrfPx2QOZHfNYaPSVhf38bD8toHMqtN7akXWYrdemQ-d-9U5b0Pemapq_yIEL1LI8aI1LjT2qCULxoGlwU4K9e0sSfiSKcpW31UQ0PJpc2oaqndxLUPZ9dqoJZJVlPH2nrxqQRE_Qmrht_AaBuyGa-7u_DlkWVqIOeb9e3sX6Sp5uJW2afLRAm2DTYG3Nm0OoNTIMeLcz4I2rGMVQp4J8iAmIToor1VaW3jFq8aRVKdIkcgPr4rv8q8858'
      });
    }
    this.saveCart();
    this.showToast(`${item.title} (${item.presentation || 'Added'})`);
    this.openDrawer();
  }

  updateQuantity(id, delta) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.items = this.items.filter(i => i.id !== id);
    }
    this.saveCart();
  }

  removeItem(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.saveCart();
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateUI() {
    const count = this.getTotalCount();
    const subtotal = this.getSubtotal();

    // Update cart badge counters across the site
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });

    // Update subtotal elements
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    if (subtotalEl) {
      subtotalEl.textContent = `Rs. ${subtotal.toLocaleString('en-PK')}`;
    }

    // Update free shipping progress bar
    const shippingBar = document.getElementById('free-shipping-progress');
    const shippingText = document.getElementById('free-shipping-message');
    if (shippingBar && shippingText) {
      const percentage = Math.min(100, Math.round((subtotal / this.freeShippingThreshold) * 100));
      shippingBar.style.width = `${percentage}%`;
      if (subtotal >= this.freeShippingThreshold) {
        shippingText.innerHTML = `<span class="font-bold text-primary">Unlocked!</span> Enjoy Complimentary Priority Courier!`;
      } else {
        const remaining = this.freeShippingThreshold - subtotal;
        shippingText.innerHTML = `Add <span class="font-bold text-primary">Rs. ${remaining.toLocaleString('en-PK')}</span> more for Complimentary Delivery`;
      }
    }

    // Render cart items list inside drawer
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const footer = document.getElementById('cart-drawer-footer');

    if (container) {
      if (this.items.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        if (footer) footer.classList.add('opacity-50', 'pointer-events-none');
      } else {
        if (emptyState) emptyState.classList.add('hidden');
        if (footer) footer.classList.remove('opacity-50', 'pointer-events-none');

        container.innerHTML = this.items.map(item => `
          <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 relative group">
            <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain rounded-lg bg-surface-container-lowest p-1 border border-outline-variant/30 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <h4 class="font-serif font-semibold text-sm text-on-surface truncate">${item.title}</h4>
              <p class="text-[11px] text-on-surface-variant font-label-caps uppercase tracking-wider">${item.presentation}</p>
              <div class="font-semibold text-primary text-xs mt-1">Rs. ${item.price.toLocaleString('en-PK')}</div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <button onclick="window.luxuryCart.removeItem('${item.id}')" class="text-outline hover:text-error transition-colors p-1" title="Remove item">
                <span class="material-symbols-outlined text-[16px]">close</span>
              </button>
              <div class="flex items-center border border-outline-variant/50 rounded-full bg-surface-container-lowest px-2 py-0.5">
                <button onclick="window.luxuryCart.updateQuantity('${item.id}', -1)" class="text-xs text-outline hover:text-primary px-1">-</button>
                <span class="text-xs font-semibold px-2">${item.quantity}</span>
                <button onclick="window.luxuryCart.updateQuantity('${item.id}', 1)" class="text-xs text-outline hover:text-primary px-1">+</button>
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('translate-x-full');
      drawer.classList.add('translate-x-0');
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      backdrop.classList.add('opacity-100');
      document.body.style.overflow = 'hidden';
    }
  }

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
      drawer.classList.add('translate-x-full');
      drawer.classList.remove('translate-x-0');
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      backdrop.classList.remove('opacity-100');
      document.body.style.overflow = '';
    }
  }

  showToast(message) {
    const toast = document.getElementById('cart-toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
      toastMsg.textContent = `Added ${message} to your luxury velvet pouch!`;
      toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
      toast.classList.add('translate-y-0', 'opacity-100');

      setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
        toast.classList.remove('translate-y-0', 'opacity-100');
      }, 3000);
    }
  }

  initListeners() {
    // Open drawer triggers
    document.querySelectorAll('[data-cart-trigger], [data-cart-open], .cart-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close drawer triggers
    document.querySelectorAll('[data-cart-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeDrawer();
      });
    });
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.luxuryCart = new LuxuryCartManager();
});

// Scent Family Filter
function filterConcern(concernKey, buttonEl) {
  const buttons = document.querySelectorAll('.concern-btn');
  buttons.forEach(btn => {
    btn.classList.remove('bg-primary', 'text-on-primary');
    btn.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
  });

  if (buttonEl) {
    buttonEl.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');
    buttonEl.classList.add('bg-primary', 'text-on-primary');
  }

  const cards = document.querySelectorAll('.product-item');
  cards.forEach(card => {
    if (concernKey === 'all') {
      card.style.display = 'flex';
    } else {
      const itemConcerns = card.getAttribute('data-concerns') || '';
      if (itemConcerns.includes(concernKey)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

// Size Selection (PDP)
function selectProductSize(buttonEl, priceVal, sizeLabel = '50ml') {
  const parentContainer = buttonEl.parentElement;
  const siblingBtns = parentContainer.querySelectorAll('.size-btn');
  siblingBtns.forEach(btn => {
    btn.classList.remove('active', 'bg-surface-container-high', 'text-primary', 'border-primary/40');
    btn.classList.add('bg-surface-container-low', 'text-on-surface-variant', 'border-outline-variant/50');
  });
  buttonEl.classList.remove('bg-surface-container-low', 'text-on-surface-variant', 'border-outline-variant/50');
  buttonEl.classList.add('active', 'bg-surface-container-high', 'text-primary', 'border-primary/40');

  // If card has an action button with price, update it
  const card = buttonEl.closest('.product-item');
  if (card) {
    const atcBtn = card.querySelector('.atc-btn-text');
    if (atcBtn) {
      atcBtn.textContent = `ADD TO BAG • Rs. ${Number(priceVal).toLocaleString('en-PK')}`;
    }
  }
}

// PDP Presentation Selector
let activePDPSize = '50ml EDP';
let activePDPPrice = 2450;
function selectSize(size, price, mrp, cardElement) {
  activePDPPrice = price;
  activePDPSize = size;

  const priceEl = document.getElementById('active-price-text');
  const volEl = document.getElementById('active-vol-text');
  const ctaPriceEl = document.getElementById('cta-price-display');

  if (priceEl) priceEl.innerText = 'Rs. ' + price.toLocaleString('en-PK');
  if (volEl) volEl.innerText = '- ' + size;
  if (ctaPriceEl) ctaPriceEl.innerText = 'Rs. ' + price.toLocaleString('en-PK');

  const cards = document.querySelectorAll('.size-card');
  cards.forEach(c => {
    c.classList.remove('bg-surface-container-low', 'border-2', 'border-primary');
    c.classList.add('bg-surface-container-lowest', 'border', 'border-outline-variant/50');
    const dot = c.querySelector('.radio-indicator');
    if (dot) {
      dot.className = 'radio-indicator w-4 h-4 rounded-full bg-surface-container-highest flex items-center justify-center';
      dot.innerHTML = '';
    }
  });

  cardElement.classList.add('bg-surface-container-low', 'border-2', 'border-primary');
  cardElement.classList.remove('bg-surface-container-lowest', 'border-outline-variant/50');
  const activeDot = cardElement.querySelector('.radio-indicator');
  if (activeDot) {
    activeDot.className = 'radio-indicator w-4 h-4 rounded-full bg-primary flex items-center justify-center';
    activeDot.innerHTML = '<span class="w-1.5 h-1.5 bg-on-primary rounded-full"></span>';
  }
}

// PDP Accord Tabs
function switchTab(tabId) {
  const tabs = ['ingredients', 'how-to-use', 'clinical-data'];
  tabs.forEach(t => {
    const btn = document.getElementById('tab-btn-' + t);
    const panel = document.getElementById('panel-' + t);
    if (!btn || !panel) return;
    const indicator = btn.querySelector('.tab-indicator');

    if (t === tabId) {
      btn.classList.add('text-primary', 'font-bold');
      btn.classList.remove('text-on-surface-variant');
      if (indicator) {
        indicator.classList.add('bg-primary');
        indicator.classList.remove('bg-transparent');
      }
      panel.classList.remove('hidden');
    } else {
      btn.classList.remove('text-primary', 'font-bold');
      btn.classList.add('text-on-surface-variant');
      if (indicator) {
        indicator.classList.remove('bg-primary');
        indicator.classList.add('bg-transparent');
      }
      panel.classList.add('hidden');
    }
  });
}

// PDP Image switcher
function switchImage(index, imgSrc) {
  const mainImg = document.getElementById('main-product-image');
  if (mainImg && imgSrc) {
    mainImg.src = imgSrc;
  }
  const buttons = document.querySelectorAll('.thumb-btn');
  buttons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('border-primary');
      btn.classList.remove('border-outline-variant/40');
    } else {
      btn.classList.remove('border-primary');
      btn.classList.add('border-outline-variant/40');
    }
  });
}

// Bundle Calculation (Home Discovery Trio)
function calculateRoutineTotal() {
  const checkboxes = document.querySelectorAll('.routine-check');
  let total = 0;
  let count = 0;

  checkboxes.forEach(cb => {
    if (cb.checked) {
      total += parseInt(cb.getAttribute('data-price') || '0', 10);
      count++;
    }
  });

  const btnText = document.getElementById('bundle-btn-text');
  const submitBtn = document.getElementById('bundle-submit-btn');

  if (!btnText || !submitBtn) return;

  if (count === 0) {
    btnText.textContent = 'SELECT AT LEAST 1 ITEM';
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    btnText.textContent = `ADD ${count} ITEM${count > 1 ? 'S' : ''} TO BAG • Rs. ${total.toLocaleString('en-PK')}`;
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

function triggerRoutineAdd() {
  const checkboxes = document.querySelectorAll('.routine-check:checked');
  if (checkboxes.length > 0) {
    checkboxes.forEach(cb => {
      const parent = cb.closest('.routine-card');
      const title = parent ? parent.querySelector('.font-headline-sm').textContent.trim() : 'Discovery Item';
      const price = parseInt(cb.getAttribute('data-price') || '1850', 10);
      window.luxuryCart.addItem({
        id: 'bundle-' + title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        title: title,
        presentation: 'Curated Layering Trio',
        price: price,
        quantity: 1
      });
    });
  }
}

// PDP Routine Update
function updateRoutineTotal() {
  const basePerfumePrice = 2450;
  let total = basePerfumePrice;
  let count = 1;

  const step2 = document.getElementById('routine-step-2');
  const step3 = document.getElementById('routine-step-3');

  if (step2 && step2.checked) {
    total += 1150;
    count++;
  }
  if (step3 && step3.checked) {
    total += 1350;
    count++;
  }

  const label = document.getElementById('routine-count-label');
  const priceDisplay = document.getElementById('routine-total-price');
  if (label) label.innerText = `Add ${count} Collection Items To Bag`;
  if (priceDisplay) priceDisplay.innerText = `Rs. ${total.toLocaleString('en-PK')}`;
}

function addRoutineToCart() {
  window.luxuryCart.addItem({
    id: 'honey-trap-50ml',
    title: 'Honey Trap Eau De Parfum',
    presentation: '50ml Signature EDP',
    price: 2450,
    quantity: 1
  });

  const step2 = document.getElementById('routine-step-2');
  if (step2 && step2.checked) {
    window.luxuryCart.addItem({
      id: 'honey-trap-hair-mist',
      title: 'Honey Trap Silken Hair Mist',
      presentation: '50ml Hair Care',
      price: 1150,
      quantity: 1
    });
  }

  const step3 = document.getElementById('routine-step-3');
  if (step3 && step3.checked) {
    window.luxuryCart.addItem({
      id: 'velvet-honey-body-butter',
      title: 'Velvet Honey Body Butter',
      presentation: '150g Jar Body Ritual',
      price: 1350,
      quantity: 1
    });
  }
}

function triggerAddToCartNotification() {
  window.luxuryCart.addItem({
    id: 'honey-trap-' + activePDPSize.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    title: 'Honey Trap',
    presentation: activePDPSize,
    price: activePDPPrice,
    quantity: 1
  });
}
