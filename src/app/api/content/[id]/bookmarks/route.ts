import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { recordVote } from '@/lib/db/analytics'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const existing = await prisma.bookmark.findFirst({ where: { contentId: params.id, userId: user.id } })
    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } })
      await recordVote(params.id, 'BOOKMARK', -1)
      return NextResponse.json({ removed: true })
    }

    const bookmark = await prisma.bookmark.create({ data: { contentId: params.id, userId: user.id } })
    await recordVote(params.id, 'BOOKMARK', 1)
    return NextResponse.json(bookmark)
  } catch (error) {
    console.error('Error handling bookmark:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ saved: false })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ saved: false })
    const existing = await prisma.bookmark.findFirst({ where: { contentId: params.id, userId: user.id } })
    return NextResponse.json({ saved: !!existing })
  } catch (error) {
    console.error('Error fetching bookmark:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}


