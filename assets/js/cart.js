// Manajemen Keranjang Belanja & Wishlist (Tersimpan di LocalStorage)

const CART_STORAGE_KEY = "nusantara_cart";
const WISHLIST_STORAGE_KEY = "nusantara_wishlist";
const APPLIED_COUPON_KEY = "nusantara_coupon";

// Format Rupiah
function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Mengambil keranjang dari localStorage
function getCart() {
  const data = localStorage.getItem(CART_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Simpan keranjang ke localStorage
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

// Tambah produk ke keranjang
function addToCart(productId, quantity = 1) {
  const products = getProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return { success: false, message: "Produk tidak ditemukan" };

  if (product.stock <= 0) {
    return { success: false, message: "Maaf, stok produk ini sedang habis" };
  }

  const cart = getCart();
  const existingIndex = cart.findIndex((item) => item.id === productId);

  if (existingIndex > -1) {
    const newQty = cart[existingIndex].quantity + quantity;
    if (newQty > product.stock) {
      return { success: false, message: `Stok hanya tersisa ${product.stock} pcs` };
    }
    cart[existingIndex].quantity = newQty;
  } else {
    if (quantity > product.stock) {
      return { success: false, message: `Stok hanya tersisa ${product.stock} pcs` };
    }
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      quantity: quantity
    });
  }

  saveCart(cart);
  triggerCartAnimation();
  return { success: true, message: `Berhasil menambahkan "${product.name}" ke keranjang!` };
}

// Update kuantitas (+ atau -)
function updateCartQuantity(productId, delta) {
  const cart = getCart();
  const index = cart.findIndex((item) => item.id === productId);
  if (index === -1) return;

  const products = getProducts();
  const product = products.find((p) => p.id === productId);
  const maxStock = product ? product.stock : 999;

  cart[index].quantity += delta;

  if (cart[index].quantity > maxStock) {
    cart[index].quantity = maxStock;
    showToast(`Maksimal stok tercapai (${maxStock} pcs)`, "warning");
  } else if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCartDrawer();
}

// Hapus item dari keranjang
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  renderCartDrawer();
  showToast("Produk dihapus dari keranjang", "info");
}

// Bersihkan seluruh keranjang
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(APPLIED_COUPON_KEY);
  updateCartBadge();
  renderCartDrawer();
}

// Hitung rincian biaya keranjang
function calculateCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const appliedCoupon = getAppliedCoupon();
  let discount = 0;

  if (appliedCoupon && subtotal >= appliedCoupon.minPurchase) {
    if (appliedCoupon.type === "percent") {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }

  // Ongkir default atau dari pilihan kurir terpilih
  const selectedShipping = getSelectedShipping();
  const shippingFee = subtotal > 0 ? (selectedShipping ? selectedShipping.price : 12000) : 0;

  const total = Math.max(0, subtotal - discount + shippingFee);

  return {
    itemCount: cart.reduce((count, item) => count + item.quantity, 0),
    subtotal,
    discount,
    shippingFee,
    total,
    coupon: appliedCoupon
  };
}

// Kupon Promo
function getAppliedCoupon() {
  const data = localStorage.getItem(APPLIED_COUPON_KEY);
  return data ? JSON.parse(data) : null;
}

function applyCouponCode(code) {
  const cleanCode = code.trim().toUpperCase();
  const coupon = DEFAULT_COUPONS.find((c) => c.code === cleanCode);

  if (!coupon) {
    return { success: false, message: "Kode promo tidak valid atau kadaluarsa" };
  }

  const { subtotal } = calculateCartTotals();
  if (subtotal < coupon.minPurchase) {
    return {
      success: false,
      message: `Minimal belanja untuk kupon ini adalah ${formatRupiah(coupon.minPurchase)}`
    };
  }

  localStorage.setItem(APPLIED_COUPON_KEY, JSON.stringify(coupon));
  renderCartDrawer();
  return { success: true, message: `Kupon "${coupon.code}" berhasil dipasang!` };
}

function removeCouponCode() {
  localStorage.removeItem(APPLIED_COUPON_KEY);
  renderCartDrawer();
}

// Pengiriman yang dipilih
let currentShipping = SHIPPING_OPTIONS[0];
function getSelectedShipping() {
  return currentShipping;
}
function setSelectedShipping(shippingId) {
  const found = SHIPPING_OPTIONS.find((s) => s.id === shippingId);
  if (found) {
    currentShipping = found;
  }
}

// Update Badge Keranjang
function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const badges = document.querySelectorAll(".cart-count-badge");
  badges.forEach((b) => {
    b.textContent = totalItems;
    b.classList.toggle("hidden", totalItems === 0);
  });
}

function triggerCartAnimation() {
  const cartButtons = document.querySelectorAll(".cart-btn-trigger");
  cartButtons.forEach((btn) => {
    btn.classList.add("bump-animate");
    setTimeout(() => btn.classList.remove("bump-animate"), 350);
  });
}

// Wishlist Logic
function getWishlist() {
  const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function toggleWishlist(productId) {
  let wishlist = getWishlist();
  const index = wishlist.indexOf(productId);
  let isAdded = false;

  if (index > -1) {
    wishlist.splice(index, 1);
    isAdded = false;
  } else {
    wishlist.push(productId);
    isAdded = true;
  }

  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  updateWishlistBadge();
  updateWishlistUI();
  return isAdded;
}

function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.includes(productId);
}

function updateWishlistBadge() {
  const wishlist = getWishlist();
  const badges = document.querySelectorAll(".wishlist-count-badge");
  badges.forEach((b) => {
    b.textContent = wishlist.length;
    b.classList.toggle("hidden", wishlist.length === 0);
  });
}
