// app/blog/[id]/page.tsx
import { getContentById } from '@/lib/db/content';
import { notFound } from 'next/navigation';
import { BlogPost } from '@/components/BlogList/BlogPost';
import { incrementContentViews } from '@/lib/db/content';

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post:any = await getContentById(params.id);

  if (!post || !post.published) {
    notFound();
  }

  // Increment views
  await incrementContentViews(post.id);

  return <BlogPost post={post} />;
}