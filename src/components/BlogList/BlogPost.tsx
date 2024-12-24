'use client';

import { BlogPost as BlogPostType } from '@/type/blog';
import { MotionDiv } from '@/components/motion';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface BlogPostProps {
  post: BlogPostType;
}

export function BlogPost({ post }: BlogPostProps) {
  const [mdxContent, setMdxContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function prepareMDX() {
      try {
        // First, ensure the content is a string
        const contentString = typeof post?.content === 'string' 
          ? post.content 
          : String(post?.content || '');

        // Serialize with proper options and plugins
        const mdxSource = await serialize(contentString, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeHighlight],
            format: 'mdx',
          },
          parseFrontmatter: true,
        });

        setMdxContent(mdxSource);
        setError(null);
      } catch (err) {
        console.error('MDX Processing Error:', err);
        setError('Failed to process content');
        // Fallback to raw content display
        setMdxContent({ compiledSource: post?.content || '' });
      }
    }

    prepareMDX();
  }, [post?.content]);

  // Render loading state
  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          {post.description && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {post.description}
            </p>
          )}
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              {post.author.image && (
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p>{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span>{post.views} views</span>
            </div>
          </div>
        </header>

        {post.coverImage && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden"
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </MotionDiv>
        )}

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="prose dark:prose-invert max-w-none"
        >
          {error ? (
            // Fallback content display
            <div className="whitespace-pre-wrap">
              {post.content}
            </div>
          ) : mdxContent ? (
            <MDXRemote {...mdxContent} />
          ) : (
            <div>Loading content...</div>
          )}
        </MotionDiv>
      </MotionDiv>
    </article>
  );
}