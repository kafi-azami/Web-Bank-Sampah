import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isCustomerRoute = pathname.startsWith('/customer');

  if ((isAdminRoute || isCustomerRoute) && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAdminRoute && role !== 'ADMIN_BANK') {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isCustomerRoute && role !== 'NASABAH') {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/customer/:path*'],
};