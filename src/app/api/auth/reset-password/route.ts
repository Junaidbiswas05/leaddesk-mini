import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 })
    }

    const secret = process.env.NEXTAUTH_SECRET || 'fallback_secret'
    
    let decoded: any
    try {
      decoded = jwt.verify(token, secret)
    } catch (e) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    const userId = decoded.userId
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.adminUser.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword }
    })

    return NextResponse.json({ success: true, message: 'Password updated successfully' })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
