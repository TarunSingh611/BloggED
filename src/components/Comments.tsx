'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { MotionDiv } from './motion'
import { formatDistanceToNow } from 'date-fns'
import { usePathname, useRouter } from 'next/navigation'

interface CommentUser {
  id: string
  name?: string | null
  image?: string | null
  email?: string | null
}

interface CommentItem {
  id: string
  text: string
  createdAt: string
  user: CommentUser
  replies?: CommentItem[]
}

interface CommentsProps {
  contentId: string
}

export default function Comments({ contentId }: CommentsProps) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [comments, setComments] = useState<CommentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionSuggestions, setMentionSuggestions] = useState<CommentUser[]>([])
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/content/${contentId}/comments`)
        if (!res.ok) {
          setComments([])
          setError('Failed to load comments')
          return
        }
        const data = await res.json()
        setComments(Array.isArray(data) ? data : [])
      } catch (e) {
        setError('Failed to load comments')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [contentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setPosting(true)
    try {
      const res = await fetch(`${API_BASE}/api/content/${contentId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (res.status === 401) {
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname || '/')}`)
        return
      }
      const created: CommentItem = await res.json()
      setComments(prev => [created, ...prev])
      setText('')
    } catch (e) {
      setError('Failed to post comment')
    } finally {
      setPosting(false)
    }
  }

  // Mentions: when typing '@', query users
  useEffect(() => {
    const lastAt = text.lastIndexOf('@')
    if (lastAt >= 0) {
      const q = text.slice(lastAt + 1).trim()
      if (q.length >= 2) {
        setMentionQuery(q)
      } else {
        setMentionQuery('')
      }
    } else {
      setMentionQuery('')
    }
  }, [text])

  useEffect(() => {
    let abort = false
    const run = async () => {
      if (!mentionQuery) { setMentionSuggestions([]); return }
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(mentionQuery)}`)
        const users = await res.json()
        if (!abort) setMentionSuggestions(users)
      } catch {}
    }
    run()
    return () => { abort = true }
  }, [mentionQuery])

  const selectMention = (u: CommentUser) => {
    const lastAt = text.lastIndexOf('@')
    if (lastAt >= 0) {
      const before = text.slice(0, lastAt + 1)
      const after = text.slice(lastAt + 1)
      const spaceIdx = after.search(/\s|$/)
      const newText = `${before}${u.name || u.email || 'user'} `
      setText(newText)
      setMentionQuery('')
      setMentionSuggestions([])
    }
  }

  const submitReply = async (parentId: string, replyText: string) => {
    if (!replyText.trim()) return
    try {
      const res = await fetch(`${API_BASE}/api/content/${contentId}/comments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText, parentId })
      })
      if (res.status === 401) { router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname || '/')}`); return }
      const created = await res.json()
      setComments(prev => {
        return prev.map(c => c.id === parentId ? { ...c, replies: [...(c.replies||[]), created] } : c)
      })
      setActiveReplyId(null)
    } catch {}
  }

  return (
    <div className="mt-10">
      <h3 className="heading-3 text-lg mb-4">Comments</h3>

      {status === 'authenticated' ? (
        <form onSubmit={handleSubmit} className="card p-4 mb-6 relative">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Write a comment
          </label>
          <textarea
            id="comment"
            className="input mb-3"
            rows={3}
            placeholder="Share your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {mentionSuggestions.length > 0 && (
            <div className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow mt-1 w-full max-w-md">
              {mentionSuggestions.map(u => (
                <button key={u.id} type="button" onClick={() => selectMention(u)} className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.image || '/default-avatar.png'} alt={u.name || 'User'} className="w-6 h-6 rounded-full" />
                  <span className="text-sm">{u.name || u.email}</span>
                </button>
              ))}
            </div>
          )}
          <div className="flex justify-end mt-2">
            <button type="submit" disabled={!text.trim() || posting} className="btn-primary">
              {posting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="card p-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
          Sign in to write a comment.
        </div>
      )}

      <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {isLoading ? (
          <div className="text-gray-600 dark:text-gray-400">Loading comments...</div>
        ) : error ? (
          <div className="text-red-600 dark:text-red-400">{error}</div>
        ) : !Array.isArray(comments) || comments.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400">No comments yet. Be the first to comment!</div>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="card p-4">
                <div className="flex items-start">
                  <img
                    src={c.user?.image || '/default-avatar.png'}
                    alt={c.user?.name || 'User'}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">{c.user?.name || 'Anonymous'}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700 dark:text-gray-200 whitespace-pre-line">{c.text}</p>
                    <div className="mt-2">
                      <button className="text-sm text-indigo-600 dark:text-indigo-400" onClick={() => setActiveReplyId(activeReplyId === c.id ? null : c.id)}>Reply</button>
                    </div>
                    {activeReplyId === c.id && (
                      <ReplyForm onSubmit={(val) => submitReply(c.id, val)} onCancel={() => setActiveReplyId(null)} />
                    )}
                    {c.replies && c.replies.length > 0 && (
                      <ul className="mt-3 space-y-3">
                        {c.replies.map(r => (
                          <li key={r.id} className="flex items-start">
                            <img src={r.user?.image || '/default-avatar.png'} alt={r.user?.name || 'User'} className="h-8 w-8 rounded-full mr-2" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{r.user?.name || 'Anonymous'}</span>
                                <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}</span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">{r.text}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </MotionDiv>
    </div>
  )
}

function ReplyForm({ onSubmit, onCancel }: { onSubmit: (text: string) => void, onCancel: () => void }) {
  const [val, setVal] = useState('')
  return (
    <div className="mt-2">
      <textarea className="input w-full" rows={2} placeholder="Write a reply..." value={val} onChange={(e)=>setVal(e.target.value)} />
      <div className="flex gap-2 mt-2">
        <button className="btn-primary" onClick={() => onSubmit(val)}>Reply</button>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}


