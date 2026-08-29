import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// No auth in v1 — this is a single-user personal tool, so the same anon-key
// client works from both Server Components/Actions and the browser. If you
// add Supabase Auth later, switch to @supabase/ssr's cookie-aware clients.
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
