'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export default function UploadTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [log, setLog] = useState<string>('');

  async function handleUpload() {
    try {
      if (!file) {
        setLog('Please choose a file first.');
        return;
      }

      setLog('Requesting signed URL...');

      // 1) Get the current access token from Supabase (Magic Link login)
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;
      if (!accessToken) {
        setLog('No session found. Please sign in with the magic link first.');
        return;
      }

      // 2) Ask our API route to create a signed upload URL (send the token!)
      const res = await fetch('/api/sign-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          filename: file.name,
          userId: 'test-user',
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? 'Failed to request signed URL');
      }

      // 3) Upload the file directly to the signed URL returned by the API
      const { signedUrl } = await res.json();
      const put = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });

      if (!put.ok) {
        throw new Error('Upload failed.');
      }

      setLog('✅ Upload complete!');
    } catch (e: any) {
      setLog(`Error: ${e.message ?? String(e)}`);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <h1>Upload media</h1>

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button onClick={handleUpload}>Upload</button>
      </div>

      <p style={{ marginTop: 16 }}>{log}</p>
      <small>Files go to the private <code>media</code> bucket inside a user folder.</small>
    </div>
  );
}
