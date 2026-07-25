import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    // Protect the entire admin UI — except login, forgot-password, reset-password
    '/admin',
    '/admin/((?!login|forgot-password|reset-password).*)',

    // Protect admin API routes (create admin, etc.)
    '/api/admin/:path*',

    // Protect lead status PATCH (not POST which is public for form submissions)
    '/api/leads/:id+'
  ]
}
