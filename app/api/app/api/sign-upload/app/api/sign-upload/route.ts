// app/api/sign-upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename and contentType required' }, { status: 400 });
    }

    // Construct a unique path in the bucket, e.g. user-id/... or timestamp:
    const filePath = `uploads/${Date.now()}-${filename}`;

    // Create a signed upload URL (expires (seconds) — 60 is typical)
    // NOTE: the SDK returns different shapes depending on version; check `data` shape in your build logs.
    const expiresIn = 60; // 60 seconds
    const { data, error } = await supabaseAdmin.storage
      .from('media') // your bucket name
      .createSignedUploadUrl(filePath, expiresIn);

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? 'Failed to create signed URL' }, { status: 500 });
    }

    // data will contain the signed URL (key name may vary by SDK version)
    // return the url and the path so the client can save a DB record later
    return NextResponse.json({ signedUploadUrl: (data as any).signedUploadUrl ?? (data as any).signedURL ?? data, path: filePath });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
