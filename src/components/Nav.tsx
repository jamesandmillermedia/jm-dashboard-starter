'use client';
import Link from 'next/link';
import { supabaseBrowser } from '@/src/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';

export default function Nav() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between py-4">
      <div className="font-semibold">James & Miller — Dashboard</div>
      <div className="space-x-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/upload">Upload</Link>
        <button
          onClick={async () => {
            await supabaseBrowser().auth.signOut();
            router.push('/');
          }}
          className="px-3 py-1 border rounded"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
