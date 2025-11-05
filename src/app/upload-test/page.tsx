'use client';

import React, { useState } from 'react';

export default function UploadTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [log, setLog] = useState<string>('');

  async function handleUpload() {
    try {
      if (!file) return setLog('Please choose a file first.');

      setLog('Requesting signed URL...');
      const res = await fetch('/api/sign-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          userId: 'test-user',
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to request signed URL');
      }

      const { signedUrl } = await res.json();

      setLog('Uploading to Supabase Storage...');
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
      });

      if (!uploadRes.ok) {
        throw new Error('Upload failed');
      }

      setLog('✅ Upload successful!');
    } catch (err: any) {
      setLog(`❌ Error: ${err.message}`);
    }
  }

  return (
    <main style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Upload Test</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={{ marginBottom: 20 }}
      />
      <br />
      <button
        onClick={handleUpload}
        style={{
          padding: '8px 20px',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Upload
      </button>
      <pre style={{ marginTop: 20 }}>{log}</pre>
    </main>
  );
}

