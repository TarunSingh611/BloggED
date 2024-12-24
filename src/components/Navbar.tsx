// components/Navbar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MotionDiv } from './motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <MotionDiv
                whileHover={{ scale: 1.1 }}
                className="text-2xl font-bold text-indigo-600"
              >
                BloggED
              </MotionDiv>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/blog" className="nav-link">
                Blog
              </Link>
              <Link href="/about" className="nav-link">
                About
              </Link>

                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              
            </div>
          </div>

          {/* <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <img
                  className="h-8 w-8 rounded-full"
                  src={session.user.image || '/default-avatar.png'}
                  alt=""
                />
                <button
                  onClick={() => signOut()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div> */}
        </div>
      </div>
    </nav>
  )
}