# 📦 Submission App

Aplikasi pengajuan barang berbasis web dengan notifikasi WhatsApp otomatis. Dibangun menggunakan **Laravel** (backend), **React + Vite** (frontend), dan **Go WhatsApp Web Multidevice** (WA gateway).

---

## ✨ Fitur

- 🔐 **Autentikasi** — Login manual (email/password) dan Login dengan Google OAuth
- 📝 **Registrasi User** — User baru dapat mendaftar secara mandiri
- 📦 **Pengajuan Barang** — User dapat mengajukan barang dengan detail lengkap:
  - Nama barang, jumlah & satuan
  - Workshop & Divisi (dropdown)
  - Spesifikasi, kegunaan, keterangan tambahan
  - Tingkat urgensi (Standart / Urgent / Emergency)
  - PIC & nomor telepon
  - Referensi link & upload gambar/PDF referensi
- 📊 **Riwayat Pengajuan** — User dapat melihat status semua pengajuan miliknya
- 📱 **Notifikasi WhatsApp Otomatis** — Setiap pengajuan masuk, admin langsung mendapat notifikasi WA lengkap via Gowa (self-hosted)
- 🛡️ **Role-based Access** — Role `user` dan `admin` dengan akses berbeda
- 🛠️ **Admin Dashboard** — Admin dapat:
  - Melihat semua pengajuan dengan detail lengkap (modal popup)
  - Mengubah status pengajuan (pending → review → approved / rejected)
  - CRUD Workshop — tambah, edit, hapus (soft delete), pulihkan
  - CRUD Divisi — tambah, edit, hapus (soft delete), pulihkan

---

## 🗂️ Struktur Folder

```
monorepo/
├── backend/        # Laravel 11 — REST API
├── frontend/       # React + Vite — SPA
└── gowa/           # Go WhatsApp Web Multidevice — WA Gateway
```

---

## 🛠️ Teknologi

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 11, Sanctum, MySQL |
| Frontend | React 18, Vite, Tailwind CSS, Axios |
| WA Gateway | Go WhatsApp Web Multidevice (Gowa) |
| Auth | Laravel Sanctum (token-based) + Google OAuth |

---

## ⚙️ Cara Install & Setup

### Prasyarat

Pastikan sudah terinstall:
- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL
- Docker & Docker Compose (untuk Gowa)

---

### 1. Clone Repository

```bash
git clone https://github.com/FerryBastian/proyek_magang.git
cd proyek_magang
```

---

### 2. Setup Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit file `.env` sesuai konfigurasi berikut:

```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=root
DB_PASSWORD=

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URL=http://localhost:8000/auth/google/callback

# Gowa WhatsApp Gateway
GOWA_URL=http://localhost:3000
GOWA_ADMIN_PHONE=628xxxxxxxxxx
GOWA_DEVICE_ID=62xxxxxxxxxx@s.whatsapp.net
GOWA_USERNAME=user1
GOWA_PASSWORD=pass1
```

Jalankan migrasi dan storage link:

```bash
php artisan migrate
php artisan storage:link
php artisan config:clear
php artisan cache:clear
```

> **Catatan:** `php artisan storage:link` wajib dijalankan agar file upload referensi gambar bisa diakses publik.

---

### 3. Setup Frontend (React)

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit file `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_BACKEND_APP_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

### 4. Setup Gowa (WA Gateway)

```bash
cd ../gowa
cp src/.env.example src/.env
```

Edit file `src/.env` Gowa:

```env
APP_PORT=8111
APP_HOST=0.0.0.0
APP_BASIC_AUTH=user1:pass1
```

Jalankan Gowa via Docker Compose:

```bash
docker compose up -d
```

Gowa akan berjalan di `http://localhost:3000`. Buka di browser, lalu scan QR code dengan WhatsApp yang akan digunakan sebagai pengirim notifikasi.

> **Catatan:** Port yang diekspos adalah `3000` (host) yang diteruskan ke `8111` (container). Pastikan `GOWA_URL` di `.env` Laravel diisi `http://localhost:3000`.

---

## 🚀 Cara Menjalankan Project

Jalankan ketiga service secara bersamaan di terminal terpisah:

**Terminal 1 — Backend:**
```bash
cd backend
php artisan serve
# Berjalan di http://localhost:8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Berjalan di http://localhost:5173
```

**Terminal 3 — Gowa:**
```bash
cd gowa
docker compose up -d
# Berjalan di http://localhost:3000
```

Buka browser ke `http://localhost:5173`.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Keterangan |
|----------|------------|
| `APP_URL` | URL aplikasi Laravel |
| `DB_DATABASE` | Nama database MySQL |
| `DB_USERNAME` | Username database |
| `DB_PASSWORD` | Password database |
| `GOOGLE_CLIENT_ID` | Client ID dari Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Client Secret dari Google Cloud Console |
| `GOWA_URL` | URL Gowa yang berjalan (default: `http://localhost:3000`) |
| `GOWA_ADMIN_PHONE` | Nomor WA admin penerima notifikasi (format: `628xxx`) |
| `GOWA_DEVICE_ID` | Device ID nomor WA pengirim dari Gowa |
| `GOWA_USERNAME` | Username basic auth Gowa |
| `GOWA_PASSWORD` | Password basic auth Gowa |

### Frontend (`frontend/.env`)

| Variable | Keterangan |
|----------|------------|
| `VITE_API_BASE_URL` | Base URL API Laravel (contoh: `http://localhost:8000/api/v1`) |
| `VITE_BACKEND_APP_URL` | URL backend untuk akses file storage |
| `VITE_GOOGLE_CLIENT_ID` | Client ID Google OAuth |

### Gowa (`gowa/src/.env`)

| Variable | Keterangan |
|----------|------------|
| `APP_PORT` | Port internal container Gowa (default: `8111`) |
| `APP_BASIC_AUTH` | Kredensial basic auth (format: `user:pass`) |

> Port yang diekspos ke host adalah `3000` sesuai konfigurasi `docker-compose.yml`.

---

## 📡 API Endpoints

Base URL: `http://localhost:8000/api/v1`

### Auth

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/register` | Registrasi user baru | ❌ |
| POST | `/login` | Login email/password | ❌ |
| POST | `/oauth/google` | Login dengan Google | ❌ |
| POST | `/logout` | Logout | ✅ |
| GET | `/me` | Info user yang login | ✅ |

### Submissions (User)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/submit` | Kirim pengajuan barang (multipart/form-data) | ✅ |
| GET | `/my-submissions` | Daftar pengajuan milik user | ✅ |

### Master Data (Public)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/workshops` | Daftar workshop aktif (untuk dropdown) | ❌ |
| GET | `/divisions` | Daftar divisi aktif (untuk dropdown) | ❌ |

### Admin — Submissions

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/admin/dashboard` | Statistik dashboard admin | ✅ Admin |
| GET | `/admin/submissions` | Semua pengajuan (with user, workshop, division) | ✅ Admin |
| PATCH | `/admin/submissions/{id}/status` | Update status pengajuan | ✅ Admin |

### Admin — Workshop CRUD

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/admin/workshops` | Semua workshop (termasuk yang dihapus) | ✅ Admin |
| POST | `/admin/workshops` | Tambah workshop baru | ✅ Admin |
| PUT | `/admin/workshops/{id}` | Edit workshop | ✅ Admin |
| DELETE | `/admin/workshops/{id}` | Hapus workshop (soft delete) | ✅ Admin |
| PATCH | `/admin/workshops/{id}/restore` | Pulihkan workshop yang dihapus | ✅ Admin |

### Admin — Divisi CRUD

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/admin/divisions` | Semua divisi (termasuk yang dihapus) | ✅ Admin |
| POST | `/admin/divisions` | Tambah divisi baru | ✅ Admin |
| PUT | `/admin/divisions/{id}` | Edit divisi | ✅ Admin |
| DELETE | `/admin/divisions/{id}` | Hapus divisi (soft delete) | ✅ Admin |
| PATCH | `/admin/divisions/{id}/restore` | Pulihkan divisi yang dihapus | ✅ Admin |

---

## 👤 Manajemen Role

Role user di-set manual via Laravel Tinker setelah migrasi:

```bash
php artisan tinker
```

```php
// Set user sebagai admin
\App\Models\User::where('email', 'emailadmin@gmail.com')->update(['role' => 'admin']);

// Set user kembali ke user biasa
\App\Models\User::where('email', 'email@gmail.com')->update(['role' => 'user']);
```

---

## 📦 Format Pengajuan Barang

Form pengajuan dikirim menggunakan `multipart/form-data` karena mendukung upload file. Field yang tersedia:

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| `workshop_id` | integer | ❌ | ID workshop dari dropdown |
| `division_id` | integer | ❌ | ID divisi dari dropdown |
| `title` | string | ✅ | Nama barang |
| `quantity` | integer | ✅ | Jumlah barang |
| `unit` | string | ❌ | Satuan (default: `pcs`) |
| `spesifikasi` | string | ❌ | Spesifikasi teknis barang |
| `kegunaan` | string | ✅ | Kegunaan barang |
| `content` | string | ❌ | Keterangan tambahan |
| `urgency` | enum | ✅ | `standart` / `urgent` / `emergency` |
| `pic` | string | ✅ | Nama penanggung jawab |
| `nomor_telepon` | string | ❌ | Nomor telepon PIC |
| `referensi_link` | url | ❌ | Link referensi barang |
| `referensi_gambar` | file | ❌ | Gambar/PDF referensi (max 10MB) |

---

## 📱 Alur Notifikasi WhatsApp

```
User submit pengajuan
        ↓
Laravel validasi & simpan ke database
        ↓
Upload file referensi ke storage (jika ada)
        ↓
Laravel kirim request ke Gowa API
        ↓
Gowa kirim pesan WA ke nomor admin
        ↓
Admin menerima notifikasi WA lengkap
(nama, workshop, divisi, urgensi, referensi link, dll)
```

Contoh pesan WA yang diterima admin:

```
📦 PENGAJUAN BARANG BARU

*Pengaju:* Nama User
*Email:* user@email.com
*No. Telp:* 08123456789
*Workshop:* Workshop A
*Divisi:* Divisi B
*Nama Barang:* Laptop Dell
*Jumlah:* 1 buah
*Urgensi:* 🔴 Emergency
*PIC:* Nama PIC
*Kegunaan:* Untuk keperluan kerja
*Spesifikasi:* RAM 16GB, SSD 512GB
*Keterangan:* -
*Referensi:* https://tokopedia.com/...

*Tanggal:* 7 Maret 2026, 02:17
*ID Pengajuan:* #1
```

---

## 🔧 Google OAuth Setup

Agar login Google berfungsi, tambahkan origins berikut di **Google Cloud Console → Credentials → Authorized JavaScript Origins**:

```
http://localhost:5173
http://localhost:5174
http://localhost:5175
```

Dan tambahkan akun email ke **OAuth consent screen → Test Users** selama masih dalam mode testing.

---

## 📄 Lisensi

MIT License — bebas digunakan dan dimodifikasi.