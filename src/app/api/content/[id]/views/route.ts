import { NextResponse } from 'next/server'
import { incrementContentViews } from '@/lib/db/content'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { recordView } from '@/lib/db/analytics'

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await incrementContentViews(params.id)
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    let userId: string | null = null
    if (email) {
      const { prisma } = await import('@/lib/prisma')
      const u = await prisma.user.findUnique({ where: { email } })
      userId = u?.id || null
    }
    await recordView(params.id, userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error incrementing views:', error)
    return NextResponse.json(
      { error: 'Failed to increment views' },
      { status: 500 }
    )
  }
}


