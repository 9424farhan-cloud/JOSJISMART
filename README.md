# JOSJISMART 🌊🏝️
> **Modern Tropical Ocean E-Commerce Store**  
> Toko online pribadi terkurasi bernuansa Blue Ocean & Tropical Beach dengan sistem Role-Based Access Control (Admin & Google Viewer).

---

## 🌟 Gambaran Umum

**JOSJISMART** adalah platform e-commerce personal yang didesain secara khusus untuk memberikan pengalaman berbelanja online yang segar, tenang, dan bersahaja layaknya hembusan angin pantai tropis. Setiap produk di toko ini dikurasi langsung oleh pemilik toko (**Gaza admin**), tanpa deskripsi otomatis buatan AI, sehingga seluruh spesifikasi, harga, stok, dan foto barang dapat diandalkan secara riil.

### 🔑 Dua Jenis Hak Akses (Role-Based Access Control):
1. **ADMIN (`Gaza admin`)**:
   - Memiliki otorisasi penuh melalui autentikasi aman (password hashing & protected routes).
   - Akses penuh ke **Admin Dashboard**:
     - Kelola Katalog Produk (Tambah, Edit, Hapus, Quick Stock Update, Galeri Foto, Spesifikasi, Varian).
     - Kelola Kategori Barang (Tambah, Edit, Hapus).
     - Kelola Pesanan Pembeli (Ubah status: *Menunggu*, *Diproses*, *Dikirim*, *Selesai*, *Dibatalkan*, cetak rincian invoice).
     - Kelola Banner & Promosi (Atur teks hero utama, ganti background pantai, kode kupon diskon).
     - Pengaturan Toko & Manajemen Database (Profil toko, WhatsApp admin, opsi reset demo/bersihkan data).
2. **GOOGLE VIEWER (`Role: VIEWER`)**:
   - Masuk menggunakan akun Google.
   - Hak akses dibatasi secara *server/service level* hanya untuk:
     - Menjelajahi Beranda, Katalog Produk, dan Kategori.
     - Pencarian realtime & multi-filter.
     - Melihat foto detail, spesifikasi, dan deskripsi produk.
     - Menambahkan barang ke Keranjang & Wishlist.
     - Melakukan simulasi checkout & membuat pesanan.
     - Melihat riwayat pesanan akun sendiri.
   - **Dilarang keras**: Mengubah database, membuka dashboard admin, mengubah harga, stok, atau status pesanan.

---

## 🎨 Identitas Visual: Blue Ocean & Tropical Beach

- **Primary**: Ocean Blue (`#0284c7`, `#0369a1`)
- **Secondary**: Aqua / Turquoise (`#0d9488`, `#14b8a6`)
- **Background**: Soft White / Very Light Blue (`#f8fafc` / `#0b1528` pada Dark Mode)
- **Accent**: Sand Beige (`#e8decb`, `#d4a373`)
- **Highlight**: Subtle Sunset Orange (`#f97316`)
- **Desain Natural**: Menghindari neon berlebihan, glow artifisial, atau glassmorphism berulang. Menjaga fokus utama pada foto produk dan kenyamanan navigasi.
- **Wave Transition**: Transisi SVG ombak yang halus dan ringan dari Hero section ke konten produk.

---

## 🚀 Fitur Unggulan

- ⚡ **Pencarian Realtime & Filter Canggih**: Cari berdasarkan nama produk, kategori, atau deskripsi. Filter berdasarkan harga terendah/tertinggi, terpopuler, terbaru, dan ketersediaan stok.
- 🛍️ **Keranjang Belanja Interaktif**: Perhitungan subtotal instan, kontrol kuantitas (+/-), dan indikator sisa stok.
- 📦 **Checkout & Simulasi Pembayaran**: Pilihan kurir domestik (JNE, SiCepat, J&T, Pos Indonesia), kupon promo diskon (`SEABREEZE`), dan simulasi metode pembayaran (BCA, QRIS, COD).
- 💬 **Konfirmasi WhatsApp Otomatis**: Integrasi format pesan WhatsApp langsung ke nomor admin Gaza setelah pesanan dibuat.
- 🌙 **Dark Mode Terintegrasi**: Tema malam bernuansa Deep Oceanic Slate Navy yang nyaman di mata dengan kontras tinggi.
- 📱 **Desain 100% Responsif**: Tampilan grid adaptif (2 kolom di mobile, 3-4 kolom di desktop), mobile bottom drawer, dan bebas overflow horizontal.
- 🔒 **Keamanan & Validasi**:
  - Validasi tipe file dan ukuran foto unggahan (maks. 3MB, format JPG/PNG/WebP).
  - Password admin diverifikasi via Web Crypto SHA-256 dan token sesi aman.
  - Nilai rahasia disimpan dalam `.env` (tidak di-commit ke Git).

---

## 📂 Struktur Proyek

```
josjismart/
├── .env.example              # Panduan variabel lingkungan
├── .gitignore                 # Konfigurasi file yang diabaikan Git
├── index.html                 # Entry point HTML & font Plus Jakarta Sans
├── package.json               # Konfigurasi dependensi & skrip Vite
├── tailwind.config.js         # Konfigurasi tema warna Blue Ocean
├── tsconfig.json              # Konfigurasi TypeScript
├── vite.config.ts             # Konfigurasi bundler Vite
└── src/
    ├── types/                 # Definisi tipe TypeScript
    ├── utils/                 # Format rupiah, berat, slugify, & SHA-256
    ├── data/                  # Data awal demo 10 produk tropis & kategori
    ├── services/              # Service layer (Storage, Auth, Product, Category, Order, Banner)
    ├── context/               # React Context (Auth, Cart, Wishlist, Theme, Toast)
    ├── components/
    │   ├── common/            # Header, Footer, WaveDivider, ToastContainer
    │   ├── shop/              # Hero, ProductCard, DetailModal, CartDrawer, Checkout, AuthModal
    │   └── admin/             # Sidebar, DashboardView, ProductsView, FormModal, OrdersView, SettingsView
    ├── pages/                 # HomePage, ProductsPage, AboutPage, AdminPage
    ├── App.tsx                # Komponen utama & router navigasi
    ├── main.tsx               # Bootstrapping React DOM
    └── index.css              # Custom styling & Tailwind directives
```

---

## 🛠️ Panduan Instalasi & Menjalankan Lokal

### 1. Prasyarat
- Node.js (v18 atau lebih baru)
- npm / pnpm / yarn

### 2. Salin Repositori & Pasang Dependensi
```bash
git clone <url-repo-anda>
cd JOSJISMART
npm install
```

### 3. Konfigurasi Environment Variables
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi kredensial admin Anda:
```env
VITE_ADMIN_USERNAME="Gaza admin"
VITE_ADMIN_PASSWORD="GazaAdmin123!"
VITE_STORE_NAME="JOSJISMART"
VITE_STORE_PHONE="+6281234567890"
VITE_STORE_CITY="Pesisir Tropis"
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser di `http://localhost:5173/`.

### 5. Bangun Versi Produksi
```bash
npm run build
```
Hasil build siap disajikan di folder `dist/`.

---

## 🔐 Kredensial Default Pengujian

| Tipe Akun | Identitas | Kredensial | Hak Akses |
|---|---|---|---|
| **Admin** | `Gaza admin` | `GazaAdmin123!` | Akses penuh dashboard, CRUD produk, pesanan, banner |
| **Google Viewer** | Akun Google | 1-Klik Masuk Google | Jelajah produk, keranjang, checkout, wishlist |

---

## 📄 Lisensi
Hak Cipta © 2026 JOSJISMART. Seluruh hak cipta dilindungi undang-undang.
