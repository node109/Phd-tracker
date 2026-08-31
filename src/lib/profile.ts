import "server-only";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

const FORWARDING_LOCAL_PART = "phdtracker";
const FORWARDING_DOMAIN = "corporatedropout.in";

export function forwardingAddressFor(token: string): string {
  return `${FORWARDING_LOCAL_PART}+${token}@${FORWARDING_DOMAIN}`;
}

// Runs once per user, right after their first successful sign-in: creates
// their profile row (which generates a unique forwarding token) and emails
// them their forwarding address. Safe to call on every login — it's a
// no-op once the profile row already exists.
export async function ensureProfile(user: User): Promise<void> {
  const supabase = await createClient();

  const { data: existing } = await supabase.from("profiles").select("user_id").eq("user_id", user.id).maybeSingle();
  if (existing) return;

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({ user_id: user.id })
    .select("forwarding_token")
    .single();
  if (error || !created || !user.email) return;

  const name = (user.user_metadata?.full_name as string | undefined) ?? (user.user_metadata?.name as string | undefined);
  const forwardingAddress = forwardingAddressFor(created.forwarding_token);

  const sent = await sendWelcomeEmail({ to: user.email, name, forwardingAddress });
  if (sent) {
    await supabase.from("profiles").update({ welcome_email_sent_at: new Date().toISOString() }).eq("user_id", user.id);
  }
}

export async function getForwardingAddress(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("forwarding_token").maybeSingle();
  return data ? forwardingAddressFor(data.forwarding_token) : null;
}
