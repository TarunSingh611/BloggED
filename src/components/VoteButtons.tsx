'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

interface VoteState {
  upvotes: number
  downvotes: number
  userVote: 'UPVOTE' | 'DOWNVOTE' | null
}

export default function VoteButtons({ contentId }: { contentId: string }) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState<VoteState>({ upvotes: 0, downvotes: 0, userVote: null })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

  const fetchState = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/content/${contentId}/reactions`)
      const data = await res.json()
      setState({ upvotes: data.upvotes || 0, downvotes: data.downvotes || 0, userVote: data.userVote || null })
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchState() }, [contentId])

  const vote = async (type: 'UPVOTE' | 'DOWNVOTE') => {
    if (submitting) return
    if (status !== 'authenticated') { router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname || '/')}`); return }
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/content/${contentId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      if (res.status === 401) { router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname || '/')}`); return }
      const data = await res.json()
      if ('upvotes' in data && 'downvotes' in data) {
        setState({ upvotes: data.upvotes, downvotes: data.downvotes, userVote: data.userVote })
      } else if (data.removed) {
        // Fallback, just refresh counts
        fetchState()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        className={`btn-secondary px-3 py-1 flex items-center ${state.userVote === 'UPVOTE' ? 'ring-2 ring-green-500' : ''}`}
        onClick={() => vote('UPVOTE')}
        disabled={submitting}
        title="Upvote"
      >
        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 14h4v8H4zM10 22h8a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-5l1-4V4a2 2 0 0 0-2-2l-4 8v12z"/>
        </svg>
        {loading ? '...' : state.upvotes}
      </button>
      <button
        className={`btn-secondary px-3 py-1 flex items-center ${state.userVote === 'DOWNVOTE' ? 'ring-2 ring-red-500' : ''}`}
        onClick={() => vote('DOWNVOTE')}
        disabled={submitting}
        title="Downvote"
      >
        <svg className="w-4 h-4 mr-1 rotate-180" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 14h4v8H4zM10 22h8a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-5l1-4V4a2 2 0 0 0-2-2l-4 8v12z"/>
        </svg>
        {loading ? '...' : state.downvotes}
      </button>
    </div>
  )
}


