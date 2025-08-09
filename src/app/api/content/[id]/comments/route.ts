import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch all comments for this content and build a threaded tree
    const all = await prisma.comment.findMany({
      where: { contentId: params.id },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, name: true, image: true } } },
    })

    type C = typeof all[number] & { replies?: any[] }
    const idToNode = new Map<string, C>()
    const roots: C[] = []
    all.forEach((c) => idToNode.set(c.id, { ...c, replies: [] }))
    idToNode.forEach((c) => {
      if ((c as any).parentId) {
        const parent = idToNode.get((c as any).parentId as unknown as string)
        if (parent) parent.replies!.push(c)
        else roots.push(c) // orphan safety
      } else {
        roots.push(c)
      }
    })
    // Sort roots desc by createdAt, replies asc by createdAt
    roots.sort((a, b) => (b.createdAt as any) - (a.createdAt as any))
    const sortReplies = (node: C) => {
      if (node.replies && node.replies.length) {
        node.replies.sort((a, b) => (a.createdAt as any) - (b.createdAt as any))
        node.replies.forEach(sortReplies as any)
      }
    }
    roots.forEach(sortReplies)

    return NextResponse.json(roots)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      // instruct client to redirect
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'x-require-auth': 'true' } as any })
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { text, parentId } = await request.json()
    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Comment text required' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: { text: text.trim(), contentId: params.id, userId: user.id, ...(parentId ? { parentId } : {}) },
      include: {
        user: { select: { id: true, name: true, image: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, name: true, image: true } } },
        },
      },
    })
    await prisma.content.update({
      where: { id: params.id },
      data: { comments: { increment: 1 } },
    })
    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}


