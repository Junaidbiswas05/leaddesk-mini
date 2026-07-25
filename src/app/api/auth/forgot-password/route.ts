import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    const user = await prisma.adminUser.findUnique({
      where: { email }
    })

    if (!user) {
      // Return 200 even if not found to prevent email enumeration attacks
      return NextResponse.json({
        success: true,
        message: 'If this email is registered, a reset link has been sent.'
      })
    }

    // Generate JWT token valid for 15 minutes
    const secret = process.env.NEXTAUTH_SECRET || 'fallback_secret'
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '15m' })

    const requestUrl = new URL(request.url)
    const baseUrl = process.env.NEXTAUTH_URL || `${requestUrl.protocol}//${requestUrl.host}`
    const resetLink = `${baseUrl}/admin/reset-password?token=${token}`

    const smtpConfigured =
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_PASS !== 'YOUR_GMAIL_APP_PASSWORD_HERE' &&
      process.env.SMTP_PASS !== 'dummy_password_for_now' &&
      process.env.SMTP_PASS !== 'dummy_password'

    if (smtpConfigured) {
      // Send real email
      const { sendPasswordResetEmail } = await import('@/lib/email')
      await sendPasswordResetEmail({ toEmail: user.email, resetLink })
      console.log(`[EMAIL SENT] Password reset link sent to: ${user.email}`)

      return NextResponse.json({
        success: true,
        message: `Reset link sent to ${user.email}. Check your inbox (and spam folder).`
      })
    } else {
      // SMTP not configured — return link directly (dev/local mode)
      console.log(`[DEV MODE] Reset link for ${user.email}: ${resetLink}`)
      return NextResponse.json({
        success: true,
        message: 'Reset link generated (SMTP not configured — link shown below for testing).',
        resetLink
      })
    }

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

