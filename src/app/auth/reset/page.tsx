"use client"

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function ResetPasswordInner() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params?.get('token') || ''
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sent, setSent] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const requestReset = async () => {
    setError('')
    const res = await fetch('/api/auth/reset/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    if (res.ok) setSent(true)
  }

  const submitNewPassword = async () => {
    setError('')
    const res = await fetch('/api/auth/reset/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) })
    if (res.ok) setDone(true)
    else setError('Reset failed')
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 w-full max-w-md">
          <h1 className="heading-2 mb-4">Forgot your password?</h1>
          {sent ? (
            <p>We have sent a reset link if the email exists.</p>
          ) : (
            <div className="space-y-4">
              <input className="input w-full" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
              <button className="btn-primary w-full" onClick={requestReset}>Send reset link</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card p-8 w-full max-w-md">
        <h1 className="heading-2 mb-4">Set a new password</h1>
        {done ? (
          <p>Password reset. You can close this tab and sign in.</p>
        ) : (
          <div className="space-y-4">
            {error && <div className="text-red-600">{error}</div>}
            <input className="input w-full" placeholder="New password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button className="btn-primary w-full" onClick={submitNewPassword}>Reset password</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-600 dark:text-gray-300">Loading...</div></div>}>
      <ResetPasswordInner />
    </Suspense>
  )
}


