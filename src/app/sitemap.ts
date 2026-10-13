import type { MetadataRoute } from 'next'
import { fetchPublishedPosts } from '@/lib/cms'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
  let posts: Awaited<ReturnType<typeof fetchPublishedPosts>> = []
  try {
    posts = await fetchPublishedPosts({ take: 50 })
  } catch {
    posts = []
  }

  return [
    { url: site, changeFrequency: 'daily', priority: 1 },
    { url: `${site}/blog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${site}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${site}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    ...posts.map((post) => ({
      url: `${site}/blog/${post.slug || post.id}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
