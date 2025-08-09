// app/blog/[id]/page.tsx
import { notFound } from 'next/navigation'
import BlogPost from '@/components/BlogPost'
import { getContentById, getContents } from '@/lib/db/content'

interface BlogPostPageProps {
  params: { id: string }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getContentById(params.id)
  if (!post || !post.published) {
    notFound()
  }

  const allPosts = await getContents({ published: true, take: 10 })
  const relatedPosts = (allPosts || []).filter((p: any) => p.id !== post.id).slice(0, 3)

  return <BlogPost post={post as any} relatedPosts={relatedPosts as any[]} />
}