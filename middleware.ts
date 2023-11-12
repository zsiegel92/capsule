import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = new Set(["/protected", "/protected2"])
const PROTECTED_PREFIX = '/app'

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

  if (!session && (path.startsWith(PROTECTED_PREFIX) || PROTECTED_ROUTES.has(path))) {
    return NextResponse.redirect(new URL("/login", req.url));
  } 
  // else if (session && (path === "/login" || path === "/register")) {
  //   return NextResponse.redirect(new URL("/protected", req.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: PROTECTED_ROUTES
}
