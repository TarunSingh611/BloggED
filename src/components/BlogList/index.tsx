// app/blog/components/BlogList.tsx
'use client';

import { BlogPost } from '@/type/blog';
import { MotionDiv as Motion } from '@/components/motion';
import { BlogCard } from './BlogCard';
import { stagger, fadeInUp } from '@/lib/animation';

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <Motion
      initial="initial"
      animate="animate"
      variants={stagger}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {posts.map((post, index) => (
        <Motion
          key={post.id}
          variants={fadeInUp}
          transition={{ delay: index * 0.1 }}
        >
          <BlogCard post={post} />
        </Motion>
      ))}
    </Motion>
  );
}