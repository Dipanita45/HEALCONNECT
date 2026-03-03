import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/patient(.*)',
  '/doctor(.*)',
  '/admin(.*)',
  '/monitoring(.*)'
]);

const isPublicRoute = createRouteMatcher([
  '/api/auth/webhook/clerk'
]);

export default clerkMiddleware(async (auth, req) => {
  // Ignore checking protected status on explicitly public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    // Requires users to be signed in for protected routes
    await auth.protect();

    // Check if user has completed onboarding by checking publicMetadata
    const { sessionClaims } = await auth();
    const metadata = sessionClaims?.metadata || {};
    const isRoleOnboarded = metadata.onboardingComplete === true || !!metadata.role;

    // If they haven't but are trying to access protected dashboards, redirect them
    if (!isRoleOnboarded && !req.nextUrl.pathname.startsWith('/onboarding')) {
      const url = new URL('/onboarding', req.url);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
