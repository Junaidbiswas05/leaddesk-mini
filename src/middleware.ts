import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname
        
        // Allow public admin routes
        if (
          path.startsWith('/admin/login') ||
          path.startsWith('/admin/forgot-password') ||
          path.startsWith('/admin/reset-password')
        ) {
          return true
        }
        
        // Require auth for everything else matched
        return !!token
      }
    },
    pages: {
      signIn: '/admin/login'
    }
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/leads/:id+'
  ]
}
