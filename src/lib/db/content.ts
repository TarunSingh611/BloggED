// lib/db/content.ts
import { prisma } from '../prisma'
import type { Prisma } from '@prisma/client'

// Define the type for a content with its author
type ContentWithAuthor = Prisma.ContentGetPayload<{
  include: { author: true }
}>

interface GetContentsOptions {
  published?: boolean
  featured?: boolean
  authorId?: string
  take?: number
  skip?: number
  searchQuery?: string
}

export async function getContents(options?: GetContentsOptions) {
  const where: any = {} // Using any temporarily for where conditions
  
  if (options?.published !== undefined) {
    where.published = options.published
  }
  
  if (options?.featured !== undefined) {
    where.featured = options.featured
  }
  
  if (options?.authorId) {
    where.authorId = options.authorId
  }

  if (options?.searchQuery) {
    where.OR = [
      { title: { contains: options.searchQuery, mode: 'insensitive' } },
      { description: { contains: options.searchQuery, mode: 'insensitive' } },
      { content: { contains: options.searchQuery, mode: 'insensitive' } },
    ]
  }

  return prisma.content.findMany({
    where,
    take: options?.take,
    skip: options?.skip,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// export async function getContentBySlug(slug: string) {
//   return prisma.content.findUnique({
//     where: { slug },
//     include: {
//       author: {
//         select: {
//           id: true,
//           name: true,
//           image: true,
//         },
//       },
//     },
//   })
// }

export async function getContentById(id: string) {
  return prisma.content.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })
}

export async function createContent(data: {
  title: string
  description?: string
  content: string
  slug?: string
  excerpt?: string
  coverImage?: string
  published?: boolean
  featured?: boolean
  authorId: string
}) {
  return prisma.content.create({
    data,
  })
}

export async function updateContent(
  id: string,
  data: {
    title?: string
    description?: string
    content?: string
    slug?: string
    excerpt?: string
    coverImage?: string
    published?: boolean
    featured?: boolean
  }
) {
  return prisma.content.update({
    where: { id },
    data,
  })
}

export async function deleteContent(id: string) {
  return prisma.content.delete({
    where: { id },
  })
}

export async function incrementContentViews(id: string): Promise<void> {
  await prisma.content.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
  })
}

export async function getFeaturedContents(limit = 3) {
  return prisma.content.findMany({
    where: {
      published: true,
      featured: true,
    },
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getTotalViews(): Promise<number> {
  const result = await prisma.content.aggregate({
    _sum: {
      views: true,
    },
  })
  return result._sum.views || 0
}

export async function getDashboardStats() {
  const [totalPosts, totalViews, featuredPosts] = await Promise.all([
    prisma.content.count(),
    getTotalViews(),
    prisma.content.count({
      where: {
        featured: true,
      },
    }),
  ])

  return {
    totalPosts,
    totalViews,
    featuredPosts,
  }
}