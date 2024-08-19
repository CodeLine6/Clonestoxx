import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
export { default } from 'next-auth/middleware';

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sign-in',
    '/sign-up',
    '/',
    '/verify/:path*'
  ],
}
 
// This function can be marked `async` if using `await` inside
export async function middleware(request) {

  const token = await getToken({ req: request })
  const url= request.nextUrl

  if(token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/'
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  if(!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
}
