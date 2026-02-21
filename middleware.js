import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  // Path matches
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/patient') || path.startsWith('/doctor') || path.startsWith('/admin') || path.startsWith('/monitoring');

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_development_secret_change_me");
      const { payload } = await jwtVerify(token, secret);
      
      // Basic Role-Based Access Control
      if (path.startsWith('/patient') && payload.role !== 'patient' && payload.role !== 'admin') {
        return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, req.url));
      }
      if (path.startsWith('/doctor') && payload.role !== 'doctor' && payload.role !== 'admin') {
        return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, req.url));
      }
      if (path.startsWith('/admin') && payload.role !== 'admin') {
        return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, req.url));
      }

      return NextResponse.next();
    } catch (err) {
      // Invalid or expired token
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // Prevent logged-in users from seeing login/signup pages again
  if ((path === '/login' || path === '/signup') && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_development_secret_change_me");
      const { payload } = await jwtVerify(token, secret);
      return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, req.url));
    } catch (err) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/patient/:path*', '/doctor/:path*', '/admin/:path*', '/monitoring/:path*', '/login', '/signup'],
};
