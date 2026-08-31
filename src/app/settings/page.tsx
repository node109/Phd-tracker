import { createClient } from "@/lib/supabase/server";
import { ensureProfile, getForwardingAddress } from "@/lib/profile";
import { CopyForwardingAddress } from "@/components/copy-forwarding-address";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) await ensureProfile(user);
  const forwardingAddress = await getForwardingAddress();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Forwarding address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Forward admissions emails here to log updates against the matching programme. Automatic logging is
            coming soon — for now this address is reserved for your account.
          </p>
          {forwardingAddress ? (
            <CopyForwardingAddress address={forwardingAddress} />
          ) : (
            <p className="text-sm text-muted-foreground">Setting up your address...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
