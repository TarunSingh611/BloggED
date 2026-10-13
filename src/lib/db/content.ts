import { fetchPublishedCatalog, fetchPublishedPost, fetchPublishedPosts, recordPublishedView } from '../cms'

interface GetContentsOptions {
  published?: boolean
  featured?: boolean
  take?: number
  skip?: number
  searchQuery?: string
  tag?: string
}

export async function getContents(options?: GetContentsOptions) {
  return fetchPublishedPosts({
    featured: options?.featured,
    take: options?.take,
    skip: options?.skip,
    searchQuery: options?.searchQuery,
    tag: options?.tag,
  })
}

export async function getContentById(id: string) {
  return fetchPublishedPost(id)
}

export async function incrementContentViews(id: string): Promise<void> {
  await recordPublishedView(id)
}

export async function getFeaturedContents(limit = 3) {
  return fetchPublishedPosts({ featured: true, take: limit })
}

export async function getDashboardStats() {
  return fetchPublishedCatalog()
}
