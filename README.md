<div align="center">

<img src="frontend/public/dtech.png" alt="Dtech Logo" width="80" />

# Submission App

**A web-based procurement request system with real-time notifications and WhatsApp integration.**

Built with Laravel, React, Socket.io, and Go WhatsApp Web Multidevice.

[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=flat&logo=socket.io)](https://socket.io)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat&logo=mysql&logoColor=white)](https://mysql.com)

</div>

---

## ✨ Features

- 🔐 **Authentication** — Email/password login and Google OAuth
- 📝 **User Registration** — Self-registration for new users
- 📦 **Procurement Requests** — Submit detailed item requests including:
  - Item name, quantity & unit
  - Workshop & Division (dropdown)
  - Specifications, usage, and additional notes
  - Urgency level (Standard / Urgent / Emergency)
  - PIC & phone number
  - Reference link & image/PDF upload
- 📊 **Request History** — Users can track all their submission statuses
- 🚫 **Cancel Request** — Users can cancel pending submissions
- 🔔 **Real-time Notifications** — Status updates reflected instantly via Socket.io
- 📱 **WhatsApp Notifications** — Admins receive detailed WA notifications on every new request
- 🛡️ **Role-based Access** — Separate `user` and `admin` roles
- 🛠️ **Admin Dashboard** — Admins can:
  - View all submissions with full detail (modal popup)
  - Update submission status (`pending` → `review` → `approved` / `rejected`)
  - Manage Users — change roles, soft delete, restore
  - CRUD Workshops — add, edit, soft delete, restore
  - CRUD Divisions — add, edit, soft delete, restore

---

## 🗂️ Project Structure

```
new_project/
├── backend/                       # Laravel 11 — REST API
├── frontend/                      # React + Vite — SPA
├── socket-server/                 # Node.js + Socket.io — Realtime Server
└── go-whatsapp-web-multidevice/   # Go WhatsApp Web Multidevice — WA Gateway
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 11, Sanctum, MySQL |
| Frontend | React 18, Vite, Axios, Recharts |
| Realtime | Node.js, Socket.io |
| WA Gateway | Go WhatsApp Web Multidevice (Gowa) |
| Auth | Laravel Sanctum (token-based) + Google OAuth |

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following are installed:
- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL
- Docker & Docker Compose (for Gowa)

---

### 1. Clone the Repository

```bash
git clone https://github.com/FerryBastian/sistem-pengajuan-barang-whatsapp.git
cd sistem-pengajuan-barang-whatsapp
```

---

### 2. Backend Setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` with the following configuration:

```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
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

Run migrations and link storage:

```bash
php artisan migrate
php artisan db:seed     # creates default admin account
php artisan storage:link
php artisan config:clear
php artisan cache:clear
```

> **Note:** `php artisan storage:link` is required to make uploaded reference images publicly accessible.

---

### 3. Frontend Setup (React)

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_BACKEND_APP_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SOCKET_URL=http://localhost:3001
```

---

### 4. Socket Server Setup

```bash
cd ../socket-server
npm install
```

No additional configuration needed — the socket server runs on port `3001` by default.

---

### 5. Gowa Setup (WA Gateway)

```bash
cd ../go-whatsapp-web-multidevice
cp src/.env.example src/.env
```

Edit `src/.env`:

```env
APP_PORT=8111
APP_HOST=0.0.0.0
APP_BASIC_AUTH=user1:pass1
```

Start Gowa via Docker Compose:

```bash
docker compose up -d
```

Gowa will be available at `http://localhost:3000`. Open it in your browser and scan the QR code with the WhatsApp account to be used as the notification sender.

> **Note:** The exposed host port is `3000`, forwarded to `8111` inside the container. Make sure `GOWA_URL` in Laravel's `.env` is set to `http://localhost:3000`.

---

## 🚀 Running the Project

Run all four services simultaneously in separate terminals:

```bash
# Terminal 1 — Backend
cd backend && php artisan serve
# Running at http://localhost:8000

# Terminal 2 — Frontend
cd frontend && npm run dev
# Running at http://localhost:5173

# Terminal 3 — Socket Server
cd socket-server && node index.js
# Running at http://localhost:3001

# Terminal 4 — Gowa
cd go-whatsapp-web-multidevice && docker compose up -d
# Running at http://localhost:3000
```

Open your browser at `http://localhost:5173`.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `APP_URL` | Laravel application URL |
| `DB_DATABASE` | MySQL database name |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `GOOGLE_CLIENT_ID` | Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Client Secret from Google Cloud Console |
| `GOWA_URL` | Gowa running URL (default: `http://localhost:3000`) |
| `GOWA_ADMIN_PHONE` | Admin WA number for notifications (format: `628xxx`) |
| `GOWA_DEVICE_ID` | Sender device ID from Gowa |
| `GOWA_USERNAME` | Gowa basic auth username |
| `GOWA_PASSWORD` | Gowa basic auth password |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Laravel API base URL (e.g. `http://localhost:8000/api/v1`) |
| `VITE_BACKEND_APP_URL` | Backend URL for accessing file storage |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `VITE_SOCKET_URL` | Socket.io server URL (default: `http://localhost:3001`) |

### Gowa (`go-whatsapp-web-multidevice/src/.env`)

| Variable | Description |
|----------|-------------|
| `APP_PORT` | Internal container port (default: `8111`) |
| `APP_BASIC_AUTH` | Basic auth credentials (format: `user:pass`) |

---

## 📡 API Endpoints

Base URL: `http://localhost:8000/api/v1`

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Email/password login | ❌ |
| POST | `/oauth/google` | Google OAuth login | ❌ |
| POST | `/logout` | Logout | ✅ |
| GET | `/me` | Get authenticated user info | ✅ |

### Submissions (User)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/submit` | Submit a procurement request (multipart/form-data) | ✅ |
| GET | `/my-submissions` | Get all submissions by the logged-in user | ✅ |
| PATCH | `/submissions/{id}/cancel` | Cancel a pending submission | ✅ |

### Master Data (Public)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/workshops` | List active workshops (for dropdown) | ❌ |
| GET | `/divisions` | List active divisions (for dropdown) | ❌ |

### Admin — Submissions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/dashboard` | Dashboard statistics + chart data | ✅ Admin |
| GET | `/admin/submissions` | All submissions (with user, workshop, division) | ✅ Admin |
| PATCH | `/admin/submissions/{id}/status` | Update submission status + emit Socket.io | ✅ Admin |

### Admin — User Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/users` | All users (including soft deleted) | ✅ Admin |
| PATCH | `/admin/users/{id}/role` | Update user role | ✅ Admin |
| DELETE | `/admin/users/{id}` | Soft delete user | ✅ Admin |
| PATCH | `/admin/users/{id}/restore` | Restore deleted user | ✅ Admin |

### Admin — Workshop CRUD

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/workshops` | All workshops (including deleted) | ✅ Admin |
| POST | `/admin/workshops` | Create workshop | ✅ Admin |
| PUT | `/admin/workshops/{id}` | Update workshop | ✅ Admin |
| DELETE | `/admin/workshops/{id}` | Soft delete workshop | ✅ Admin |
| PATCH | `/admin/workshops/{id}/restore` | Restore workshop | ✅ Admin |

### Admin — Division CRUD

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/divisions` | All divisions (including deleted) | ✅ Admin |
| POST | `/admin/divisions` | Create division | ✅ Admin |
| PUT | `/admin/divisions/{id}` | Update division | ✅ Admin |
| DELETE | `/admin/divisions/{id}` | Soft delete division | ✅ Admin |
| PATCH | `/admin/divisions/{id}/restore` | Restore division | ✅ Admin |

---

## 🔔 Real-time Notification Flow (Socket.io)

```
Admin updates submission status
        ↓
Laravel updates status in database
        ↓
Laravel POST to Socket Server (http://localhost:3001/emit-status)
        ↓
Socket Server broadcasts 'notifikasi' event to all clients
        ↓
User's browser receives the event
        ↓
Status updates instantly + 🔔 notification appears without refresh
```

---

## 📱 WhatsApp Notification Flow

```
User submits a request
        ↓
Laravel validates & saves to database
        ↓
Uploads reference file to storage (if any)
        ↓
Laravel sends request to Gowa API
        ↓
Gowa sends WA message to admin number
        ↓
Admin receives full WA notification
(name, workshop, division, urgency, reference link, etc.)
```

Example WA message received by admin:

```
📦 NEW PROCUREMENT REQUEST

*Submitted by:* John Doe
*Email:* john@email.com
*Phone:* 08123456789
*Workshop:* Workshop A
*Division:* Division B
*Item:* Dell Laptop
*Quantity:* 1 unit
*Urgency:* 🔴 Emergency
*PIC:* Jane Doe
*Usage:* For daily work operations
*Specs:* 16GB RAM, 512GB SSD
*Notes:* -
*Reference:* https://tokopedia.com/...

*Date:* 7 March 2026, 02:17
*Request ID:* #1
```

---

## 👤 Role Management

Roles are managed via Laravel Tinker after migration, or through the Admin Dashboard UI.

```bash
php artisan tinker
```

```php
// Set user as admin
\App\Models\User::where('email', 'admin@email.com')->update(['role' => 'admin']);

// Set user back to regular user
\App\Models\User::where('email', 'user@email.com')->update(['role' => 'user']);
```

The default admin account created by seeder:
- **Email:** `admin@dtech.com`
- **Password:** `admin123`

> ⚠️ Change the default password immediately after first login in production.

---

## 📦 Request Submission Fields

Requests are submitted using `multipart/form-data` to support file uploads:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `workshop_id` | integer | ❌ | Workshop ID from dropdown |
| `division_id` | integer | ❌ | Division ID from dropdown |
| `title` | string | ✅ | Item name |
| `quantity` | integer | ✅ | Quantity |
| `unit` | string | ❌ | Unit (default: `pcs`) |
| `spesifikasi` | string | ❌ | Technical specifications |
| `kegunaan` | string | ✅ | Usage / purpose |
| `content` | string | ❌ | Additional notes |
| `urgency` | enum | ✅ | `standart` / `urgent` / `emergency` |
| `pic` | string | ✅ | Person in charge |
| `nomor_telepon` | string | ❌ | PIC phone number |
| `referensi_link` | url | ❌ | Reference link |
| `referensi_gambar` | file | ❌ | Image/PDF reference (max 10MB) |

---

## 🔧 Google OAuth Setup

To enable Google login, add the following to **Google Cloud Console → Credentials → Authorized JavaScript Origins**:

```
http://localhost:5173
http://localhost:5174
http://localhost:5175
```

Add test accounts to **OAuth consent screen → Test Users** while in testing mode.

---

## 📄 License

MIT License — free to use and modify.