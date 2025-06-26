import { SkuAnalytics } from "@/components/pages/sku-analytics"
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'

export default function SKU() {
  return (
    <>
      <SignedIn>
        <SkuAnalytics />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/auth" />
      </SignedOut>
    </>
  )
}
