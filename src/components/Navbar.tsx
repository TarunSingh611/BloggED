// components/Navbar.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MotionDiv } from './motion'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/blog?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <MotionDiv
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
              >
                BloggED
              </MotionDiv>
            </Link>
            
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              <Link 
                href="/blog" 
                className={`nav-link ${pathname === '/blog' ? 'active' : ''}`}
              >
                Blog
              </Link>
              <Link 
                href="/about" 
                className={`nav-link ${pathname === '/about' ? 'active' : ''}`}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block p-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar w-full"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right side auth/actions + mobile toggle */}
          <div className="flex items-center gap-3">
            <AccountMenu status={status} name={session?.user?.name || session?.user?.email || 'Guest'} image={session?.user?.image} />

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:text-indigo-600 dark:focus:text-indigo-400"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-bar w-full"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
              
              <Link
                href="/blog"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/blog'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/about"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/about'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/contact'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              {/* Auth actions (mobile) */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {status === 'authenticated' ? (
                  <button onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }) }} className="btn-secondary col-span-2">Sign out</button>
                ) : (
                  <>
                    <Link href="/auth/signin" onClick={() => setIsOpen(false)} className="btn-secondary">Sign in</Link>
                    <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="btn-primary">Sign up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function AccountMenu({ status, name, image }: { status: 'authenticated' | 'loading' | 'unauthenticated', name?: string | null, image?: string | null }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  return (
    <div className="relative hidden md:block" ref={ref}>
      <button onClick={() => setOpen(v=>!v)} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name || 'User'} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-8 h-8 text-gray-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7h14c0-3.866-3.134-7-7-7z"/></svg>
          )}
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">{status === 'authenticated' ? name : 'Guest'}</span>
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 card p-2">
          {status === 'authenticated' ? (
            <div className="py-1">
              <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">Signed in as <span className="font-medium">{name}</span></div>
              <Link href="/dashboard/saved" className="block px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">Saved blogs</Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">Sign out</button>
            </div>
          ) : (
            <div className="py-1">
              <Link href="/auth/signin" className="block px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">Sign in</Link>
              <Link href="/auth/signup" className="block px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}