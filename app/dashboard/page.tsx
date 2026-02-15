'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      setSession(session)

      if (!session) return

      const { data: bookmarksData, error } = await supabase
        .from('bookmarks')
        .select('*')

      if (error) console.log(error)
      else setBookmarks(bookmarksData || [])
    }

    getData()
  }, [])

  async function addBookmark() {
    if (!session) {
      console.log('No session found')
      return
    }

    const { error } = await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: session.user.id
      }
    ])

    if (error) {
      console.log(error)
      return
    }

    setTitle('')
    setUrl('')
    window.location.reload()
  }

  async function deleteBookmark(id: string) {
    await supabase.from('bookmarks').delete().eq('id', id)
    window.location.reload()
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>My Bookmarks</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={addBookmark}>Add</button>
      </div>

      {bookmarks.map((b) => (
        <div key={b.id}>
          <strong>{b.title}</strong> — {b.url}
          <button onClick={() => deleteBookmark(b.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}