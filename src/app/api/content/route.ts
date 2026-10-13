export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getContents } from '@/lib/db/content'
import { CmsError } from '@/lib/cms'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const take = searchParams.get('take')
    const skip = searchParams.get('skip')
    const posts = await getContents({
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      take: take ? Number.parseInt(take, 10) : undefined,
      skip: skip ? Number.parseInt(skip, 10) : undefined,
      searchQuery: searchParams.get('q') || undefined,
      tag: searchParams.get('tag') || undefined,
    })
    return NextResponse.json(posts)
  } catch (error) {
    const status = error instanceof CmsError ? error.status : 502
    const message = error instanceof Error ? error.message : 'Failed to fetch posts'
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Stories are written in the Content Studio. This site only publishes what that studio releases.' },
    { status: 403 }
  )
}
