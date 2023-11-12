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

import { NavBar } from "@/components/nav";

import 'bootstrap/dist/css/bootstrap.css';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const title = "Next.js Prisma Postgres Auth Starter";
const description =
  "This is a Next.js starter kit that uses Next-Auth for simple email + password login and a Postgres database to persist the data.";

export const metadata: Metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  metadataBase: new URL("https://nextjs-postgres-auth.vercel.app"),
  // themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession()
  return (
    <html lang="en">
      <body className={inter.variable}>
        <NavBar session={session} />

        <Toaster
          position='bottom-left'
        // toastOptions={{
        //   success: {
        //     // iconTheme: {
        //     //   primary: 'green',
        //     //   secondary: 'green',
        //     // },
        //     style: {
        //       // background: 'green',
        //       border: '10px solid green',
        //     },
        //   },
        //   error: {
        //     // iconTheme: {
        //     //   primary: 'red',
        //     //   secondary: 'red',
        //     // },
        //     style: {
        //       // background: 'red',
        //       border: '10px solid red',
        //     },
        //   },
        // }}
        />
        <Suspense fallback="Loading...">
          <AuthStatus />
        </Suspense>

        {children}
      </body>
    </html>
  );
}
