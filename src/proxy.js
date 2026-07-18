import { NextResponse } from 'next/server';

/**
 * BeautyVault Proxy (formerly middleware)
 * Runs on every matched request server-side.
 * Currently a pass-through — extend for auth guards, redirects, etc.
 */
export function proxy(request) {
  return NextResponse.next();
}

export const config = {
  // Match all routes except Next.js internals and static files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
