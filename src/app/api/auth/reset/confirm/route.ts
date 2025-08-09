export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()
    if (!token || !password) return NextResponse.json({ error: 'Invalid' }, { status: 400 })

    const record = await prisma.passwordResetToken.findFirst({ where: { token, used: false } })
    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 })
    }

    const hashed = await hash(password, 10)
    await prisma.user.update({ where: { id: record.userId }, data: { password: hashed } })
    await prisma.passwordResetToken.update({ where: { id: record.id }, data: { used: true } })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}


