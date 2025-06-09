import { Insights } from "@/components/pages/Insights"
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'

export default function InsightsPage() {
    return (
        <>
            <SignedIn>
                <Insights />
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn redirectUrl="/auth" />
            </SignedOut>
        </>
    )
}
