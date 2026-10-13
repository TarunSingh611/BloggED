export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { clientIp, rateLimit } from '@/lib/rate-limit'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  if (!rateLimit(`newsletter:${clientIp(request)}`, 5, 60 * 60_000)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 })
  }

  const email = body && typeof body === 'object' && typeof (body as { email?: unknown }).email === 'string'
    ? (body as { email: string }).email.trim().toLowerCase()
    : ''

  if (!emailPattern.test(email) || email.length > 120) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }

  try {
    await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter signup failed:', error)
    return NextResponse.json({ error: 'Could not save that subscription.' }, { status: 502 })
  }
}
