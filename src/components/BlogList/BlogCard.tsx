// app/blog/components/BlogCard.tsx
'use client';

import { BlogPost } from '@/type/blog';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { MotionDiv as Motion } from '@/components/motion';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Motion
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="card card-hover group h-full flex flex-col"
    >
      <Link href={`/blog/${post?.id}`} className="flex-1 flex flex-col">
        {post.coverImage && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {post.featured && (
              <div className="absolute top-3 left-3">
                <span className="tag bg-indigo-600 text-white">
                  Featured
                </span>
              </div>
            )}
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center mb-3">
            {post.author.image && (
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={32}
                height={32}
                className="rounded-full mr-3"
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-900 dark:text-white">
                {post.author.name || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          
          <h2 className="heading-3 text-lg mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="body-text mb-4 flex-1 line-clamp-3">
            {post.excerpt || post.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.views || 0} views
            </div>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
              Read More →
            </span>
          </div>
        </div>
      </Link>
    </Motion>
  );
}