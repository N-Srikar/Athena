// middleware.js
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value
  const role  = req.cookies.get('role')?.value

  // 1) Redirect any /dashboard/* without a token → home
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    // 2) Role‐based guard
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url))
    }
    if (pathname.startsWith('/dashboard/librarian') && role !== 'librarian') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url))
    }
    if (pathname.startsWith('/dashboard/student') && role !== 'student') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url))
    }
  }

  // 3) If you hit home or auth pages while logged in, bounce to your dashboard
  if (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup'
  ) {
    if (token && role) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/' , '/login' , '/signup' , '/dashboard/:path*'],
}
