export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { escapeHtml, plainText } from '@/lib/text'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  if (!rateLimit(`contact:${clientIp(request)}`, 5, 15 * 60_000)) {
    return NextResponse.json({ error: 'Too many messages. Try again later.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 })
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 })
  }

  const raw = body as Record<string, unknown>
  const name = plainText(raw.name, 80)
  const email = typeof raw.email === 'string' ? raw.email.trim().toLowerCase() : ''
  const subject = plainText(raw.subject, 120)
  const message = plainText(raw.message, 5000)

  if (name.length < 2 || subject.length < 3 || message.length < 10 || !emailPattern.test(email)) {
    return NextResponse.json(
      { error: 'Enter a name, a valid email, a subject, and a message of at least 10 characters.' },
      { status: 400 }
    )
  }

  if (!process.env.EMAIL_ADDRESS || !process.env.EMAIL_PASSWORD || !process.env.EMAIL_SERVER) {
    return NextResponse.json({ error: 'Mail is not configured.' }, { status: 502 })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: (process.env.EMAIL_PASSWORD || '').replace(/\s+/g, ''),
      },
    })

    const toAddress = process.env.CONTACT_TO_EMAIL || process.env.EMAIL_ADDRESS
    const fromName = process.env.EMAIL_NAME || 'BloggED'

    await transporter.sendMail({
      from: `${fromName} <${process.env.EMAIL_ADDRESS}>`,
      to: toAddress,
      subject: `[Contact] ${subject}`,
      replyTo: email,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact email failed:', error)
    return NextResponse.json({ error: 'The message could not be sent.' }, { status: 502 })
  }
}
