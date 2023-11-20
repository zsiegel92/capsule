// These styles apply to every route in the application
import "@/styles/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthStatus from "@/components/auth-status";
import { Suspense } from "react";
import { SessionProvider } from 'next-auth/react'
import { getServerSession } from "next-auth/next"
import { User } from "@prisma/client"
import { Analytics } from '@vercel/analytics/react';

import { NavBar } from '@/components/nav';

import 'bootstrap/dist/css/bootstrap.css';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

const title = '💊';
const description = 'Create and commit to experiences with your partner.';

export const metadata: Metadata = {
    title,
    description,
    twitter: {
        card: 'summary_large_image',
        title,
        description,
    },
    // metadataBase: new URL("https://nextjs-postgres-auth.vercel.app"),
    // themeColor: "#FFF",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.variable}>
                <NavBar session={session} />

                <Toaster position="bottom-left" />
                <div
                    style={{
                        minHeight: 'calc(100vh - 95px)',
                    }}
                >
                    {children}
                </div>
                <Analytics />
                <Suspense fallback="Loading...">
                    <AuthStatus />
                </Suspense>
            </body>
        </html>
    );
}
