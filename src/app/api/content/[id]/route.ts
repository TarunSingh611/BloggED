export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getContentById } from '@/lib/db/content'
import { CmsError } from '@/lib/cms'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await getContentById(params.id)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    const status = error instanceof CmsError ? error.status : 502
    const message = error instanceof Error ? error.message : 'Failed to fetch post'
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Edit this story in the Content Studio.' },
    { status: 403 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Delete this story in the Content Studio.' },
    { status: 403 }
  )
}
