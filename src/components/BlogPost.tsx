// components/BlogPost.tsx
'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MotionArticle } from './motion'
import Feedback from './Feedback'
import RelatedPosts from './RelatedPosts'
import { calculateReadingTime, formatReadingTime, formatContent } from '@/lib/utils'

interface BlogPostProps {
  post: {
    id: string
    title: string
    description?: string
    content: string
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
  relatedPosts?: any[]
}

export default function BlogPost({ post, relatedPosts }: BlogPostProps) {
  const readingTime = calculateReadingTime(post.content)
  
  return (
    <MotionArticle
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Hero Section */}
      {post.coverImage && (
        <div className="relative h-64 md:h-96 overflow-hidden rounded-xl mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          {post.featured && (
            <div className="absolute top-4 left-4">
              <span className="tag bg-indigo-600 text-white">
                Featured
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Article Content */}
      <div className="card p-8 md:p-12">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <img
              src={post.author.image || '/default-avatar.png'}
              alt={post.author.name || 'Author'}
              className="h-12 w-12 rounded-full mr-4"
            />
            <div className="flex-1">
              <p className="font-medium text-lg text-gray-900 dark:text-white">
                {post.author.name || 'Anonymous'}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {format(new Date(post.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
                               <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                     <div className="flex items-center">
                       <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                       </svg>
                       {post.views} views
                     </div>
                     <div className="flex items-center">
                       <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                       {formatReadingTime(readingTime)}
                     </div>
                   </div>
          </div>
          
          <h1 className="heading-1 text-3xl md:text-4xl mb-6">
            {post.title}
          </h1>
          
          {post.description && (
            <p className="body-text text-xl mb-8 leading-relaxed text-gray-600 dark:text-gray-300">
              {post.description}
            </p>
          )}
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-200 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-ul:text-gray-700 dark:prose-ul:text-gray-200 prose-ol:text-gray-700 dark:prose-ol:text-gray-200 prose-li:text-gray-700 dark:prose-li:text-gray-200 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300 prose-code:text-gray-900 dark:prose-code:text-white prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-gray-800 dark:prose-pre:text-gray-200 prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-6 prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-5 prose-p:leading-relaxed prose-p:mb-4 prose-p:first:mt-0 prose-p:last:mb-0 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-1 prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: formatContent(post.content) 
            }} 
          />
        </div>
        
        {/* Article Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <img
                src={post.author.image || '/default-avatar.png'}
                alt={post.author.name || 'Author'}
                className="h-10 w-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Written by {post.author.name || 'Anonymous'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link
                href="/blog"
                className="btn-secondary flex items-center"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blog
              </Link>
            </div>
          </div>

          {/* Social Sharing & Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Share:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="p-2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                    title="Share on Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
                    title="Share on Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="p-2 text-blue-700 hover:text-blue-900 dark:hover:text-blue-500 transition-colors"
                    title="Share on LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    // You could add a toast notification here
                  }}
                  className="btn-secondary text-sm px-3 py-1 flex items-center"
                  title="Copy link"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </button>
                <button
                  onClick={() => {
                    const embedCode = `<iframe src="${window.location.href}" width="100%" height="600" frameborder="0"></iframe>`
                    navigator.clipboard.writeText(embedCode)
                    // You could add a toast notification here
                  }}
                  className="btn-secondary text-sm px-3 py-1 flex items-center"
                  title="Copy embed code"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Embed
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-8">
          <Feedback postId={post.id} postTitle={post.title} />
        </div>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <RelatedPosts currentPostId={post.id} posts={relatedPosts} />
        )}
      </div>
    </MotionArticle>
  )
}