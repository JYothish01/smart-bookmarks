"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import BookmarkModal from "@/components/ui/BookmarkModal"
import { useTheme } from "@/hooks/useTheme"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)

  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    loadUser()
  }, [])

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

  useEffect(() => {
    if (user) loadBookmarks()
  }, [user])

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

  const filtered = bookmarks.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.url?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: bookmarks.length,
    uniqueDomains: new Set(
      bookmarks
        .map((b) => {
          try {
            return new URL(b.url).hostname
          } catch {
            return null
          }
        })
        .filter(Boolean)
    ).size,
  }

  return (
    <div
      className="
        min-h-screen
        transition-colors duration-300
        bg-white text-slate-900
        dark:bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)]
        dark:text-white
      "
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center md:text-left">
            Smart Bookmarks
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-3">

            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="
                px-4 py-2 rounded-lg
                border
                border-gray-300
                dark:border-white/20
                hover:bg-gray-100
                dark:hover:bg-white/10
                transition text-sm
              "
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>

            {/* USER + LOGOUT */}
            {user && (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300 break-all">
                  {user.email}
                </span>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="
                    w-full sm:w-auto
                    px-5 py-2
                    bg-red-500 hover:bg-red-600
                    rounded-lg text-sm transition
                  "
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* ADD BUTTON */}
        <div className="flex justify-end mb-10">
          <button
            onClick={() => {
              setEditing(null)
              setOpen(true)
            }}
            className="
              w-full sm:w-auto
              bg-blue-600 hover:bg-blue-700
              px-6 py-3 rounded-lg
              transition text-sm sm:text-base
            "
          >
            + Add Bookmark
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Total Bookmarks
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">
              {stats.total}
            </h2>
          </div>

          <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Unique Domains
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">
              {stats.uniqueDomains}
            </h2>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-12">
          <input
            placeholder="🔎 Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full p-4 rounded-2xl
              bg-gray-100 dark:bg-white/5
              border border-gray-200 dark:border-white/10
              focus:ring-2 focus:ring-blue-500
              outline-none transition
              text-base sm:text-lg
            "
          />
        </div>

        {/* BOOKMARK LIST */}
        <div className="space-y-6">
          {filtered.map((bookmark) => (
            <motion.div
              key={bookmark.id}
              whileHover={{ y: -4 }}
              className="
                bg-gray-100 dark:bg-white/5
                border border-gray-200 dark:border-white/10
                rounded-2xl p-6 sm:p-8
                shadow-xl backdrop-blur-xl transition
              "
            >
              <h3 className="text-lg sm:text-xl font-semibold break-words mb-2">
                {bookmark.title}
              </h3>

              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 dark:text-blue-400 hover:underline break-all text-sm sm:text-base"
              >
                {bookmark.url}
              </a>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => {
                    setEditing(bookmark)
                    setOpen(true)
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-sm transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <BookmarkModal
          open={open}
          setOpen={setOpen}
          initial={editing}
          refreshBookmarks={loadBookmarks}
        />
      </div>
    </div>
  )
}