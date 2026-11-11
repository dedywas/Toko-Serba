// Manajemen Data Produk, Pesanan & Pengaturan Toko (Admin Panel)

const PRODUCTS_STORAGE_KEY = "nusantara_products";
const STORE_CONFIG_KEY = "nusantara_store_config";
const ORDERS_STORAGE_KEY = "nusantara_orders";

// Ambil Konfigurasi Toko
function getStoreConfig() {
  const data = localStorage.getItem(STORE_CONFIG_KEY);
  return data ? { ...DEFAULT_STORE_CONFIG, ...JSON.parse(data) } : { ...DEFAULT_STORE_CONFIG };
}

// Simpan Konfigurasi Toko
function saveStoreConfig(config) {
  localStorage.setItem(STORE_CONFIG_KEY, JSON.stringify(config));
  applyStoreConfig();
}

// Ambil Daftar Produk
function getProducts() {
  const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  return JSON.parse(data);
}

// Simpan Daftar Produk
function saveProducts(products) {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

// Tambah Produk Baru
function addProduct(productData) {
  const products = getProducts();
  const newProduct = {
    id: "prod-" + Date.now(),
    name: productData.name.trim(),
    category: productData.category.trim(),
    price: parseInt(productData.price, 10) || 0,
    originalPrice: parseInt(productData.originalPrice, 10) || parseInt(productData.price, 10) || 0,
    stock: parseInt(productData.stock, 10) || 0,
    rating: parseFloat(productData.rating) || 5.0,
    soldCount: 0,
    badge: productData.badge ? productData.badge.trim() : "",
    image: productData.image.trim() || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    description: productData.description.trim() || "Deskripsi produk belum ditambahkan.",
    featured: productData.featured || false
  };

  products.unshift(newProduct);
  saveProducts(products);
  return newProduct;
}

// Edit Produk
function updateProduct(productId, updatedData) {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) return false;

  products[index] = {
    ...products[index],
    name: updatedData.name.trim(),
    category: updatedData.category.trim(),
    price: parseInt(updatedData.price, 10) || products[index].price,
    originalPrice: parseInt(updatedData.originalPrice, 10) || products[index].price,
    stock: parseInt(updatedData.stock, 10) >= 0 ? parseInt(updatedData.stock, 10) : products[index].stock,
    badge: updatedData.badge ? updatedData.badge.trim() : "",
    image: updatedData.image.trim() || products[index].image,
    description: updatedData.description.trim() || products[index].description,
    featured: !!updatedData.featured
  };

  saveProducts(products);
  return true;
}

// Hapus Produk
function deleteProduct(productId) {
  let products = getProducts();
  products = products.filter((p) => p.id !== productId);
  saveProducts(products);
}

// Reset ke Data Awal / Demo
function resetToDefaultData() {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  localStorage.setItem(STORE_CONFIG_KEY, JSON.stringify(DEFAULT_STORE_CONFIG));
  localStorage.removeItem(ORDERS_STORAGE_KEY);
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(WISHLIST_STORAGE_KEY);
  localStorage.removeItem(APPLIED_COUPON_KEY);
}

// Riwayat Pesanan
function getOrders() {
  const data = localStorage.getItem(ORDERS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const target = orders.find((o) => o.id === orderId);
  if (target) {
    target.status = newStatus;
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }
}

// Terapkan Config Toko ke UI Frontend
function applyStoreConfig() {
  const config = getStoreConfig();

  // Nama Toko
  const storeNameEls = document.querySelectorAll(".store-name-display");
  storeNameEls.forEach((el) => {
    el.textContent = config.storeName;
  });

  // Tagline
  const taglineEls = document.querySelectorAll(".store-tagline-display");
  taglineEls.forEach((el) => {
    el.textContent = config.tagline;
  });

  // WhatsApp Link Floating Button
  const waBtn = document.getElementById("floating-wa-btn");
  if (waBtn) {
    waBtn.href = `https://wa.me/${config.phone}?text=${encodeURIComponent("Halo Admin " + config.storeName + ", saya ingin bertanya seputar produk.")}`;
  }

  // Kontak Toko di Footer
  const footerPhone = document.getElementById("footer-phone");
  if (footerPhone) footerPhone.textContent = `+${config.phone}`;
  const footerEmail = document.getElementById("footer-email");
  if (footerEmail) footerEmail.textContent = config.email;
  const footerAddress = document.getElementById("footer-address");
  if (footerAddress) footerAddress.textContent = config.address;
}
