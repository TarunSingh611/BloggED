'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function SavedPage() {
  const { status } = useSession()
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingUndos, setPendingUndos] = useState<Array<{ id: string; type: 'bookmark' | 'favorite'; title: string; item: any; timeoutId: number; expiresAt: number }>>([])
  const [now, setNow] = useState<number>(Date.now())

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/user/saved')
        const data = await res.json()
        setBookmarks(data.bookmarks || [])
        setFavorites(data.favorites || [])
      } finally { setLoading(false) }
    }
    load()
  }, [])

  // Ticker for countdown UI
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  if (status !== 'authenticated') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card p-8 text-center">
          <p>Sign in to view saved blogs.</p>
          <Link href="/auth/signin" className="btn-primary mt-4 inline-block">Sign in</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {pendingUndos.length > 0 && (
        <div className="space-y-2">
          {pendingUndos.map((p) => (
            <div key={`${p.type}-${p.id}`} className="card p-3 flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20">
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                Removed {p.type === 'bookmark' ? 'bookmark' : 'favorite'}: <span className="font-medium">{p.title}</span>
                <span className="ml-2 text-xs">Undo in {Math.max(0, Math.ceil((p.expiresAt - now) / 1000))}s</span>
              </div>
              <button
                className="btn-secondary px-3 py-1"
                onClick={() => {
                  // Undo action
                  clearTimeout(p.timeoutId)
                  setPendingUndos((prev) => prev.filter((x) => !(x.id === p.id && x.type === p.type)))
                  if (p.type === 'bookmark') {
                    // Immediately restore in UI
                    setBookmarks((prev) => (prev.find((b) => b.id === p.id) ? prev : [p.item, ...prev]))
                    fetch(`/api/content/${p.id}/bookmarks`, { method: 'POST' })
                  } else {
                    setFavorites((prev) => (prev.find((f) => f.id === p.id) ? prev : [p.item, ...prev]))
                    fetch(`/api/content/${p.id}/reactions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'FAVORITE' }) })
                  }
                }}
              >
                Undo
              </button>
            </div>
          ))}
        </div>
      )}
      <section>
        <h1 className="heading-1 mb-4">Bookmarks</h1>
        {loading ? (
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        ) : bookmarks.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400">No bookmarks yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((p) => (
              <div key={p.id} className="card p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Link href={`/blog/${p.id}`}>
                  <div className="font-medium mb-2">{p.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{p.description || '—'}</div>
                </Link>
                <div className="mt-3 flex justify-end">
                  <button
                    className="btn-secondary px-3 py-1"
                    onClick={() => {
                      // Optimistic remove
                      setBookmarks((prev) => prev.filter((x) => x.id !== p.id))
                      // Toggle API
                      fetch(`/api/content/${p.id}/bookmarks`, { method: 'POST' })
                      // Setup undo window
                      const timeoutId = window.setTimeout(() => {
                        setPendingUndos((prev) => prev.filter((x) => !(x.id === p.id && x.type === 'bookmark')))
                      }, 30000)
                      setPendingUndos((prev) => [...prev, { id: p.id, type: 'bookmark', title: p.title, item: p, timeoutId, expiresAt: Date.now() + 30000 }])
                    }}
                  >
                    Remove bookmark
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="heading-2 mb-4">Favorites</h2>
        {loading ? (
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        ) : favorites.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400">No favorites yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((p) => (
              <div key={p.id} className="card p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Link href={`/blog/${p.id}`}>
                  <div className="font-medium mb-2">{p.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{p.description || '—'}</div>
                </Link>
                <div className="mt-3 flex justify-end">
                  <button
                    className="btn-secondary px-3 py-1"
                    onClick={() => {
                      // Optimistic remove
                      setFavorites((prev) => prev.filter((x) => x.id !== p.id))
                      // Toggle API
                      fetch(`/api/content/${p.id}/reactions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'FAVORITE' }) })
                      // Setup undo window
                      const timeoutId = window.setTimeout(() => {
                        setPendingUndos((prev) => prev.filter((x) => !(x.id === p.id && x.type === 'favorite')))
                      }, 30000)
                      setPendingUndos((prev) => [...prev, { id: p.id, type: 'favorite', title: p.title, item: p, timeoutId, expiresAt: Date.now() + 30000 }])
                    }}
                  >
                    Remove favorite
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}


