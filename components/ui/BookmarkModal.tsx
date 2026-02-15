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
  refreshBookmarks: () => void   // 👈 IMPORTANT
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

  // Prefill when editing
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

  const save = async () => {
    if (!title || !url) {
      toast.error("All fields required")
      return
    }

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      toast.error("Not authenticated")
      return
    }

    try {
      if (initial) {
        // UPDATE
        const { error } = await supabase
          .from("bookmarks")
          .update({
            title,
            url,
            category,
          })
          .eq("id", initial.id)

        if (error) throw error

        toast.success("Bookmark updated")
      } else {
        // INSERT
        const { error } = await supabase
          .from("bookmarks")
          .insert({
            title,
            url,
            category,
            user_id: user.id,          // ✅ Required for privacy
            position: Date.now(),      // ✅ Required for sorting
          })

        if (error) throw error

        toast.success("Bookmark added")
      }

      refreshBookmarks() // 👈 re-fetch instead of reload
      setOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-slate-900 text-white border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {initial ? "Edit Bookmark" : "Add Bookmark"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <input
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <button
            onClick={save}
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-medium"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}