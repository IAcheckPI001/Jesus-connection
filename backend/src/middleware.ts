

import { NextRequest, NextResponse } from 'next/server';
import { isOriginAllowed } from './lib/config/cors.config';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const response = NextResponse.next();

  if (isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin!);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Trình duyệt gửi request OPTIONS trước (preflight) khi dùng POST/PUT/DELETE
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

// Chỉ áp dụng middleware này cho route API, không áp cho trang render UI
export const config = {
  matcher: '/api/:path*',
};