"use client";
import { signOut } from "next-auth/react";
import { User } from "@prisma/client";

// { user = null } = {
//   user: null as User | null
// }
export default function SignOut() {
  return (
    <button
      className="text-stone-400 hover:text-stone-200 transition-all"
      onClick={() => signOut()}
    >
      Sign out
    </button>
  );
}
