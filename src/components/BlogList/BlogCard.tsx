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
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
    >
      <Link href={`/blog/${post?.id}`}>
        {post.coverImage && (
          <div className="relative h-48 w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {post.excerpt || post.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              {post.author.image && (
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span>{post.author.name}</span>
            </div>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </Link>
    </Motion>
  );
}