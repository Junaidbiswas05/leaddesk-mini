import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    // Must be logged in as admin to create a new admin
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, password, phone } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await prisma.adminUser.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'An admin with this email already exists' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newAdmin = await prisma.adminUser.create({
      data: {
        email,
        phone: phone || null,
        passwordHash: hashedPassword,
      }
    })

    return NextResponse.json({
      success: true,
      message: `Admin account created for ${newAdmin.email}`,
      adminId: newAdmin.id
    }, { status: 201 })

  } catch (error) {
    console.error('Create admin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
