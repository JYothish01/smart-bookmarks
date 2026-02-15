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
```
## Challenges Faced & How I Solved Them

1. Google login was working locally but failed after deployment on Vercel. The app did not redirect back properly after authentication.
🔍 Root Cause
Production URL was not configured correctly in:
Google Cloud OAuth client
Supabase Auth redirect settings
Vercel environment variables
✅ Solution
Added production domain to Google Cloud → Authorized Redirect URIs
Added production site URL in Supabase → Authentication → URL Configuration
Added NEXT_PUBLIC_SITE_URL in Vercel Environment Variables
Updated login code to include dynamic redirect
Result: OAuth worked correctly in production.

2. Supabase Insert Failing (HTTP 400 Error)
🔍 Root Cause
user_id column was required due to Row Level Security but was not being inserted.
✅ Solution
Fetched logged-in user and stored user_id during insert
Result: Insert worked successfully and bookmarks became user-specific.

3. Integer Overflow Error (Position Column)
❌ Problem
Error: value is out of range for type integer
🔍 Root Cause
Used Date.now() for position. The position column was integer, but Date.now() returns a large number.
✅ Solution
Changed column type in Supabase: ALTER TABLE bookmarks ALTER COLUMN position TYPE bigint;
Alternatively could store smaller values, but bigint is correct for timestamps.
Result: Insert worked without overflow.

4. 4️⃣ Environment Variables Missing in Vercel
❌ Problem
Build error: supabaseUrl is required.
🔍 Root Cause
Environment variables were only present locally in .env.local but not configured in Vercel.
✅ Solution
Added environment variables in: Vercel → Project Settings → Environment Variables
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
Redeployed project.
Result: Production build succeeded.

5. Bookmarks Not Private
❌ Problem: Users could see all bookmarks.
🔍 Root Cause
Row Level Security (RLS) was not configured properly.
✅ Solution
Enabled RLS and added policy in Supabase:
CREATE POLICY "Users can access their own bookmarks"
ON bookmarks
FOR ALL
USING (auth.uid() = user_id);
Result: Each user now sees only their own bookmarks.

6. UI State Not Updating After Insert
❌ Problem
New bookmark required page refresh to appear.
🔍 Root Cause
State was not being refreshed after insertion.
✅ Solution
Created a refreshBookmarks() function in page.tsx and called it from modal:
refreshBookmarks()
Removed location.reload().
Result: Instant UI update without reload.
