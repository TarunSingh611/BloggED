import { NextRequest, NextResponse } from 'next/server'
import { recordTimeOnPageSample } from '@/lib/db/analytics'

export async function POST(request: NextRequest) {
  try {
    const { contentId, timeMs } = await request.json()
    if (!contentId || typeof timeMs !== 'number' || timeMs < 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    await recordTimeOnPageSample(contentId, Math.floor(timeMs))
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}


