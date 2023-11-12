'use client'
import Image from "next/image";
import Link from "next/link";
// import { useSession, signIn, signOut } from "next-auth/react"

export const Nav = () => {
	return (
		<>
			<div className="w-full h-20 bg-cyan-200 hover:bg-cyan-300 sticky top-0">
				<div className="container mx-auto px-4 h-full">
					<div className="flex justify-between items-center h-full">
						<Image
							// src="/logo.png"
							src="/bluepill.png"
							priority
							alt="RedPill"
							// className="w-10"
							width={90}
							height={30}
						/>
						<ul className="hidden md:flex gap-x-6 text-white">
							<LiRoute href="/">Home</LiRoute>
							<AppLiRoute href="/partner">Partner</AppLiRoute>
							<LiRoute href="/login"  >Login</LiRoute>
							<LiRoute href="/protected"  >Protected</LiRoute>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
};

function AppLiRoute({ href, children }: { href: string, children: any }) {
	return (
		<LiRoute
			href={`/app${href}`}
		>
			{children}
		</LiRoute>
	)
}

function LiRoute({ href, children }: { href: string, children: any }) {
	return (
		<li>
			<Link href={href}>
				<p>{children}</p>
			</Link>
		</li>
	)
}


export function Footer() {
	return <div>FOOTER</div>
}
