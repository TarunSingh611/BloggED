'use client'

import { SessionProvider } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Load Toaster only on the client to avoid SSR/hydration issues (goober crash on mobile)
const Toaster = dynamic(() => import('react-hot-toast').then((m) => m.Toaster), {
  ssr: false,
})

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <SessionProvider>
      {children}
      {isMounted ? <Toaster toastOptions={{}} /> : null}
    </SessionProvider>
  )
}