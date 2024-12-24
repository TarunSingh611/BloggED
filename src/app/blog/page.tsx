// app/blog/page.tsx
import { getContents } from '@/lib/db/content';
import { BlogList } from '@/components/BlogList';
import { MotionDiv } from '@/components/motion';

export const revalidate = 60; // revalidate every minute

export default async function BlogPage() {
  const posts:any = await getContents({ published: true });

  return (
    <div className="container mx-auto px-4 py-8">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-gray-600 mb-8">
          Explore our latest articles and insights
        </p>
      </MotionDiv>
      
      <BlogList posts={posts} />
    </div>
  );
}