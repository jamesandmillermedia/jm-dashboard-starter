// lib/supabase-server.ts
import { createClient } from '@supabase/supabase-js';

// NOTE: this must use the SERVICE_ROLE key (never exposed to the browser)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // set this in Vercel / project settings (Encrypted)
);
