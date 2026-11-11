// Logika Utama Aplikasi (UI, Filter, Modal, Notifikasi Toast)

let selectedCategory = "Semua";
let searchQuery = "";
let sortBy = "popular";
let activeAdminTab = "products";

// Inisialisasi Saat Dokumen Siap
document.addEventListener("DOMContentLoaded", () => {
  applyStoreConfig();
  renderCategoryButtons();
  renderProducts();
  updateCartBadge();
  updateWishlistBadge();
  setupEventListeners();

  // Inisialisasi Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }
});

// Setup Global Event Listeners
function setupEventListeners() {
  // Search Input
  const searchInput = document.getElementById("search-input");
  const mobileSearchInput = document.getElementById("mobile-search-input");

  const handleSearch = (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderProducts();
  };

  if (searchInput) searchInput.addEventListener("input", handleSearch);
  if (mobileSearchInput) mobileSearchInput.addEventListener("input", handleSearch);

  // Sorting Dropdown
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sortBy = e.target.value;
      renderProducts();
    });
  }

  // Cart Drawer Triggers
  document.querySelectorAll(".cart-btn-trigger").forEach((btn) => {
    btn.addEventListener("click", () => openCartDrawer());
  });

  document.getElementById("close-cart-btn")?.addEventListener("click", closeCartDrawer);
  document.getElementById("cart-backdrop")?.addEventListener("click", closeCartDrawer);

  // Kupon Promo
  document.getElementById("apply-coupon-btn")?.addEventListener("click", () => {
    const input = document.getElementById("coupon-input");
    if (!input || !input.value.trim()) {
      showToast("Masukkan kode promo terlebih dahulu!", "warning");
      return;
    }
    const res = applyCouponCode(input.value);
    showToast(res.message, res.success ? "success" : "error");
    if (res.success) input.value = "";
  });

  // Tombol Checkout di Cart Drawer
  document.getElementById("checkout-btn-trigger")?.addEventListener("click", () => {
    openCheckoutModal();
  });

  // Form Checkout Submit
  document.getElementById("checkout-form")?.addEventListener("submit", handleCheckoutSubmit);

  // Tutup Modal Checkout
  document.getElementById("close-checkout-btn")?.addEventListener("click", closeCheckoutModal);

  // Tutup Modal Invoice
  document.getElementById("close-invoice-btn")?.addEventListener("click", closeInvoiceModal);

  // Tombol Print Invoice
  document.getElementById("print-invoice-btn")?.addEventListener("click", () => {
    window.print();
  });

  // Quick View Modal
  document.getElementById("close-quickview-btn")?.addEventListener("click", closeQuickView);
  document.getElementById("quickview-backdrop")?.addEventListener("click", closeQuickView);

  // Wishlist Modal
  document.querySelectorAll(".wishlist-btn-trigger").forEach((btn) => {
    btn.addEventListener("click", openWishlistModal);
  });
  document.getElementById("close-wishlist-btn")?.addEventListener("click", closeWishlistModal);
  document.getElementById("wishlist-backdrop")?.addEventListener("click", closeWishlistModal);

  // Admin Modal
  document.getElementById("admin-btn-trigger")?.addEventListener("click", openAdminLoginModal);
  document.getElementById("close-admin-btn")?.addEventListener("click", closeAdminModal);
  document.getElementById("close-admin-login-btn")?.addEventListener("click", closeAdminLoginModal);

  // Form Login Admin PIN
  document.getElementById("admin-login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const pin = document.getElementById("admin-pin-input").value;
    const config = getStoreConfig();
    if (pin === config.adminPin) {
      closeAdminLoginModal();
      document.getElementById("admin-pin-input").value = "";
      openAdminDashboard();
      showToast("Berhasil masuk ke Dashboard Penjual", "success");
    } else {
      showToast("PIN Admin salah! (Default: 1234)", "error");
    }
  });

  // Admin Tab Switches
  document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      switchAdminTab(tab);
    });
  });

  // Form Tambah / Edit Produk di Admin
  document.getElementById("product-form")?.addEventListener("submit", handleProductFormSubmit);

  // Form Pengaturan Toko di Admin
  document.getElementById("store-settings-form")?.addEventListener("submit", handleStoreSettingsSubmit);

  // Reset Demo Data
  document.getElementById("reset-data-btn")?.addEventListener("click", () => {
    if (confirm("Apakah Anda yakin ingin mereset semua data toko ke bawaan semula?")) {
      resetToDefaultData();
      applyStoreConfig();
      renderProducts();
      renderCartDrawer();
      updateCartBadge();
      updateWishlistBadge();
      closeAdminModal();
      showToast("Data toko telah direset ke setelan awal", "info");
    }
  });
}

// Render Kategori Chips
function renderCategoryButtons() {
  const container = document.getElementById("category-chips-container");
  if (!container) return;

  const categories = ["Semua", "Fashion", "Gadget", "Kuliner", "Skincare", "Rumah Tangga"];

  container.innerHTML = categories
    .map(
      (cat) => `
    <button
      onclick="selectCategory('${cat}')"
      class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
        selectedCategory === cat
          ? "bg-sky-600 text-white shadow-md shadow-sky-200"
          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
      }"
    >
      ${cat}
    </button>
  `
    )
    .join("");
}

function selectCategory(category) {
  selectedCategory = category;
  renderCategoryButtons();
  renderProducts();
}

// Render Produk Berdasarkan Filter & Sort
function renderProducts() {
  const container = document.getElementById("products-grid");
  const emptyState = document.getElementById("products-empty-state");
  if (!container) return;

  let products = getProducts();

  // Filter Kategori
  if (selectedCategory !== "Semua") {
    products = products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  // Filter Pencarian
  if (searchQuery) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery)
    );
  }

  // Sorting
  if (sortBy === "price-low") {
    products.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    products.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    products.sort((a, b) => b.rating - a.rating);
  } else {
    // Default Popular
    products.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
  }

  // Tampilkan Empty State jika tidak ada produk
  if (products.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  container.innerHTML = products
    .map((product) => {
      const discountPercent =
        product.originalPrice > product.price
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0;

      const isFav = isInWishlist(product.id);

      return `
      <div class="product-card bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col justify-between group relative">
        <!-- Thumbnail & Badges -->
        <div class="relative overflow-hidden bg-slate-100 aspect-square">
          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <!-- Badges -->
          <div class="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
            ${
              product.badge
                ? `<span class="bg-sky-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">${product.badge}</span>`
                : ""
            }
            ${
              discountPercent > 0
                ? `<span class="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">-${discountPercent}%</span>`
                : ""
            }
          </div>

          <!-- Wishlist & Quick View Hover Buttons -->
          <div class="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
            <button
              onclick="handleToggleWishlist('${product.id}')"
              class="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center transition-all ${
                isFav ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
              }"
              title="Simpan ke Wishlist"
            >
              <i data-lucide="heart" class="w-4 h-4 ${isFav ? "fill-current" : ""}"></i>
            </button>
            <button
              onclick="openQuickView('${product.id}')"
              class="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow text-slate-500 hover:text-sky-600 flex items-center justify-center transition-all"
              title="Lihat Detail Cepat"
            >
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
          </div>

          ${
            product.stock <= 0
              ? `<div class="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center">
                  <span class="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Stok Habis</span>
                </div>`
              : ""
          }
        </div>

        <!-- Info Card -->
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>${product.category}</span>
              <div class="flex items-center text-amber-500 font-semibold space-x-1">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
                <span>${product.rating}</span>
                <span class="text-slate-400 font-normal">(${product.soldCount || 0})</span>
              </div>
            </div>

            <h3 class="font-semibold text-slate-800 text-sm line-clamp-2 hover:text-sky-600 cursor-pointer" onclick="openQuickView('${product.id}')">
              ${product.name}
            </h3>
          </div>

          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              ${
                product.originalPrice > product.price
                  ? `<span class="text-[11px] text-slate-400 line-through block">${formatRupiah(product.originalPrice)}</span>`
                  : ""
              }
              <span class="text-base font-bold text-sky-700">${formatRupiah(product.price)}</span>
            </div>

            <button
              onclick="handleAddToCart('${product.id}')"
              ${product.stock <= 0 ? "disabled" : ""}
              class="p-2.5 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Tambah ke Keranjang"
            >
              <i data-lucide="shopping-cart" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Tambah ke Keranjang
function handleAddToCart(productId, quantity = 1) {
  const res = addToCart(productId, quantity);
  if (res.success) {
    showToast(res.message, "success");
  } else {
    showToast(res.message, "warning");
  }
}

// Wishlist Handler
function handleToggleWishlist(productId) {
  const isAdded = toggleWishlist(productId);
  showToast(
    isAdded ? "Ditambahkan ke Wishlist favorit!" : "Dihapus dari Wishlist",
    isAdded ? "success" : "info"
  );
  renderProducts();
}

function updateWishlistUI() {
  renderWishlistModalItems();
}

// Cart Drawer
function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById("cart-drawer");
  const panel = document.getElementById("cart-panel");
  const backdrop = document.getElementById("cart-backdrop");

  drawer.classList.remove("hidden");
  setTimeout(() => {
    backdrop.classList.remove("opacity-0");
    backdrop.classList.add("opacity-100");
    panel.classList.remove("translate-x-full");
    panel.classList.add("translate-x-0");
  }, 10);
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const panel = document.getElementById("cart-panel");
  const backdrop = document.getElementById("cart-backdrop");

  backdrop.classList.remove("opacity-100");
  backdrop.classList.add("opacity-0");
  panel.classList.remove("translate-x-0");
  panel.classList.add("translate-x-full");

  setTimeout(() => {
    drawer.classList.add("hidden");
  }, 300);
}

function renderCartDrawer() {
  const container = document.getElementById("cart-items-container");
  const emptyView = document.getElementById("cart-empty-view");
  const footerView = document.getElementById("cart-footer-view");
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = "";
    emptyView?.classList.remove("hidden");
    footerView?.classList.add("hidden");
    return;
  }

  emptyView?.classList.add("hidden");
  footerView?.classList.remove("hidden");

  container.innerHTML = cart
    .map(
      (item) => `
    <div class="flex items-center space-x-3 py-3 border-b border-slate-100">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-slate-100 shrink-0" />
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-semibold text-slate-800 line-clamp-1">${item.name}</h4>
        <span class="text-xs font-bold text-sky-600 block mt-0.5">${formatRupiah(item.price)}</span>
        
        <!-- Controls -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center border border-slate-200 rounded-lg bg-slate-50">
            <button onclick="updateCartQuantity('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-800 font-bold">-</button>
            <span class="px-2 text-xs font-semibold text-slate-700">${item.quantity}</span>
            <button onclick="updateCartQuantity('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-800 font-bold">+</button>
          </div>
          <button onclick="removeFromCart('${item.id}')" class="text-rose-500 hover:text-rose-700 text-xs flex items-center space-x-1">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  // Update Summary
  const { subtotal, discount, shippingFee, total, coupon } = calculateCartTotals();
  document.getElementById("cart-subtotal").textContent = formatRupiah(subtotal);
  document.getElementById("cart-shipping").textContent = formatRupiah(shippingFee);

  const discountEl = document.getElementById("cart-discount-row");
  if (discount > 0) {
    discountEl.classList.remove("hidden");
    document.getElementById("cart-discount").textContent = `-${formatRupiah(discount)}`;
  } else {
    discountEl.classList.add("hidden");
  }

  // Active Coupon Tag
  const couponBadge = document.getElementById("active-coupon-badge");
  if (coupon) {
    couponBadge.classList.remove("hidden");
    couponBadge.innerHTML = `
      <span class="text-xs font-medium text-emerald-700 flex items-center space-x-1">
        <i data-lucide="tag" class="w-3 h-3"></i>
        <span>Kupon: <strong>${coupon.code}</strong> (${coupon.label})</span>
      </span>
      <button onclick="removeCouponCode()" class="text-slate-400 hover:text-rose-600 text-xs ml-2 font-bold">&times;</button>
    `;
  } else {
    couponBadge.classList.add("hidden");
  }

  document.getElementById("cart-grand-total").textContent = formatRupiah(total);

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Quick View Modal
function openQuickView(productId) {
  const products = getProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("quickview-modal");
  document.getElementById("qv-image").src = product.image;
  document.getElementById("qv-name").textContent = product.name;
  document.getElementById("qv-category").textContent = product.category;
  document.getElementById("qv-rating").textContent = product.rating;
  document.getElementById("qv-sold").textContent = `(${product.soldCount || 0} terjual)`;
  document.getElementById("qv-price").textContent = formatRupiah(product.price);
  
  const origPriceEl = document.getElementById("qv-orig-price");
  if (product.originalPrice > product.price) {
    origPriceEl.textContent = formatRupiah(product.originalPrice);
    origPriceEl.classList.remove("hidden");
  } else {
    origPriceEl.classList.add("hidden");
  }

  document.getElementById("qv-stock").textContent = product.stock;
  document.getElementById("qv-description").textContent = product.description;

  // Add to cart action from modal
  const addBtn = document.getElementById("qv-add-to-cart-btn");
  addBtn.onclick = () => {
    const qty = parseInt(document.getElementById("qv-qty-input").value, 10) || 1;
    handleAddToCart(product.id, qty);
    closeQuickView();
  };

  document.getElementById("qv-qty-input").value = 1;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  if (window.lucide) lucide.createIcons();
}

function closeQuickView() {
  const modal = document.getElementById("quickview-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Wishlist Modal
function openWishlistModal() {
  renderWishlistModalItems();
  const modal = document.getElementById("wishlist-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeWishlistModal() {
  const modal = document.getElementById("wishlist-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function renderWishlistModalItems() {
  const container = document.getElementById("wishlist-items-container");
  const emptyView = document.getElementById("wishlist-empty-view");
  if (!container) return;

  const wishlistIds = getWishlist();
  const allProducts = getProducts();
  const items = allProducts.filter((p) => wishlistIds.includes(p.id));

  if (items.length === 0) {
    container.innerHTML = "";
    emptyView?.classList.remove("hidden");
    return;
  }

  emptyView?.classList.add("hidden");

  container.innerHTML = items
    .map(
      (item) => `
    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
      <div class="flex items-center space-x-3">
        <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg border border-slate-200" />
        <div>
          <h4 class="text-xs font-semibold text-slate-800 line-clamp-1">${item.name}</h4>
          <span class="text-xs font-bold text-sky-600 block mt-0.5">${formatRupiah(item.price)}</span>
          <span class="text-[10px] text-slate-400">Stok: ${item.stock}</span>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button
          onclick="handleAddToCart('${item.id}', 1); toggleWishlist('${item.id}'); renderWishlistModalItems();"
          class="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-medium flex items-center space-x-1"
        >
          <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
          <span>Beli</span>
        </button>
        <button
          onclick="toggleWishlist('${item.id}'); renderWishlistModalItems();"
          class="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
          title="Hapus dari Wishlist"
        >
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `
    )
    .join("");

  if (window.lucide) lucide.createIcons();
}

// Admin Modal Management
function openAdminLoginModal() {
  const modal = document.getElementById("admin-login-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeAdminLoginModal() {
  const modal = document.getElementById("admin-login-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function openAdminDashboard() {
  const modal = document.getElementById("admin-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  switchAdminTab("products");
}

function closeAdminModal() {
  const modal = document.getElementById("admin-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function switchAdminTab(tab) {
  activeAdminTab = tab;
  document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
    if (btn.dataset.tab === tab) {
      btn.className = "admin-tab-btn px-4 py-2 text-xs font-bold text-sky-600 border-b-2 border-sky-600";
    } else {
      btn.className = "admin-tab-btn px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 border-b-2 border-transparent";
    }
  });

  document.getElementById("admin-tab-products")?.classList.toggle("hidden", tab !== "products");
  document.getElementById("admin-tab-orders")?.classList.toggle("hidden", tab !== "orders");
  document.getElementById("admin-tab-settings")?.classList.toggle("hidden", tab !== "settings");

  if (tab === "products") renderAdminProductsList();
  if (tab === "orders") renderAdminOrdersList();
  if (tab === "settings") loadStoreSettingsIntoForm();
}

// Admin: Daftar Produk
function renderAdminProductsList() {
  const container = document.getElementById("admin-products-table-body");
  if (!container) return;

  const products = getProducts();

  container.innerHTML = products
    .map(
      (p) => `
    <tr class="hover:bg-slate-50 border-b border-slate-100">
      <td class="p-3">
        <div class="flex items-center space-x-2">
          <img src="${p.image}" class="w-10 h-10 object-cover rounded-md border border-slate-200" />
          <div>
            <p class="font-semibold text-xs text-slate-800 line-clamp-1">${p.name}</p>
            <span class="text-[10px] text-slate-400">${p.category}</span>
          </div>
        </div>
      </td>
      <td class="p-3 text-xs font-bold text-slate-700">${formatRupiah(p.price)}</td>
      <td class="p-3 text-xs text-slate-600">${p.stock} pcs</td>
      <td class="p-3 text-right">
        <button onclick="editProductModal('${p.id}')" class="text-sky-600 hover:text-sky-800 text-xs mr-2 font-medium">Edit</button>
        <button onclick="handleDeleteProduct('${p.id}')" class="text-rose-500 hover:text-rose-700 text-xs font-medium">Hapus</button>
      </td>
    </tr>
  `
    )
    .join("");
}

function handleProductFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("prod-form-id").value;
  const name = document.getElementById("prod-form-name").value;
  const category = document.getElementById("prod-form-category").value;
  const price = document.getElementById("prod-form-price").value;
  const originalPrice = document.getElementById("prod-form-orig-price").value;
  const stock = document.getElementById("prod-form-stock").value;
  const badge = document.getElementById("prod-form-badge").value;
  const image = document.getElementById("prod-form-image").value;
  const description = document.getElementById("prod-form-desc").value;

  if (id) {
    // Mode Update
    updateProduct(id, { name, category, price, originalPrice, stock, badge, image, description });
    showToast("Produk berhasil diperbarui!", "success");
  } else {
    // Mode Tambah
    addProduct({ name, category, price, originalPrice, stock, badge, image, description });
    showToast("Produk baru berhasil ditambahkan!", "success");
  }

  // Reset form
  document.getElementById("product-form").reset();
  document.getElementById("prod-form-id").value = "";
  document.getElementById("prod-form-submit-btn").textContent = "Simpan Produk Baru";

  renderAdminProductsList();
  renderProducts();
}

function editProductModal(id) {
  const products = getProducts();
  const p = products.find((item) => item.id === id);
  if (!p) return;

  document.getElementById("prod-form-id").value = p.id;
  document.getElementById("prod-form-name").value = p.name;
  document.getElementById("prod-form-category").value = p.category;
  document.getElementById("prod-form-price").value = p.price;
  document.getElementById("prod-form-orig-price").value = p.originalPrice;
  document.getElementById("prod-form-stock").value = p.stock;
  document.getElementById("prod-form-badge").value = p.badge || "";
  document.getElementById("prod-form-image").value = p.image;
  document.getElementById("prod-form-desc").value = p.description;

  document.getElementById("prod-form-submit-btn").textContent = "Update Produk";
}

function handleDeleteProduct(id) {
  if (confirm("Hapus produk ini dari toko?")) {
    deleteProduct(id);
    renderAdminProductsList();
    renderProducts();
    showToast("Produk telah dihapus", "info");
  }
}

// Admin: Daftar Pesanan Masuk
function renderAdminOrdersList() {
  const container = document.getElementById("admin-orders-container");
  if (!container) return;

  const orders = getOrders();
  if (orders.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400 text-xs">
        <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
        Belum ada pesanan yang masuk.
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = orders
    .map(
      (order) => `
    <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
      <div class="flex justify-between items-center">
        <div>
          <span class="font-bold text-slate-800">${order.id}</span>
          <span class="text-slate-400 ml-2">${order.date}</span>
        </div>
        <select onchange="handleStatusChange('${order.id}', this.value)" class="text-[11px] font-semibold rounded-md border border-slate-200 px-2 py-1 bg-white text-slate-700">
          <option value="Menunggu Pembayaran" ${order.status === "Menunggu Pembayaran" ? "selected" : ""}>Menunggu Pembayaran</option>
          <option value="Diproses" ${order.status === "Diproses" ? "selected" : ""}>Diproses</option>
          <option value="Dikirim" ${order.status === "Dikirim" ? "selected" : ""}>Dikirim</option>
          <option value="Selesai" ${order.status === "Selesai" ? "selected" : ""}>Selesai</option>
        </select>
      </div>

      <div class="text-slate-600">
        <p><strong>Pemesan:</strong> ${order.customer.name} (${order.customer.phone})</p>
        <p><strong>Alamat:</strong> ${order.customer.address}</p>
        <p><strong>Item:</strong> ${order.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}</p>
        <p><strong>Total:</strong> <strong class="text-sky-600">${formatRupiah(order.totals.total)}</strong> (${order.paymentMethod})</p>
      </div>
    </div>
  `
    )
    .join("");

  if (window.lucide) lucide.createIcons();
}

function handleStatusChange(orderId, status) {
  updateOrderStatus(orderId, status);
  showToast(`Status pesanan ${orderId} diubah menjadi "${status}"`, "success");
}

// Admin: Pengaturan Toko
function loadStoreSettingsIntoForm() {
  const config = getStoreConfig();
  document.getElementById("set-store-name").value = config.storeName;
  document.getElementById("set-tagline").value = config.tagline;
  document.getElementById("set-phone").value = config.phone;
  document.getElementById("set-email").value = config.email;
  document.getElementById("set-bank-name").value = config.bankName;
  document.getElementById("set-bank-acc").value = config.bankAccount;
  document.getElementById("set-bank-holder").value = config.bankHolder;
  document.getElementById("set-address").value = config.address;
  document.getElementById("set-admin-pin").value = config.adminPin;
}

function handleStoreSettingsSubmit(e) {
  e.preventDefault();
  const newConfig = {
    storeName: document.getElementById("set-store-name").value,
    tagline: document.getElementById("set-tagline").value,
    phone: document.getElementById("set-phone").value.replace(/[^0-9]/g, ""),
    email: document.getElementById("set-email").value,
    bankName: document.getElementById("set-bank-name").value,
    bankAccount: document.getElementById("set-bank-acc").value,
    bankHolder: document.getElementById("set-bank-holder").value,
    address: document.getElementById("set-address").value,
    adminPin: document.getElementById("set-admin-pin").value || "1234"
  };

  saveStoreConfig(newConfig);
  showToast("Pengaturan toko berhasil diperbarui!", "success");
}

// Toast Notification System
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");

  let bgClass = "bg-slate-800 text-white";
  let iconName = "info";

  if (type === "success") {
    bgClass = "bg-emerald-600 text-white";
    iconName = "check-circle";
  } else if (type === "warning") {
    bgClass = "bg-amber-500 text-white";
    iconName = "alert-triangle";
  } else if (type === "error") {
    bgClass = "bg-rose-600 text-white";
    iconName = "alert-circle";
  }

  toast.className = `flex items-center space-x-2 px-4 py-3 rounded-xl shadow-lg text-xs font-semibold ${bgClass} transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto`;
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-4 h-4 shrink-0"></i>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  if (window.lucide) lucide.createIcons();

  // Animasi masuk
  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  });

  // Animasi keluar setelah 3.5 detik
  setTimeout(() => {
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
