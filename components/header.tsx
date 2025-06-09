import { Bell } from "lucide-react"
import Image from "next/image"
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'

export function Header() {
  const { user } = useUser();
  return (
    <div className="flex items-center justify-end gap-6">
      <button className="relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#27272A] transition-colors">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black"></span>
      </button>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-gray-400">Welcome back</p>
          <p className="font-medium text-white">
            {user ? (user.fullName || user.username || user.primaryEmailAddress?.emailAddress || "User") : ""}
          </p>
          {/* {user && user.primaryEmailAddress?.emailAddress && (
            <p className="text-xs text-gray-500">{user.primaryEmailAddress.emailAddress}</p>
          )} */}
        </div>
      </div>

      <SignedIn>
        <UserButton afterSignOutUrl="/auth" />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-4 py-2 rounded bg-[#27272A] text-white hover:bg-[#3F3F46] transition-colors">Login</button>
        </SignInButton>
      </SignedOut>
    </div>
  )
}
