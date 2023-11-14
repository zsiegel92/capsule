import Image from "next/image";
import Link from "next/link";
import { redirect } from 'next/navigation'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { CapsuleServer, CapsuleServerGrid } from '@/components/capsule_server';
import { InfiniteCapsules } from '@/components/capsule';
// return <pre>{JSON.stringify(session, null, 2)}</pre>
export default async function Home() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect('/login');
    }
    return (
        <div>
            <h1>Welcome to CAPSULE, {session?.user.email}</h1>
            {/* @ts-expect-error Server Component */}
            {/* <CapsuleServerGrid n={100} /> */}
            <div
                style={{
                    // height: '100vh',
                    // overflow: 'auto',
                    paddingTop: '50px',
                    paddingBottom: '50px',
                    width: '100%,',
                    // height: '100%',
                    // flex: '1 1 auto',
                }}
                id="scrollableDiv"
            >
                <InfiniteCapsules
                    baseRows={5}
                    scrollableTarget="scrollableDiv"
                />
            </div>
        </div>
    );
}
