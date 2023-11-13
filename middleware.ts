import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/partner", '/']
// const UNPROTECTED_ROUTES = ['/', '/login', '/register']

// const PROTECTED_ROUTES_SET = new Set(PROTECTED_ROUTES)
// const PROTECTED_PREFIX = '/app'

export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname;

  // If it's the root path, just render it
  if (path === "/") {
    return NextResponse.next();
  }

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!session) { //&& (path.startsWith(PROTECTED_PREFIX) || PROTECTED_ROUTES_SET.has(path))
    return NextResponse.redirect(new URL("/login", req.url));
  } 
  // else if (session && (path === "/login" || path === "/register")) {
  //   return NextResponse.redirect(new URL("/protected", req.url));
  // }
  return NextResponse.next();
}

// https://nextjs.org/docs/pages/building-your-application/routing/middleware#matcher
export const config = {
  matcher: PROTECTED_ROUTES,
  //   matcher: [
  //     /*
  //  * Match all request paths except for the ones starting with:
  //  * - api (API routes)
  //  * - _next/static (static files)
  //  * - _next/image (image optimization files)
  //  * - favicon.ico (favicon file)
  //  */
  //     '/((?!login|register|_next/static|_next/image|favicon.ico).*)',
  //   ]
}
