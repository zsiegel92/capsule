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
            {/* <CapsuleServerGrid n={100} /> */}
            <div
                style={{
                    // height: '100vh',
                    // overflow: 'auto',
                    paddingTop: '50px',
                    // paddingBottom: '50px',
                    // width: '100%,',
                    // height: '70vh',
                    // flex: '1 1 auto',
                }}
            >
                <InfiniteCapsules
                    baseRows={50}
                    increment={20}
                    nPerRow={10}
                    scrollableTarget="scrollableDiv"
                />
            </div>
        </div>
    );
}
