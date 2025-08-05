// app/blog/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BlogPost from '@/components/BlogPost'

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse, allPostsResponse] = await Promise.all([
          fetch(`/api/content/${params.id}`),
          fetch('/api/content?published=true')
        ])

        if (!postResponse.ok) {
          if (postResponse.status === 404) {
            router.push('/404')
            return
          }
          throw new Error('Failed to fetch post')
        }

        const postData = await postResponse.json()
        const allPostsData = await allPostsResponse.json()

        if (!postData.published) {
          router.push('/404')
          return
        }

        setPost(postData)
        
        // Get related posts (excluding current post)
        const related = allPostsData
          .filter((p: any) => p.id !== postData.id)
          .slice(0, 3)
        setRelatedPosts(related)

        // Increment views
        await fetch(`/api/content/${params.id}/views`, { method: 'POST' })
      } catch (error) {
        console.error('Error fetching post:', error)
        setError('Failed to load post')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h1>
          <p className="text-gray-600 dark:text-gray-400">The post you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return <BlogPost post={post} relatedPosts={relatedPosts} />
}