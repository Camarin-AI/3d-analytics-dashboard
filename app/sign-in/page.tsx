import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212]">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  )
} 