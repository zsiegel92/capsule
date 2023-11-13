'use client'
import Image from "next/image";
import Link from "next/link";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Session } from "next-auth";
import SignOut from "@/components/sign-out";
import bluePill from '../public/bluepill.png'

function NavLink({ href, children }: { href: string, children: any }) {
	return (
		<Link href={href}>
			<Nav.Link as='div' href={href}>{children}</Nav.Link>
		</Link>
	)
}

export const NavBar = ({ session }: { session: Session }) => {
	return (
		<>
			<Navbar
				collapseOnSelect
				expand="lg"
				className="bg-body-tertiary text-stone-200"
			>
				<Container>
					<Navbar.Brand href="/partner">
						<Image
							// src="/logo.png"
							src={bluePill} //"/bluepill.png"
							priority
							alt="BluePill"
							// className="w-10"
							style={{ height: 'auto' }}
							width={80}
							height={0}
						/>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto">
							<NavLink href="/">Home</NavLink>

							<NavLink href="/partner">Partner</NavLink>

							<NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
								<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
								<NavDropdown.Item href="#action/3.2">
									Another action
								</NavDropdown.Item>
								<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item href="#action/3.4">
									Separated link
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
						<Nav>
							<LoginLogout user={session?.user} />
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

		</>
	);
};

function LoginLogout({ user }: { user: any }) {
	if (!user?.email) {
		return <NavLink href="/login">Login</NavLink>
	}
	return <span><SignOut /></span>
}
export function Footer() {
	return <div>FOOTER</div>
}
