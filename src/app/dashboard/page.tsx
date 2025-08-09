// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { MotionDiv } from '@/components/motion'
import Link from 'next/link'

export default function Dashboard() {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0, featuredPosts: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''
        const [postsResponse, statsResponse] = await Promise.all([
          fetch(`${API_BASE}/api/content?published=true`),
          fetch(`${API_BASE}/api/dashboard/stats`)
        ])
        
        if (postsResponse.ok && statsResponse.ok) {
          const postsData = await postsResponse.json()
          const statsData = await statsResponse.json()
          setPosts(postsData)
          setStats(statsData)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="heading-1 mb-2">Dashboard</h1>
        <p className="body-text text-lg">
          Manage your content and track your blog's performance
        </p>
      </MotionDiv>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            title: "Total Posts",
            value: stats.totalPosts,
            icon: (
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            ),
            color: "bg-blue-500"
          },
          {
            title: "Total Views",
            value: stats.totalViews,
            icon: (
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ),
            color: "bg-green-500"
          },
          {
            title: "Featured Posts",
            value: stats.featuredPosts,
            icon: (
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            ),
            color: "bg-yellow-500"
          }
        ].map((stat, index) => (
          <MotionDiv
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className={`${stat.color} text-white p-3 rounded-lg mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-400">{stat.title}</p>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="heading-2 text-xl">Recent Posts</h2>
          <a href={process.env.NEXT_PUBLIC_CMS_URL || '#'} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Create New Post
          </a>
        </div>
        
        <div className="space-y-4">
          {posts?.slice(0, 5).map((post: any, index: number) => (
            <MotionDiv
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {post.views || 0} views
                </span>
                {post.featured && (
                  <span className="tag bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                    Featured
                  </span>
                )}
                <Link 
                  href={`/blog/${post.id}`}
                  className="btn-secondary text-sm px-3 py-1"
                >
                  View
                </Link>
                {/* Edit removed in blog app */}
              </div>
            </MotionDiv>
          ))}
        </div>
        
        {posts && posts.length > 5 && (
          <div className="mt-6 text-center">
            <Link href="/dashboard/posts" className="btn-secondary">
              View All Posts
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}