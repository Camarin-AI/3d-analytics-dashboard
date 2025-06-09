'use client'

import { SignInButton, SignedIn, SignedOut, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white px-4">
      <SignedIn>
        {/* Empty, redirect handled in useEffect */}
      </SignedIn>
      <SignedOut>
        <div className="mb-8 text-center">
          <img src="/camarinlogo.svg" alt="Camarin Logo" className="mx-auto mb-4" style={{ width: 160 }} />
          <h1 className="text-4xl font-bold mb-2">Welcome to Camarin Analytics</h1>
          <p className="text-lg text-gray-400 mb-6">Unlock powerful 3D digitization analytics for your business.</p>
          <SignInButton mode="modal">
            <button className="px-8 py-3 rounded-lg bg-[#27272A] text-white text-lg font-medium hover:bg-[#3F3F46] transition-colors shadow-lg">Login</button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  )
} 