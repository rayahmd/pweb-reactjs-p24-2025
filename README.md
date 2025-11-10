# 📚 IT Literature - Sistem Manajemen Buku Digital

Aplikasi web untuk mengelola koleksi buku IT dengan fitur authentication, CRUD buku, manajemen genre, dan sistem transaksi.

---

## ⚠️ PENTING: Cara Menjalankan Aplikasi

**Aplikasi ini terdiri dari 2 bagian yang HARUS dijalankan bersamaan:**

1. **Backend** (Express.js + Prisma + PostgreSQL) - Port 8080
2. **Frontend** (React + Vite + TypeScript) - Port 5173

### 🚀 Quick Start

**Terminal 1 - Backend:**
```bash
cd pweb-express-p24-2025
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd pweb-reactjs-p24-2025
pnpm run dev
```

📖 **Panduan Lengkap:**
- [CARA_MENJALANKAN.md](./CARA_MENJALANKAN.md) - Tutorial step-by-step dengan diagram
- [QUICK_START.md](./QUICK_START.md) - Testing & validasi fitur
- [README_SETUP.md](./README_SETUP.md) - Setup database & troubleshooting

---

## 🎯 Fitur Utama

### 1. Authentication
- ✅ Register user baru
- ✅ Login dengan JWT token
- ✅ Logout
- ✅ Protected routes

### 2. Manajemen Buku
- ✅ Lihat daftar buku (dengan pagination & search)
- ✅ Tambah buku baru (dengan cover URL)
- ✅ Edit informasi buku
- ✅ Detail buku
- ✅ Filter berdasarkan genre & kondisi
- ✅ Validasi tahun terbit (maksimal 2025)
- ✅ Validasi harga & stok (tidak boleh negatif)

### 3. Manajemen Genre
- ✅ Lihat daftar genre
- ✅ Tambah genre baru
- ✅ Edit genre
- ✅ Hapus genre (jika tidak ada buku terkait)

### 4. Transaksi
- ✅ Checkout buku
- ✅ Riwayat transaksi user
- ✅ Detail transaksi dengan item

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI Library
- **TypeScript 5.9.3** - Type Safety
- **Vite 7.2.2** - Build Tool & Dev Server
- **TailwindCSS 4.1.17** - Styling
- **React Router 7.1.1** - Navigation
- **Axios** - HTTP Client

### Backend
- **Express.js 4.18.2** - Web Framework
- **Prisma 6.17.1** - ORM
- **PostgreSQL (Neon)** - Database
- **JWT** - Authentication
- **TypeScript 5.9.3**

---

## 📁 Struktur Project

```
pweb-reactjs-p24-2025/
├── pweb-express-p24-2025/          # Backend
│   ├── src/
│   │   ├── modules/                # Controllers & Routes
│   │   ├── middleware/             # Auth, Validation
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma           # Database Schema
│   └── .env                        # Database URL, JWT Secret
│
├── src/                            # Frontend
│   ├── pages/                      # Page Components
│   ├── components/                 # Reusable Components
│   ├── services/                   # API Services
│   ├── types/                      # TypeScript Types
│   └── context/                    # React Context
│
└── README.md                       # File ini
```

---

## 🔧 Troubleshooting

### Data tidak muncul di frontend?
✅ Pastikan backend berjalan di terminal terpisah

### Error "Cannot find module '@prisma/client'"?
```bash
cd pweb-express-p24-2025
npx prisma generate
```

### Port sudah digunakan?
- Tutup aplikasi lain yang menggunakan port 8080/5173
- Atau ubah port di config

---

## 👨‍💻 Developer

- **Author:** Fatihul Qolbi
- **Email:** fatihulqolbi02@gmail.com
- **Repository:** pweb-reactjs-p24-2025

---

## 📝 License

MIT License - Gunakan dengan bijak untuk pembelajaran!

---

## 🎓 Catatan Pembelajaran

Proyek ini dibuat sebagai bagian dari pembelajaran:
- Full-stack development
- TypeScript best practices
- REST API design
- Database modeling dengan Prisma
- React component architecture
- State management
- Form validation
- Protected routing

---

**Selamat Belajar & Happy Coding!** 🚀📚
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
