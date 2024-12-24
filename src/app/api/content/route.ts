// app/api/contents/route.ts
import { NextResponse } from 'next/server'
import { getContents } from '@/lib/db/content'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published') === 'true'
    const featured = searchParams.get('featured') === 'true'
    const take = searchParams.get('take') ? parseInt(searchParams.get('take')!) : undefined
    const skip = searchParams.get('skip') ? parseInt(searchParams.get('skip')!) : undefined
    const searchQuery = searchParams.get('search') || undefined

    const contents = await getContents({
      published,
      featured,
      take,
      skip,
      searchQuery,
    })

    return NextResponse.json(contents)
  } catch (error) {
    console.error('Error fetching contents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contents' },
      { status: 500 }
    )
  }
}