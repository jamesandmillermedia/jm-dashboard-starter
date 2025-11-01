import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/src/lib/supabaseServer';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const filename = url.searchParams.get('filename') || `upload-${Date.now()}`;

  const supabase = supabaseServer();

  const folder = 'anonymous';
  const path = `${folder}/${Date.now()}-${filename}`;

  const { data, error } = await supabase
    .storage
    .from('media')
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Failed to sign URL' }, { status: 400 });
  }
  return NextResponse.json({ url: data.signedUrl, path });
}
