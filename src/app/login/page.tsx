import { GraduationCap } from "lucide-react";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">PhD Tracker</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to track your own applications — pipeline, contacts, documents, deadlines.
            </p>
          </div>
          <GoogleSignInButton />
        </CardContent>
      </Card>
    </div>
  );
}
