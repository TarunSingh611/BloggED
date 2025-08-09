// app/api/content/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getContents, createContent } from '@/lib/db/content'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const take = searchParams.get('take')
    const skip = searchParams.get('skip')
    const q = searchParams.get('q')

    const options: any = {}
    
    if (published !== null) {
      options.published = published === 'true'
    }
    if (featured !== null) {
      options.featured = featured === 'true'
    }
    if (take) {
      options.take = parseInt(take)
    }
    if (skip) {
      options.skip = parseInt(skip)
    }
    if (q) {
      options.searchQuery = q
    }

    const posts = await getContents(options)
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, content, excerpt, coverImage, published, featured } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Get the user ID from the session
    // You'll need to implement this based on your auth setup
    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const post = await createContent({
      title,
      description,
      content,
      excerpt,
      coverImage,
      published: published || false,
      featured: featured || false,
      authorId: user.id
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

// Helper function to get user by email
async function getUserByEmail(email: string) {
  const { prisma } = await import('@/lib/prisma')
  return prisma.user.findUnique({
    where: { email }
  })
}