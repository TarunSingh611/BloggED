// components/BlogPost.tsx
import { format } from 'date-fns'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MotionArticle } from './motion'

interface BlogPostProps {
  post: {
    id: string
    title: string
    description: string
    content: string
    createdAt: Date
    author: {
      name: string
      image: string
    }
  }
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <MotionArticle
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={post.author.image || '/default-avatar.png'}
            alt={post.author.name}
            className="h-10 w-10 rounded-full mr-4"
          />
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-gray-500 text-sm">
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
        
        <Link href={`/blog/${post.id}`}>
          <h2 className="text-2xl font-bold mb-4 hover:text-indigo-600">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-gray-600 mb-4">{post.description}</p>
        
        <Link
          href={`/blog/${post.id}`}
          className="text-indigo-600 font-medium hover:text-indigo-500"
        >
          Read More →
        </Link>
      </div>
    </MotionArticle>
  )
}