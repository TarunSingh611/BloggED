export type PublicPost = {
  id: string
  title: string
  description?: string | null
  content: string
  excerpt?: string | null
  coverImage?: string | null
  published: boolean
  featured?: boolean
  tags?: string[]
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string[]
  slug?: string
  views: number
  likes?: number
  shares?: number
  comments?: number
  readingTime?: number | null
  createdAt: string
  updatedAt: string
  authorId?: string
  author: {
    id: string
    name?: string | null
    image?: string | null
  }
}

export class CmsError extends Error {
  status: number

  constructor(message: string, status = 502) {
    super(message)
    this.status = status
  }
}

function cmsBase() {
  const base = process.env.CMS_BASE_URL || process.env.NEXT_PUBLIC_CMS_URL
  if (!base) {
    throw new CmsError('CMS_BASE_URL is not set. BloggED reads published stories from the Content Studio.', 503)
  }
  return base.replace(/\/$/, '')
}

function writeHeaders() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (process.env.CONTENT_API_KEY) headers['x-content-key'] = process.env.CONTENT_API_KEY
  return headers
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new CmsError('The Content Studio could not return published stories.', response.status === 404 ? 404 : 502)
  }
  return response.json() as Promise<T>
}

export async function fetchPublishedPosts(options?: {
  featured?: boolean
  take?: number
  skip?: number
  searchQuery?: string
  tag?: string
}) {
  const url = new URL('/api/public/content', cmsBase())
  if (options?.featured) url.searchParams.set('featured', 'true')
  if (options?.take) url.searchParams.set('take', String(options.take))
  if (options?.skip) url.searchParams.set('skip', String(options.skip))
  if (options?.searchQuery) url.searchParams.set('q', options.searchQuery)
  if (options?.tag) url.searchParams.set('tag', options.tag)

  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
  const data = await readJson<{ posts: PublicPost[]; catalog?: { totalPosts: number; totalViews: number; featuredPosts: number } }>(response)
  return data.posts ?? []
}

export async function fetchPublishedCatalog() {
  const url = new URL('/api/public/content', cmsBase())
  url.searchParams.set('take', '1')
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
  const data = await readJson<{ catalog: { totalPosts: number; totalViews: number; featuredPosts: number } }>(response)
  return data.catalog
}

export async function fetchPublishedPost(slugOrId: string) {
  const url = new URL(`/api/public/content/${encodeURIComponent(slugOrId)}`, cmsBase())
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
  if (response.status === 404) return null
  return readJson<PublicPost>(response)
}

export async function recordPublishedView(slugOrId: string) {
  const url = new URL(`/api/public/content/${encodeURIComponent(slugOrId)}/view`, cmsBase())
  const response = await fetch(url, { method: 'POST', headers: writeHeaders(), cache: 'no-store', signal: AbortSignal.timeout(8000) })
  if (!response.ok && response.status !== 401) {
    throw new CmsError('The Content Studio did not record this view.', 502)
  }
}

export async function fetchPublishedComments(slugOrId: string) {
  const url = new URL(`/api/public/content/${encodeURIComponent(slugOrId)}/comments`, cmsBase())
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
  return readJson<unknown[]>(response)
}

export async function createPublishedComment(
  slugOrId: string,
  body: { text: string; authorName: string; authorEmail: string; parentId?: string }
) {
  const url = new URL(`/api/public/content/${encodeURIComponent(slugOrId)}/comments`, cmsBase())
  const response = await fetch(url, {
    method: 'POST',
    headers: writeHeaders(),
    body: JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  })
  if (response.status === 400 || response.status === 401 || response.status === 429) {
    const payload = await response.json().catch(() => ({ error: 'Comment was rejected' }))
    throw new CmsError(payload.error || 'Comment was rejected', response.status)
  }
  return readJson<unknown>(response)
}
