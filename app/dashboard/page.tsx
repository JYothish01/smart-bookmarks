"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.auth.getSession()
      const currentSession = data.session
      setSession(currentSession)

      if (!currentSession) return

      const { data: bookmarksData, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", currentSession.user.id)
        .order("created_at", { ascending: false })

      if (!error) setBookmarks(bookmarksData || [])
    }

    getData()
  }, [])

  async function addBookmark() {
    if (!session || !title || !url) return

    setLoading(true)

    const { error, data } = await supabase
      .from("bookmarks")
      .insert([
        {
          title,
          url,
          user_id: session.user.id,
        },
      ])
      .select()

    if (!error && data) {
      setBookmarks((prev) => [...data, ...prev])
      setTitle("")
      setUrl("")
    }

    setLoading(false)
  }

  async function deleteBookmark(id: string) {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id)

    if (!error) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <h2 className="text-2xl sm:text-3xl font-bold mb-8">
          My Bookmarks
        </h2>

        {/* Add Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 space-y-4 backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />

            <input
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          <button
            onClick={addBookmark}
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-medium text-sm sm:text-base disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Bookmark"}
          </button>
        </div>

        {/* Bookmark List */}
        <div className="space-y-6">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg"
            >
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {b.title}
              </h3>

              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline break-all text-sm sm:text-base"
              >
                {b.url}
              </a>

              <div className="mt-4">
                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}