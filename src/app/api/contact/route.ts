export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const toAddress = process.env.CONTACT_TO_EMAIL || process.env.EMAIL_ADDRESS
    const fromName = process.env.EMAIL_NAME || 'Contact Form'

    await transporter.sendMail({
      from: `${fromName} <${process.env.EMAIL_ADDRESS}>`,
      to: toAddress,
      subject: `[Contact] ${subject}`,
      replyTo: email,
      text: `From: ${name} <${email}>
Subject: ${subject}

${message}`,
      html: `
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact email failed:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}


