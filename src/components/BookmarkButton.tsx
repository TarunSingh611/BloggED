'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function BookmarkButton({ contentId }: { contentId: string }) {
  const { status } = useSession()
  const router = useRouter()
  const [saved, setSaved] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/content/${contentId}/bookmarks`)
        if (!res.ok) return
        const data = await res.json()
        if (typeof data.saved === 'boolean') setSaved(data.saved)
      } catch {}
    }
    load()
  }, [contentId])

  const toggle = async () => {
    if (status !== 'authenticated') { router.push('/auth/signin'); return }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/content/${contentId}/bookmarks`, { method: 'POST' })
      const data = await res.json()
      if (data.removed) setSaved(false)
      else setSaved(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={toggle} disabled={loading} className={`btn-secondary px-3 py-1 flex items-center ${saved ? 'ring-2 ring-amber-500' : ''}`} title={saved ? 'Remove bookmark' : 'Save bookmark'}>
      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 2a2 2 0 0 0-2 2v18l8-5 8 5V4a2 2 0 0 0-2-2H6z" />
      </svg>
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}


