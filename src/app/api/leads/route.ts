import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { leadSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Server-side validation with Zod
    const validationResult = leadSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const { name, email, budgetRange, message } = validationResult.data

    // Insert into database
    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        budgetRange,
        message,
        status: 'NEW',
      },
    })

    return NextResponse.json({ success: true, leadId: newLead.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
