'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

export default function FavoriteButton({ contentId }: { contentId: string }) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [fav, setFav] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/content/${contentId}/reactions?type=FAVORITE`)
        const data = await res.json()
        if (typeof data.has === 'boolean') setFav(data.has)
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [contentId])

  const toggle = async () => {
    if (status !== 'authenticated') { router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname || '/')}`); return }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/content/${contentId}/reactions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'FAVORITE' })
      })
      const data = await res.json()
      if (data.removed) setFav(false)
      else setFav(true)
    } finally { setLoading(false) }
  }

  return (
    <button onClick={toggle} disabled={loading} className={`btn-secondary px-3 py-1 flex items-center ${fav ? 'ring-2 ring-pink-500' : ''}`} title={fav ? 'Unfavorite' : 'Favorite'}>
      <svg className={`w-4 h-4 mr-1 ${fav ? 'text-pink-600' : ''}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      {fav ? 'Favorited' : 'Favorite'}
    </button>
  )
}


