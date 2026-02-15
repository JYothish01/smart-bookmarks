"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import toast from "react-hot-toast"

interface Props {
  open: boolean
  setOpen: (value: boolean) => void
  initial?: any
  refreshBookmarks: () => void
}

export default function BookmarkModal({
  open,
  setOpen,
  initial,
  refreshBookmarks,
}: Props) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "")
      setUrl(initial.url || "")
      setCategory(initial.category || "")
    } else {
      setTitle("")
      setUrl("")
      setCategory("")
    }
  }, [initial, open])

  const isValidUrl = (value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  const save = async () => {
    if (!title || !url) {
      toast.error("Title and URL are required")
      return
    }

    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL (include https://)")
      return
    }

    setLoading(true)

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        toast.error("You must be logged in")
        setLoading(false)
        return
      }

      const user = sessionData.session.user

      if (initial) {
        const { error } = await supabase
          .from("bookmarks")
          .update({ title, url, category })
          .eq("id", initial.id)
          .eq("user_id", user.id)

        if (error) throw error
        toast.success("Bookmark updated 🚀")
      } else {
        const { error } = await supabase.from("bookmarks").insert({
          title,
          url,
          category,
          user_id: user.id,
          position: Date.now(),
        })

        if (error) throw error
        toast.success("Bookmark added 🚀")
      }

      refreshBookmarks()
      setOpen(false)
    } catch (error: any) {
      console.error("Supabase error:", error)
      toast.error(error.message || "Failed to save bookmark")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          w-[95%] sm:w-full
          max-w-lg
          bg-slate-900
          text-white
          border border-white/10
          rounded-2xl
          p-6 sm:p-8
        "
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            {initial ? "Edit Bookmark" : "Add Bookmark"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-6">

          <input
            className="
              w-full p-3 sm:p-4
              rounded-xl
              bg-white/5
              border border-white/10
              outline-none
              focus:ring-2 focus:ring-blue-500
              transition
              text-sm sm:text-base
            "
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="
              w-full p-3 sm:p-4
              rounded-xl
              bg-white/5
              border border-white/10
              outline-none
              focus:ring-2 focus:ring-blue-500
              transition
              text-sm sm:text-base
            "
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <input
            className="
              w-full p-3 sm:p-4
              rounded-xl
              bg-white/5
              border border-white/10
              outline-none
              focus:ring-2 focus:ring-blue-500
              transition
              text-sm sm:text-base
            "
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setOpen(false)}
              className="
                w-full sm:w-auto
                px-4 py-2
                rounded-lg
                border border-white/20
                hover:bg-white/10
                transition
                text-sm
              "
            >
              Cancel
            </button>

            <button
              onClick={save}
              disabled={loading}
              className="
                w-full sm:w-auto
                bg-blue-600
                hover:bg-blue-700
                transition
                px-6 py-2
                rounded-lg
                font-medium
                disabled:opacity-50
                text-sm
              "
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}