import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/auth(.*)', // The entire /auth path
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/metrics', // Make sure Prometheus can access this
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth(?:/.*)?|sign-in|sign-up).*)',
  ],
}; 