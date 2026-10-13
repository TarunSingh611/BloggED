import { fetchPublishedPosts } from '@/lib/cms'
import { escapeHtml } from '@/lib/text'

export const dynamic = 'force-dynamic'

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
  let posts: Awaited<ReturnType<typeof fetchPublishedPosts>> = []
  try {
    posts = await fetchPublishedPosts({ take: 30 })
  } catch {
    posts = []
  }

  const items = posts.map((post) => {
    const link = `${site}/blog/${post.slug || post.id}`
    const summary = post.excerpt || post.description || ''
    return `
      <item>
        <title>${escapeHtml(post.title)}</title>
        <link>${escapeHtml(link)}</link>
        <guid>${escapeHtml(link)}</guid>
        <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
        <description>${escapeHtml(summary)}</description>
      </item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>BloggED</title>
        <link>${escapeHtml(site)}</link>
        <description>Stories published by the Content Studio.</description>
        ${items}
      </channel>
    </rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
