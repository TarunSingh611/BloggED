// app/blog/BlogContent.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BlogList } from '@/components/BlogList';
import { MotionDiv } from '@/components/motion';
import { SearchBar } from '@/components/SearchBar';
import Newsletter from '@/components/Newsletter';

export default function BlogContent() {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get('search') || ''
  const activeTag = searchParams?.get('tag') || ''
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = new URLSearchParams({ published: 'true' })
        if (searchQuery) params.set('q', searchQuery)
        if (activeTag) params.set('tag', activeTag)
        const response = await fetch(`${API_BASE}/api/content?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setPosts(Array.isArray(data) ? data : [])
          setLoadError('')
        } else {
          const payload = await response.json().catch(() => ({}))
          setLoadError(payload.error || 'Published stories are unavailable right now.')
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
        setLoadError('Published stories are unavailable right now.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [API_BASE, searchQuery, activeTag])
  
  // Filter posts based on search query
  const filteredPosts = searchQuery
    ? posts.filter((post: any) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-secondary">
      <div className="container mx-auto px-4 py-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="heading-1 mb-4">Discover Stories</h1>
          <p className="body-text text-lg max-w-2xl mx-auto mb-8">
            Explore insights, ideas, and perspectives from our community of writers and thinkers
          </p>
          
          {/* Search Bar */}
          <SearchBar initialQuery={searchQuery} />

          {Array.from(new Set(posts.flatMap((post) => post.tags || []))).length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Filter by tag">
              <Link href="/blog" className={`tag ${activeTag ? 'bg-white text-gray-700' : 'bg-indigo-600 text-white'}`}>
                All
              </Link>
              {Array.from(new Set(posts.flatMap((post) => post.tags || []))).slice(0, 12).map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className={`tag ${activeTag === tag ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          
          {/* Results Info */}
          {searchQuery && (
            <div className="mt-6">
              <p className="text-gray-600 dark:text-gray-400">
                Found {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            </div>
          )}
        </MotionDiv>
        
        {filteredPosts.length > 0 ? (
          <BlogList posts={filteredPosts} />
        ) : (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="heading-3 text-lg mb-2">No posts found</h3>
              <p className="body-text">
                {loadError
                  ? loadError
                  : searchQuery 
                  ? `No posts match your search for "${searchQuery}". Try different keywords.`
                  : 'No published stories yet. New articles appear here after they are published in the Content Studio.'
                }
              </p>
            </div>
          </MotionDiv>
        )}
        
        {/* Newsletter Section */}
        <div className="mt-16">
          <Newsletter />
        </div>
      </div>
    </div>
  )
} 