import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');

    // Asumsikan kamu ingin semua rute di bawah `/protected` memerlukan autentikasi
    if (request.nextUrl.pathname.startsWith('/main') && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}