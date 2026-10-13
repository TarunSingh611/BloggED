export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CmsError, createPublishedComment, fetchPublishedComments } from '@/lib/cms'
import { plainText } from '@/lib/text'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await fetchPublishedComments(params.id)
    return NextResponse.json(comments)
  } catch (error) {
    const status = error instanceof CmsError ? error.status : 502
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 })
    }

    const raw = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
    const text = plainText(raw.text, 2000)
    if (!text) {
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 })
    }

    const authorName = plainText(session.user.name, 80)
    const comment = await createPublishedComment(params.id, {
      text,
      authorName: authorName.length >= 2 ? authorName : 'Reader',
      authorEmail: session.user.email,
      parentId: typeof raw.parentId === 'string' ? raw.parentId : undefined,
    })
    return NextResponse.json(comment)
  } catch (error) {
    const status = error instanceof CmsError ? error.status : 502
    const message = error instanceof Error ? error.message : 'Failed to create comment'
    return NextResponse.json({ error: message }, { status })
  }
}
