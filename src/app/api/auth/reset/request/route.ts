export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ success: true }) // do not reveal

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ success: true })

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour
    await prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt: expires } })

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: 465,
      secure: true,
      auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD },
    })
    const resetUrl = `${process.env.NEXTAUTH_URL || ''}/auth/reset?token=${token}`
    await transporter.sendMail({
      from: `${process.env.EMAIL_NAME || 'Support'} <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: true })
  }
}


