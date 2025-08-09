import { NextRequest, NextResponse } from 'next/server'
import { recordNextContent } from '@/lib/db/analytics'

export async function POST(request: NextRequest) {
  try {
    const { fromId, toId } = await request.json()
    if (!fromId || !toId) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
    await recordNextContent(fromId, toId)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}


