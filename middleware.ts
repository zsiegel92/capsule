import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from 'next/headers';

// https://nextjs.org/docs/pages/building-your-application/routing/middleware#matcher
export const config = {
    matcher: ['/partner', '/author', '/capsules', '/test_python'], // This cannot be an expression except a literal! Very weird way this file is parsed: https://nextjs.org/docs/messages/invalid-page-config
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
};

const PROTECTED_ROUTES_SET = new Set(config.matcher);
// const PROTECTED_PREFIX = '/app'

export default async function middleware(req: NextRequest) {
    // Get the pathname of the request (e.g. /, /protected)
    const path = req.nextUrl.pathname;
    // If it's the root path, just render it
    // if (path === '/') {
    //     return NextResponse.next();
    // }
    return NextResponse.next();
    const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });
    console.log('GOT TOKEN');
    console.log(session);
    // console.log('***SESSION***', session);
    // if (!session) { //&& (path.startsWith(PROTECTED_PREFIX) || PROTECTED_ROUTES_SET.has(path))
    if (!session && PROTECTED_ROUTES_SET.has(path)) {
        //&& (path.startsWith(PROTECTED_PREFIX) || PROTECTED_ROUTES_SET.has(path))
        console.log(`redirecting to login due to no session at path ${path}`);
        return NextResponse.redirect(new URL('/login', req.url));
    }
    // else if (session && (path === "/login" || path === "/register")) {
    //   return NextResponse.redirect(new URL("/protected", req.url));
    // }
    return NextResponse.next();
}


