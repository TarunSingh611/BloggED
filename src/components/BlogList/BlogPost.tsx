'use client';

import Link from 'next/link'
import { format } from 'date-fns'
import { MotionDiv } from '@/components/motion'

interface BlogPostProps {
  post: {
    id: string
    title: string
    description?: string
    excerpt?: string
    coverImage?: string
    tags?: string[]
    published: boolean
    featured?: boolean
    createdAt: string
    updatedAt: string
    views: number
    author?: {
      id: string
      name?: string
      image?: string
    }
  }
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <MotionDiv
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {post.coverImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {post.featured && (
            <div className="absolute top-4 left-4">
              <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {post.author?.image && (
              <img
                src={post.author.image}
                alt={post.author.name || 'Author'}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm text-gray-600">
              {post.author?.name || 'Anonymous'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {format(new Date(post.createdAt), 'MMM dd, yyyy')}
          </span>
        </div>

        <h3 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">
          {post.title}
        </h3>
        
        {post.description && (
          <p className="text-gray-600 mb-3 line-clamp-3">
            {post.description}
          </p>
        )}

        {post.excerpt && !post.description && (
          <p className="text-gray-600 mb-3 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link
            href={`/blog/${post.id}`}
            className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors"
          >
            Read More →
          </Link>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{post.views} views</span>
          </div>
        </div>
      </div>
    </MotionDiv>
  )
}