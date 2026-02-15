# 🚀 Smart Bookmarks

Smart Bookmarks is a SaaS-style bookmark management application built using **Next.js (App Router)** and **Supabase**.

Users authenticate using **Google OAuth only** and can securely manage their own private bookmarks with real-time updates.

---

# 🌐 Live Demo

🔗 Deployment URL: (Add your Vercel link here)

---

# 🛠 Tech Stack

- Next.js (App Router)
- Supabase (Auth + Database + Realtime)
- PostgreSQL
- Tailwind CSS
- ShadCN UI
- Framer Motion
- React Hot Toast
- Vercel (Deployment)

---

# 📦 Local Setup (Step-by-Step)

Follow the steps below to run the project locally.

---

## Step 1 — Clone the Repository

1. git clone https://github.com/JYothish01/smart-bookmarks.git
2. cd smart-bookmarks
3. npm install
4. NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
5. NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
You can find these in:
Supabase Dashboard → Project Settings → API
6. npm run dev
7. http://localhost:3000

---
## 🛠 Tech Stack

- ⚡ Next.js 14 (App Router)
- 🔐 Supabase (Auth + Database + Realtime)
- 🎨 Tailwind CSS
- 🧩 ShadCN UI
- 🔥 Framer Motion
- 🔔 React Hot Toast

---

## ✨ Features

- ✅ Google OAuth authentication (no email/password)
- ✅ Private bookmarks per user
- ✅ Add / Edit / Delete bookmarks
- ✅ Category support
- ✅ Position-based ordering
- ✅ Real-time updates across multiple tabs
- ✅ Row Level Security (RLS) enabled
- ✅ Responsive UI
- ✅ Toast notifications
- ✅ Glassmorphism SaaS-style design

---

## 🔐 Security

This project uses:

- Supabase Row Level Security (RLS)
- Policy restricting access to only own bookmarks:

```sql
CREATE POLICY "Users can manage their own bookmarks"
ON bookmarks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);