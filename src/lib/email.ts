import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Resend's shared test domain — works with no DNS setup. Swap for a
// verified custom domain (e.g. mail@phdtracker.corporatedropout.in) in
// Resend's dashboard for better deliverability once that's set up.
const FROM = "PhD Tracker <onboarding@resend.dev>";

export async function sendWelcomeEmail({
  to,
  name,
  forwardingAddress,
}: {
  to: string;
  name?: string;
  forwardingAddress: string;
}): Promise<boolean> {
  if (!resend) return false;

  const greeting = name ? `Hi ${name.split(" ")[0]},` : "Hi,";

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to PhD Tracker",
    html: `
      <p>${greeting}</p>
      <p>Your PhD Tracker account is ready — sign in any time to see your applications, deadlines, and contacts in one place.</p>
      <p>One thing worth saving: your personal forwarding address is</p>
      <p style="font-size:16px"><strong>${forwardingAddress}</strong></p>
      <p>We're building automatic email logging — soon, forwarding an admissions email here will log the update against the matching programme on its own. That part isn't switched on yet, but this address is already yours, so hang onto it.</p>
      <p>Good luck with your applications!<br />— PhD Tracker</p>
    `,
  });

  return !error;
}
