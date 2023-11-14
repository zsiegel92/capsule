import Image from "next/image";
import Link from "next/link";
import { redirect } from 'next/navigation'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"


// return <pre>{JSON.stringify(session, null, 2)}</pre>
export default async function Home() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }
  return (
    <div>
      <div>
        Welcome to CAPSULE, {session?.user.email}
      </div>
    </div>
  );
}
