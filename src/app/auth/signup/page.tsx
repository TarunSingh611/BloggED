'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SignUp() {
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params?.get('callbackUrl') || '/dashboard'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Failed')
      // After successful signup, send user to sign-in preserving original intent
      router.push(`/auth/signin${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`)
    } catch (e) {
      setError('Sign up failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card p-8 w-full max-w-md">
        <h1 className="heading-2 mb-4">Create account</h1>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input w-full" placeholder="Name" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
          <input className="input w-full" placeholder="Email" type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
          <input className="input w-full" placeholder="Password" type="password" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} />
          <button type="submit" disabled={isLoading} className="btn-primary w-full">{isLoading ? 'Creating...' : 'Sign up'}</button>
        </form>
        <p className="mt-4 text-sm">Already have an account? <Link className="text-indigo-600" href={`/auth/signin${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}>Sign in</Link></p>
      </div>
    </div>
  )
}


