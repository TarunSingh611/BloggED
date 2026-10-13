import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPost from '@/components/BlogPost'
import { getContentById, getContents, incrementContentViews } from '@/lib/db/content'

interface BlogPostPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getContentById(params.id)
    if (!post) return { title: 'Story not found' }
    return {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || post.description || undefined,
    }
  } catch {
    return { title: 'Story' }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getContentById(params.id).catch(() => null)
  if (!post || !post.published) {
    notFound()
  }

  await incrementContentViews(post.slug || post.id).catch(() => undefined)
  const allPosts = await getContents({ take: 8 }).catch(() => [])
  const relatedPosts = allPosts.filter((item) => item.id !== post.id).slice(0, 3)

  return <BlogPost post={post as never} relatedPosts={relatedPosts as never[]} />
}
