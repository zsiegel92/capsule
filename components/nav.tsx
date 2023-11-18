'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Session } from "next-auth";

import SignOut from '@/components/sign-out';
import bluePill from '../public/bluepill.png';
import '@/styles/capsule.css';
// import { useRouter } from "next/navigation";
// const router = useRouter();
// router.refresh();
// router.push("/partner");

function NavLink({ href, children }: { href: string; children: any }) {
    return <Nav.Link href={href}>{children}</Nav.Link>;
    // return (
    //     <Link href={href}>
    //         <Nav.Link as="div" href={href} active={false}>
    //             {children}
    //         </Nav.Link>
    //     </Link>
    // );
}

export const NavBar = ({ session }: { session: Session }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <>
            <Navbar
                collapseOnSelect
                expand="lg"
                className="bg-body-tertiary text-stone-200"
                onToggle={(isExpanded) => setExpanded(isExpanded)}
            >
                <Container>
                    <Navbar.Brand href="/">
                        <div className="capsuleNavbar">
                            <Image
                                // src="/logo.png"
                                src={bluePill} //"/bluepill.png"
                                priority
                                alt="BluePill"
                                style={{
                                    height: 'auto',
                                    transform: expanded
                                        ? 'rotate(0deg)'
                                        : 'rotate(5deg)',
                                }}
                                width={80}
                                height={0}
                            />
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            {/* <NavLink href="/">Home</NavLink> */}

                            <NavLink href="/partner">Partner</NavLink>
                            <NavLink href="/capsules">Capsules</NavLink>

                            {/* <NavDropdown
                                title="(Features will be added here)"
                                id="collapsible-nav-dropdown"
                            >
                                <NavDropdown.Item href="#action/3.1">
                                    Action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">
                                    Something
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">
                                    Separated link
                                </NavDropdown.Item>
                            </NavDropdown> */}
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
