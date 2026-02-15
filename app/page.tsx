"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import BookmarkModal from "@/components/ui/BookmarkModal"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)

  // 🔹 Load user
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    loadUser()
  }, [])

  // 🔹 Load bookmarks (private per user)
  const loadBookmarks = async () => {
    const { data: userData } = await supabase.auth.getUser()
    const currentUser = userData.user
    if (!currentUser) return

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("position", { ascending: true })

    if (!error) setBookmarks(data || [])
  }

  // Load bookmarks on mount
  useEffect(() => {
    if (user) loadBookmarks()
  }, [user])

  // 🔹 Delete bookmark
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (!error) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id))
      toast.success("Bookmark deleted")
    } else {
      toast.error("Delete failed")
    }
  }

  // 🔹 Filter
  const filtered = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.url.toLowerCase().includes(search.toLowerCase())
  )

  // 🔹 Stats
  const stats = {
    total: bookmarks.length,
    uniqueDomains: new Set(
      bookmarks.map((b) => {
        try {
          return new URL(b.url).hostname
        } catch {
          return null
        }
      })
    ).size,
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)] text-white px-6 md:px-16 py-12">

      {/* HEADER */}
      <div className="relative w-full mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight">
          Smart Bookmarks
        </h1>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm text-gray-300">
                {user.email}
              </span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* ADD BUTTON */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-end">
        <button
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition"
        >
          + Add Bookmark
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
          <p className="text-gray-400 text-sm">Total Bookmarks</p>
          <h2 className="text-4xl font-bold mt-2">{stats.total}</h2>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
          <p className="text-gray-400 text-sm">Unique Domains</p>
          <h2 className="text-4xl font-bold mt-2">
            {stats.uniqueDomains}
          </h2>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-12 max-w-5xl mx-auto">
        <input
          placeholder="🔎 Search bookmarks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 
          focus:ring-2 focus:ring-blue-500 outline-none transition text-lg"
        />
      </div>

      {/* BOOKMARK LIST */}
      <div className="space-y-8 max-w-5xl mx-auto">
        {filtered.map((bookmark) => {
          let domain = ""
          try {
            domain = new URL(bookmark.url).hostname
          } catch {}

          const favicon = `https://www.google.com/s2/favicons?domain=${domain}`

          return (
            <motion.div
              key={bookmark.id}
              whileHover={{ y: -4 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <img src={favicon} className="w-6 h-6" />
                <h3 className="text-xl font-semibold">
                  {bookmark.title}
                </h3>
              </div>

              <a
                href={bookmark.url}
                target="_blank"
                className="text-blue-400 hover:underline break-all"
              >
                {bookmark.url}
              </a>

              {bookmark.category && (
                <div className="mt-3 inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                  {bookmark.category}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setEditing(bookmark)
                    setOpen(true)
                  }}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-sm transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* MODAL */}
      <BookmarkModal
        open={open}
        setOpen={setOpen}
        initial={editing}
        refreshBookmarks={loadBookmarks}
      />
    </div>
  )
}