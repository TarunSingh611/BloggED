import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { recordVote } from '@/lib/db/analytics'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { type } = await request.json()
    if (!type) return NextResponse.json({ error: 'Missing reaction type' }, { status: 400 })

    // Support exclusive UPVOTE/DOWNVOTE logic; for other reaction types, simple toggle
    const isVote = type === 'UPVOTE' || type === 'DOWNVOTE'

    if (isVote) {
      // Check if user already has this vote
      const existingSame = await prisma.reaction.findFirst({
        where: { contentId: params.id, userId: user.id, type },
      })
      if (existingSame) {
        await prisma.reaction.delete({ where: { id: existingSame.id } })
        await recordVote(params.id, existingSame.type as any, -1)
        // Return updated counts
        const [upvotes, downvotes] = await Promise.all([
          prisma.reaction.count({ where: { contentId: params.id, type: 'UPVOTE' } }),
          prisma.reaction.count({ where: { contentId: params.id, type: 'DOWNVOTE' } }),
        ])
        return NextResponse.json({ removed: true, upvotes, downvotes, userVote: null })
      }

      // Remove opposite vote if exists
      const oppositeType = type === 'UPVOTE' ? 'DOWNVOTE' : 'UPVOTE'
      const existingOpposite = await prisma.reaction.findFirst({
        where: { contentId: params.id, userId: user.id, type: oppositeType },
      })
      if (existingOpposite) {
        await prisma.reaction.delete({ where: { id: existingOpposite.id } })
        await recordVote(params.id, oppositeType as any, -1)
      }

      await prisma.reaction.create({ data: { contentId: params.id, userId: user.id, type } })
      await recordVote(params.id, type as any, 1)

      const [upvotes, downvotes] = await Promise.all([
        prisma.reaction.count({ where: { contentId: params.id, type: 'UPVOTE' } }),
        prisma.reaction.count({ where: { contentId: params.id, type: 'DOWNVOTE' } }),
      ])
      return NextResponse.json({ upvotes, downvotes, userVote: type })
    }

    // Fallback: simple toggle for non-vote reaction types
    const existing = await prisma.reaction.findFirst({ where: { contentId: params.id, userId: user.id, type } })
    if (existing) {
      await prisma.reaction.delete({ where: { id: existing.id } })
      await recordVote(params.id, type, -1 as any)
      return NextResponse.json({ removed: true })
    }

    const reaction = await prisma.reaction.create({ data: { contentId: params.id, userId: user.id, type } })
    await recordVote(params.id, type, 1 as any)
    return NextResponse.json(reaction)
  } catch (error) {
    console.error('Error handling reaction:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const qType = searchParams.get('type')
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    let userVote: 'UPVOTE' | 'DOWNVOTE' | null = null

    if (email) {
      const user = await prisma.user.findUnique({ where: { email } })
      if (user) {
        if (qType) {
          const existing = await prisma.reaction.findFirst({ where: { contentId: params.id, userId: user.id, type: qType } })
          return NextResponse.json({ has: !!existing })
        }
        const existingVote = await prisma.reaction.findFirst({
          where: { contentId: params.id, userId: user.id, type: { in: ['UPVOTE', 'DOWNVOTE'] } },
        })
        userVote = (existingVote?.type as any) || null
      }
    }

    const [upvotes, downvotes] = await Promise.all([
      prisma.reaction.count({ where: { contentId: params.id, type: 'UPVOTE' } }),
      prisma.reaction.count({ where: { contentId: params.id, type: 'DOWNVOTE' } }),
    ])

    return NextResponse.json({ upvotes, downvotes, userVote })
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
