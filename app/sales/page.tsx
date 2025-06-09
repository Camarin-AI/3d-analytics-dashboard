import { SalesAnalytics } from "@/components/pages/sales"
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'

export default function SalesPage() {
  return (
    <>
      <SignedIn>
        <SalesAnalytics />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/auth" />
      </SignedOut>
    </>
  )
}
