'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/src/lib/supabaseBrowser';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) setErr(error.message);
    else setSent(true);
  };

  if (sent) {
    return <p className="text-sm">Check your email for a login link.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="border px-3 py-2 rounded w-full"
      />
      <button className="bg-black text-white px-4 py-2 rounded">Send magic link</button>
      {err && <p className="text-red-600 text-sm">{err}</p>}
    </form>
  );
}
