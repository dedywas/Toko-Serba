// Data Toko & Produk Default
const DEFAULT_STORE_CONFIG = {
  storeName: "NusantaraStore",
  tagline: "Pilihan Belanja Cerdas & Berkualitas",
  phone: "6281234567890", // Ganti dengan nomor WhatsApp penjual (format internasional tanpa tanda +)
  email: "halo@nusantarastore.com",
  address: "Grand Indonesia Lt. 3, Jl. M.H. Thamrin No. 1, Jakarta Pusat",
  bankName: "BCA",
  bankAccount: "8830-1234-5678",
  bankHolder: "PT NUSANTARA KREASI STORE",
  adminPin: "1234", // PIN untuk masuk ke panel admin penjual
  currency: "IDR"
};

const DEFAULT_COUPONS = [
  { code: "DISKON10", type: "percent", value: 10, minPurchase: 50000, label: "Diskon 10% (Min. Rp 50.000)" },
  { code: "HEMAT25", type: "fixed", value: 25000, minPurchase: 100000, label: "Potongan Rp 25.000 (Min. Rp 100.000)" },
  { code: "GRATISONGKIR", type: "fixed", value: 15000, minPurchase: 75000, label: "Subsidi Ongkir Rp 15.000" }
];

const SHIPPING_OPTIONS = [
  { id: "jne-reg", name: "JNE Reguler (2-3 hari)", price: 12000 },
  { id: "jnt-exp", name: "J&T Express (1-2 hari)", price: 14000 },
  { id: "sicepat", name: "SiCepat Best (1-2 hari)", price: 15000 },
  { id: "gosend", name: "GoSend Instant (Hari Ini)", price: 25000 }
];

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Kemeja Linen Casual Pria - Earth Tone",
    category: "Fashion",
    price: 185000,
    originalPrice: 249000,
    stock: 24,
    rating: 4.9,
    soldCount: 342,
    badge: "Terlaris",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    description: "Kemeja bahan 100% linen premium yang lembut, sejuk dipakai di iklim tropis, dan berpotongan loose-fit modern. Cocok untuk acara santai, hangout, maupun semi-formal.",
    featured: true
  },
  {
    id: "prod-2",
    name: "Smartwatch Active Pro AMOLED Display",
    category: "Gadget",
    price: 499000,
    originalPrice: 750000,
    stock: 15,
    rating: 4.8,
    soldCount: 215,
    badge: "Diskon 33%",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
    description: "Jam tangan pintar dengan layar AMOLED jernih, tahan air 5ATM, pemantau detak jantung, SpO2, dan notifikasi WhatsApp langsung di pergelangan tangan.",
    featured: true
  },
  {
    id: "prod-3",
    name: "Biji Kopi Arabika Gayo Single Origin 250g",
    category: "Kuliner",
    price: 75000,
    originalPrice: 90000,
    stock: 50,
    rating: 5.0,
    soldCount: 520,
    badge: "Favorit",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80",
    description: "Kopi Arabika murni dari dataran tinggi Takengon Aceh Gayo. Dipanggang medium roast dengan aroma floral yang semerbak dan acidity yang seimbang.",
    featured: true
  },
  {
    id: "prod-4",
    name: "Tas Ransel Urban Waterproof Laptop 15.6 inch",
    category: "Fashion",
    price: 299000,
    originalPrice: 389000,
    stock: 18,
    rating: 4.9,
    soldCount: 189,
    badge: "Stok Menipis",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    description: "Ransel ergonomis dengan lapisan anti air (water repellent), kompartemen busa khusus laptop 15.6 inci, dan port charger USB eksternal.",
    featured: false
  },
  {
    id: "prod-5",
    name: "Serum Wajah Glowing Niacinamide 10% + Zinc",
    category: "Skincare",
    price: 98000,
    originalPrice: 125000,
    stock: 40,
    rating: 4.8,
    soldCount: 680,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    description: "Formula mencerahkan noda hitam bekas jerawat, mengontrol sebum berlebih, dan meratakan warna kulit wajah dalam 14 hari pemakaian rutin.",
    featured: true
  },
  {
    id: "prod-6",
    name: "TWS Earbuds Bluetooth 5.3 ANC Noise Cancelling",
    category: "Gadget",
    price: 320000,
    originalPrice: 450000,
    stock: 22,
    rating: 4.7,
    soldCount: 145,
    badge: "Diskon 28%",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    description: "Earphone nirkabel dengan Active Noise Cancellation, bass bertenaga, latency rendah untuk gaming, dan daya tahan baterai hingga 30 jam dengan casing.",
    featured: true
  },
  {
    id: "prod-7",
    name: "Blouse Rajut Knit Wanita Korean Style",
    category: "Fashion",
    price: 145000,
    originalPrice: 195000,
    stock: 35,
    rating: 4.9,
    soldCount: 412,
    badge: "Tren Baru",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80",
    description: "Bahan rajut premium yang stretch, tidak gatal di kulit, dan adem. Model kerah V-neck yang anggun cocok dipadukan dengan celana kulot maupun rok.",
    featured: false
  },
  {
    id: "prod-8",
    name: "Sunscreen Gel SPF 50+ PA++++ No Whitecast",
    category: "Skincare",
    price: 85000,
    originalPrice: 105000,
    stock: 60,
    rating: 4.9,
    soldCount: 890,
    badge: "Wajib Punya",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    description: "Tabir surya bertekstur seringan air tanpa rasa lengket, cepat meresap, dan aman untuk kulit sensitif maupun berjerawat.",
    featured: false
  },
  {
    id: "prod-9",
    name: "Aroma Diffuser Ultrasonic Humidifier 500ml",
    category: "Rumah Tangga",
    price: 165000,
    originalPrice: 220000,
    stock: 28,
    rating: 4.8,
    soldCount: 310,
    badge: "Diskon 25%",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
    description: "Pelembab udara ruangan dengan lampu LED 7 warna dan fitur timer. Memberikan sensasi relaksasi spa di kamar tidur atau ruang kerja Anda.",
    featured: false
  },
  {
    id: "prod-10",
    name: "Madu Hutan Liar Murni Organik 500g",
    category: "Kuliner",
    price: 110000,
    originalPrice: 135000,
    stock: 45,
    rating: 5.0,
    soldCount: 420,
    badge: "100% Asli",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80",
    description: "Madu murni alami yang dipanen langsung dari sarang lebah hutan liar Sumatera tanpa tambahan gula sintetis atau pemanis buatan.",
    featured: false
  },
  {
    id: "prod-11",
    name: "Sepatu Sneakers Canvas Minimalist Unisex",
    category: "Fashion",
    price: 265000,
    originalPrice: 350000,
    stock: 20,
    rating: 4.8,
    soldCount: 275,
    badge: "Populer",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80",
    description: "Sneakers kanvas bertapak empuk dengan insole memory foam. Desain clean dan timeless yang cocok untuk pria maupun wanita.",
    featured: true
  },
  {
    id: "prod-12",
    name: "Keyboard Mekanikal Wireless RGB 75% Layout",
    category: "Gadget",
    price: 580000,
    originalPrice: 799000,
    stock: 12,
    rating: 4.9,
    soldCount: 160,
    badge: "Diskon 27%",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    description: "Keyboard mekanik dengan hot-swappable switch, koneksi Bluetooth + 2.4Ghz dongle + kabel Type-C, serta backlight RGB 16 juta warna.",
    featured: true
  }
];
