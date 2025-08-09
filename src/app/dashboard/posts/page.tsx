// app/dashboard/posts/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { MotionDiv } from '@/components/motion'
import Link from 'next/link'
import { format } from 'date-fns'

interface Post {
  id: string
  title: string
  description?: string
  excerpt?: string
  coverImage?: string
  published: boolean
  featured?: boolean
  authorId: string
  author: {
    id: string
    name?: string
    image?: string
  }
  createdAt: Date
  updatedAt: Date
  views: number
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0, featuredPosts: 0 })

  useEffect(() => {
    fetchPosts()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''
      const response = await fetch(`${API_BASE}/api/dashboard/stats`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''
      const response = await fetch(`${API_BASE}/api/content`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        throw new Error('Failed to fetch posts')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    if (filter === 'published') return post.published
    if (filter === 'draft') return !post.published
    return true
  })

  // Delete disabled in blog app (CMS-only authoring)

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-1 mb-2">All Posts</h1>
            <p className="body-text text-lg">
              Manage all your blog posts
            </p>
            <div className="flex space-x-6 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Total Posts: {stats.totalPosts}</span>
              <span>Total Views: {stats.totalViews.toLocaleString()}</span>
              <span>Featured Posts: {stats.featuredPosts}</span>
            </div>
          </div>
          <a href={process.env.NEXT_PUBLIC_CMS_URL || '#'} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Create New Post
          </a>
        </div>
      </MotionDiv>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All Posts', count: posts.length },
            { key: 'published', label: 'Published', count: posts.filter(p => p.published).length },
            { key: 'draft', label: 'Drafts', count: posts.filter(p => !p.published).length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="card p-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {filter === 'all' 
                ? 'You haven\'t created any posts yet.'
                : `No ${filter} posts found.`
              }
            </p>
            <Link href="/dashboard/create" className="btn-primary">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <MotionDiv
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )} */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      {!post.published && (
                        <span className="tag bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                          Draft
                        </span>
                      )}
                      {post.featured && (
                        <span className="tag bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(post.createdAt), 'MMM dd, yyyy')} • {post.views || 0} views
                    </p>
                    {post.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
                        {post.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link 
                    href={`/blog/${post.id}`}
                    className="btn-secondary text-sm px-3 py-1"
                  >
                    View
                  </Link>
                  {/* Edit removed in blog app */}
                  {/* Delete removed in blog app */}
                </div>
              </MotionDiv>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 