import { getServerSession } from "next-auth/next";
import SignOut from "@/components/sign-out";
import { authOptions } from '@/auth';

export default async function AuthStatus() {
    const session = await getServerSession(authOptions);
    return (
        <div className="bottom-5 w-full flex justify-center items-center">
            {session && (
                <p className="text-stone-200 text-sm">
                    Signed in as {session.user?.email} (<SignOut />)
                </p>
            )}
        </div>
    );
}
