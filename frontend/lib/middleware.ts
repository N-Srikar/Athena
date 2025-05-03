// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Map roles to their allowed base path:
const ROLE_DASHBOARD: Record<string,string> = {
  admin: '/dashboard/admin',
  librarian: '/dashboard/librarian',
  student: '/dashboard/student',
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Public pages: home and auth
  const isPublic = pathname === '/' || pathname.startsWith('/auth');

  // 2) Protected pages: everything under /dashboard
  const isProtected = pathname.startsWith('/dashboard');

  // Read cookies
  const token = req.cookies.get('token')?.value;
  const role  = req.cookies.get('role')?.value;

  // If user is *not* logged in:
  if (!token) {
    // Trying to hit a protected page? → redirect to login
    if (isProtected) {
      const loginUrl = new URL('/auth/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
    // Otherwise let them go to / or /auth/*
    return NextResponse.next();
  }

  // If user *is* logged in and tries to hit public pages:
  if (token && isPublic) {
    // Send them straight to their dashboard
    const dash = ROLE_DASHBOARD[role!] || '/';
    return NextResponse.redirect(new URL(dash, req.url));
  }

  // If user *is* logged in and is hitting a dashboard:
  if (isProtected) {
    // Which dashboard they’re on
    const [, , section] = pathname.split('/'); // ['', 'dashboard', 'admin'|'librarian'|'student', ...]
    const allowed = ROLE_DASHBOARD[role!].split('/').pop();
    if (section !== allowed) {
      // Trying to access someone else’s area: redirect them to their own
      const dash = ROLE_DASHBOARD[role!];
      return NextResponse.redirect(new URL(dash, req.url));
    }
  }

  // Otherwise, allow
  return NextResponse.next();
}

// Tell Next.js which paths to run this on:
export const config = {
  matcher: [
    /*
     * Match everything except public files and next.js internals:
     * '/', '/auth/*', '/dashboard/*'
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
