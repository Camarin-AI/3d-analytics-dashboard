import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth(?:/.*)?|sign-in|sign-up).*)',
  ],
}; 