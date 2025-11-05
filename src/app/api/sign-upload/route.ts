import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const BUCKET = 'media'; // private bucket

// Admin client (server-side only)
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

export async function POST(req: Request) {
  try {
    // 1) Get and check the bearer token from the client
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : '';

    if (!token) {
      return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
    }

    // 2) Verify token and get the user
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = userData.user;

    // 3) Read the request body
    const { filename } = await req.json();

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // Store inside a per-user folder
    const objectPath = `${user.id}/${filename}`;

    // 4) Create a short-lived signed upload URL
    const { data, error } = await supabaseAdmin
      .storage
      .from(BUCKET)
      .createSignedUploadUrl(objectPath, 60); // expires in 60s

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: error?.message || 'Failed to create signed URL' }, { status: 500 });
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
