import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <h1 className="text-lg font-semibold">Sign-in didn&rsquo;t go through</h1>
          <p className="text-sm text-muted-foreground">
            Something went wrong completing sign-in. Try again — if it keeps happening, the Google sign-in
            provider may not be configured yet.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
