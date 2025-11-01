'use client';
import Nav from '@/src/components/Nav';
import { useRef, useState } from 'react';

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement|null>(null);
  const [msg, setMsg] = useState('');

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setMsg('Requesting signed URL...');

    const res = await fetch('/api/sign-upload?filename=' + encodeURIComponent(file.name), { method: 'POST' });
    const { url, path, error } = await res.json();
    if (error) { setMsg('Error: ' + error); return; }

    setMsg('Uploading...');
    const put = await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
    if (!put.ok) { setMsg('Failed to upload'); return; }

    setMsg('Uploaded to ' + path);
  };

  return (
    <section className="py-6 space-y-6">
      <Nav />
      <h2 className="text-2xl font-semibold">Upload media</h2>
      <input type="file" ref={fileRef} />
      <button onClick={handleUpload} className="px-3 py-2 border rounded">Upload</button>
      <p className="muted">{msg}</p>
      <p className="muted text-sm">Files go to the private <code>media</code> bucket inside a user folder.</p>
    </section>
  );
}
