// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MotionDiv } from '@/components/motion';

export default function Home() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/content?take=6&published=true')
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="heading-1 text-white mb-6">
              Discover Amazing Stories
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Explore insights, ideas, and perspectives from our community of writers and thinkers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="btn-primary bg-white text-indigo-600 hover:bg-gray-100/30 px-8 py-3 text-lg"
              >
                Start Reading
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_CMS_URL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary bg-white/20 text-white hover:bg-white/30 px-8 py-3 text-lg"
              >
                Write Your Story
              </a>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">Featured Stories</h2>
          <p className="body-text text-lg max-w-2xl mx-auto">
            Curated content that inspires, educates, and entertains
          </p>
        </MotionDiv>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map?.((post: any, index: number) => (
            <MotionDiv
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card card-hover group"
            >
              {post.coverImage && (
                <div className="relative h-48 overflow-hidden rounded-t-xl">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {post.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="tag bg-indigo-600 text-white">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center mb-3">
                  {post.author?.image && (
                    <img
                      src={post.author.image}
                      alt={post.author.name || 'Author'}
                      className="h-8 w-8 rounded-full mr-3"
                    />
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">{post.author?.name || 'Anonymous'}</p>
                    <p className="text-xs">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <h3 className="heading-3 text-lg mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h3>
                <p className="body-text mb-4 line-clamp-3">
                  {post.description || post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    Read More →
                  </Link>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.views || 0}
                  </div>
                </div>
              </div>
            </MotionDiv>
          ))}
        </div>
        
        {posts?.length > 0 && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              href="/blog"
              className="btn-primary px-8 py-3 text-lg"
            >
              View All Stories
            </Link>
          </MotionDiv>
        )}
      </section>

      {/* Features Section */}
      <section className="gradient-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="heading-2 mb-4">Why Choose BloggED?</h2>
            <p className="body-text text-lg max-w-2xl mx-auto">
              A platform designed for modern content creators and readers
            </p>
          </MotionDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                title: "Easy Writing",
                description: "Create beautiful content with our intuitive editor and rich formatting options."
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Community",
                description: "Connect with like-minded writers and readers in a supportive environment."
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Fast & Responsive",
                description: "Lightning-fast loading times and seamless experience across all devices."
              }
            ].map((feature, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="heading-3 text-lg mb-2">{feature.title}</h3>
                  <p className="body-text">{feature.description}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}