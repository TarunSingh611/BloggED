import { NextResponse } from 'next/server'
import { incrementContentViews } from '@/lib/db/content'
import { CmsError } from '@/lib/cms'

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await incrementContentViews(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    const status = error instanceof CmsError ? error.status : 502
    console.error('Error incrementing views:', error)
    return NextResponse.json({ error: 'Failed to increment views' }, { status })
  }
}
