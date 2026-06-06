import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDoctorRoute = createRouteMatcher(['/doctor(.*)']);
const isPatientRoute = createRouteMatcher(['/patient(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isMonitoringRoute = createRouteMatcher(['/monitoring(.*)']);
const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);

const isPublicRoute = createRouteMatcher([
  '/api/auth/webhook/clerk'
]);

export default clerkMiddleware(async (auth, req) => {
  // Ignore checking protected status on explicitly public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  // Bypass Edge RBAC processing for API routes to avoid performance overhead
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const isProtected = isDoctorRoute(req) || 
                      isPatientRoute(req) || 
                      isAdminRoute(req) || 
                      isMonitoringRoute(req) || 
                      isOnboardingRoute(req);

  const { userId, sessionClaims } = await auth();

  // 1. Unauthenticated users attempting to access protected routes
  if (isProtected && !userId) {
    const url = new URL('/login', req.url);
    return NextResponse.redirect(url);
  }

  // 2. Authenticated users checks
  if (userId) {
    const metadata = sessionClaims?.metadata || {};
    const publicMetadata = sessionClaims?.publicMetadata || {};
    const role = metadata.role || publicMetadata.role;

    // A. Onboarding Flow Check:
    // Force users without a role to /onboarding if they attempt any protected dashboard route
    if (!role) {
      if (!isOnboardingRoute(req) && isProtected) {
        const url = new URL('/onboarding', req.url);
        return NextResponse.redirect(url);
      }
    } else {
      // B. Onboarding Page Bypass:
      // Redirect already onboarded users to their respective dashboard
      if (isOnboardingRoute(req)) {
        const url = new URL(`/${role}`, req.url);
        return NextResponse.redirect(url);
      }

      // C. Role Verification:
      if (isDoctorRoute(req) && role !== 'doctor') {
        const url = new URL('/unauthorized', req.url);
        return NextResponse.redirect(url);
      }

      if (isPatientRoute(req) && role !== 'patient') {
        const url = new URL('/unauthorized', req.url);
        return NextResponse.redirect(url);
      }

      if (isAdminRoute(req) && role !== 'admin') {
        const url = new URL('/unauthorized', req.url);
        return NextResponse.redirect(url);
      }

      if (isMonitoringRoute(req) && role !== 'patient') {
        const url = new URL('/unauthorized', req.url);
        return NextResponse.redirect(url);
      }
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

