export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ bookmarks: [], favorites: [] }, { status: 200 })
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ bookmarks: [], favorites: [] }, { status: 200 })

    const [bookmarks, favorites] = await Promise.all([
      prisma.bookmark.findMany({ where: { userId: user.id }, include: { content: true } }),
      prisma.reaction.findMany({ where: { userId: user.id, type: 'FAVORITE' }, include: { content: true } }),
    ])

    return NextResponse.json({
      bookmarks: bookmarks.map(b => b.content),
      favorites: favorites.map(f => f.content),
    })
  } catch (e) {
    console.error('Error fetching saved items', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}


