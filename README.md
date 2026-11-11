# 🛍️ NusantaraStore - Website Toko Online Modern & Responsif

Website e-commerce siap pakai yang dirancang khusus untuk kemudahan transaksi jual beli di Indonesia. Dilengkapi integrasi pemesanan langsung ke **WhatsApp**, struk/faktur digital (invoice), manajemen keranjang belanja, kupon diskon, serta **Dashboard Admin** untuk mengelola produk dan pengaturan toko.

---

## ✨ Fitur Unggulan

1. **Katalog Produk & Kategori Lengkap**
   - Filter berdasarkan kategori (*Fashion, Gadget, Kuliner, Skincare, Rumah Tangga*).
   - Pencarian instan (*live search*) & pengurutan harga (*termurah, termahal, terpopuler, rating*).
   - Label badge otomatis (*Terlaris, Diskon %, Stok Menipis*).
   - Modal *Quick View* (lihat detail produk, rating, ulasan, dan spesifikasi tanpa reload halaman).

2. **Keranjang Belanja Pintar (*Cart Drawer*)**
   - Tambah, kurangi, dan hapus kuantitas secara real-time.
   - Perhitungan subtotal, estimasi ongkir, dan diskon kupon otomatis.
   - Disimpan secara lokal di browser (*LocalStorage*), sehingga keranjang tidak hilang saat halaman di-refresh.

3. **Sistem Kupon Diskon**
   - Kode bawaan:
     - `DISKON10` (Potongan 10%)
     - `HEMAT25` (Potongan Rp 25.000)
     - `GRATISONGKIR` (Subsidi Ongkir Rp 15.000)
   - Tombol 1-klik untuk menyalin kode voucher.

4. **Integrasi Checkout WhatsApp & Faktur Digital**
   - **Order via WhatsApp**: Otomatis menyusun pesan pemesanan yang sangat rapi lengkap dengan nomor pesanan, daftar barang, ongkos kirim, nama & alamat pembeli, serta metode bayar.
   - **Faktur Digital / Cetak Nota**: Membuat struk pembelian digital dengan format invoice resmi yang bisa langsung dicetak (*print*) atau disimpan sebagai PDF.
   - Pilihan metode bayar: QRIS, Transfer Bank (BCA, Mandiri, BRI), atau COD (Bayar di Tempat).

5. **Mode Admin / Dashboard Pengelola Toko**
   - Akses aman dengan PIN (Default PIN: `1234`).
   - **Katalog Produk**: Tambah produk baru, edit harga/stok/gambar, atau hapus produk.
   - **Pesanan Masuk**: Pantau daftar pesanan yang masuk dan ubah status (*Menunggu Pembayaran, Diproses, Dikirim, Selesai*).
   - **Pengaturan Toko**: Ubah nama toko, nomor WhatsApp penjual, nomor rekening bank, dan alamat toko langsung dari antarmuka web.

6. **Desain Mobile-First & Responsif**
   - Navigasi bawah (*bottom bar*) ala aplikasi mobile saat dibuka di smartphone.
   - Tampilan bersih, elegan, dan cepat berkat Tailwind CSS & Lucide Icons.

---

## 🚀 Cara Menjalankan Website

### Opsi 1: Buka Langsung di Browser (Paling Praktis)
Cukup klik dua kali (double-click) file:
```text
C:\Users\DEDY WAHYU ANUGRAH S\.gemini\antigravity\scratch\online-shop\index.html
```
Website akan langsung terbuka di browser (Chrome, Edge, Firefox) tanpa perlu instalasi apapun!

### Opsi 2: Jalankan Melalui Server Python
Jika Anda ingin menjalankannya melalui web server lokal:
1. Buka terminal / PowerShell di folder proyek:
   ```powershell
   cd "C:\Users\DEDY WAHYU ANUGRAH S\.gemini\antigravity\scratch\online-shop"
   ```
2. Jalankan perintah:
   ```powershell
   python server.py
   ```
3. Browser akan otomatis terbuka ke alamat `http://localhost:8000`.

---

## 📁 Struktur File Proyek

```text
online-shop/
├── index.html                 # Halaman utama toko online
├── server.py                  # Skrip server lokal Python (opsional)
├── README.md                  # Dokumentasi panduan
└── assets/
    ├── css/
    │   └── style.css          # Styling kustom, animasi & cetak invoice
    └── js/
        ├── data.js            # Data awal produk, toko, dan kupon
        ├── cart.js            # Manajemen keranjang belanja & wishlist
        ├── checkout.js        # Logika checkout, WA formatting & faktur
        ├── admin.js           # Logika dashboard admin & pengaturan
        └── app.js             # Kontroler UI, filter katalog & interaksi
```

---

## ⚙️ Cara Mengubah Nomor WhatsApp Penjual

Anda dapat mengganti nomor WhatsApp tujuan order dengan 2 cara:

1. **Melalui Antarmuka Website (Tanpa Koding)**:
   - Klik tombol **Mode Admin** di sudut kanan atas header.
   - Masukkan PIN: `1234`.
   - Pilih tab **Pengaturan Toko**.
   - Ganti nomor WhatsApp pada kolom yang tersedia (gunakan format `628xxxxxxxxxx`), lalu klik **Simpan Perubahan**.

2. **Melalui File Konfigurasi**:
   - Buka file `assets/js/data.js`.
   - Ubah nilai `phone` pada objek `DEFAULT_STORE_CONFIG`:
     ```javascript
     phone: "6281234567890", // Ganti dengan nomor WhatsApp Anda
     ```

---

## 🌐 Publikasi ke Internet (Online Gratis)
Website ini bersifat statis (*front-end only*), sehingga Anda dapat meng-online-kannya secara gratis melalui:
- **GitHub Pages** (Drag & drop atau git push)
- **Vercel** / **Netlify** (Tinggal upload folder `online-shop`)
- **Cloudflare Pages**
