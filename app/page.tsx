import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'
import { Dashboard } from "@/components/pages/dashboard"

export default function Home() {
  return (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/auth" />
      </SignedOut>
    </>
  )
}
