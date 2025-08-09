export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { value } = await request.json()
    const ratingValue = Number(value)
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
    }

    const existing = await prisma.rating.findFirst({ where: { contentId: params.id, userId: user.id } })
    const rating = existing
      ? await prisma.rating.update({ where: { id: existing.id }, data: { value: ratingValue } })
      : await prisma.rating.create({ data: { contentId: params.id, userId: user.id, value: ratingValue } })

    return NextResponse.json(rating)
  } catch (error) {
    console.error('Error handling rating:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}


