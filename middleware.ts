import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Only protect /admin — but NOT /admin/login itself
  if (!path.startsWith('/admin') || path.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  // Check for admin session cookie
  const adminAuth = req.cookies.get('override_admin')?.value
  if (adminAuth === process.env.ADMIN_SECRET) {
    return NextResponse.next()
  }

  // Not authenticated — redirect to login
  const loginUrl = new URL('/admin/login', req.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}