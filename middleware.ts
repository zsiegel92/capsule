// import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from 'next/server';

// // https://nextjs.org/docs/pages/building-your-application/routing/middleware#matcher
export const config = {
    matcher: ['/partner', '/author', '/capsules', '/test_python'], // This cannot be an expression except a literal! Very weird way this file is parsed: https://nextjs.org/docs/messages/invalid-page-config
};

const PROTECTED_ROUTES_SET = new Set(config.matcher);

export default async function middleware(req: NextRequest) {
    // return NextResponse.next();
    // Get the pathname of the request (e.g. /, /protected)
    const path = req.nextUrl.pathname;
    // If it's the root path, just render it
    // if (path === '/') {
    //     return NextResponse.next();
    // }
    const session = !!req.cookies.get('next-auth.session-token');

    // const session = await getToken({
    //     req,
    //     secret: process.env.NEXTAUTH_SECRET,
    // });
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
