import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const next = url.origin + '/dashboard';
  return NextResponse.redirect(next);
}
