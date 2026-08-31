export const metadata = {
  title: "Privacy Policy — PhD Tracker",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-4 text-sm leading-relaxed text-foreground">
      <div>
        <h1 className="text-xl font-semibold">Privacy Policy</h1>
        <p className="mt-1 text-xs text-muted-foreground">Last updated: 2026-08-31</p>
      </div>

      <p>
        PhD Tracker is a personal application-tracking tool. This page explains what
        information it collects and how it&rsquo;s used.
      </p>

      <section className="space-y-2">
        <h2 className="font-semibold">What we collect</h2>
        <p>When you sign in with Google, we receive your name, email address, and profile picture.</p>
        <p>
          Everything else in the app &mdash; universities, programmes, deadlines, contacts, notes, and any files
          you upload &mdash; is information you enter yourself while using the tracker.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">How it&rsquo;s used</h2>
        <p>
          Your information is used only to run the tracker for your own account &mdash; to sign you in, show you
          your own data, and nothing else. It is never sold, shared with third parties, or used for advertising.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Storage and access</h2>
        <p>
          Data is stored in a private database and access rules ensure each signed-in account can only see its
          own data &mdash; no one else&rsquo;s programmes, contacts, or files are visible to you, and yours aren&rsquo;t
          visible to anyone else.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Deleting your data</h2>
        <p>
          To delete your account and all associated data, contact{" "}
          <a href="mailto:siddhant@node109hq.com" className="underline">
            siddhant@node109hq.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
