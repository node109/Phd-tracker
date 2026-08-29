import { createProgramme } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_ROLES, PRIORITIES } from "@/lib/types";

export default function NewProgrammePage() {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-base text-foreground">Add a programme</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createProgramme} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="university">University *</Label>
              <Input id="university" name="university" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="programme">Programme *</Label>
              <Input id="programme" name="programme" required placeholder="PhD in Computer Science" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="degree_type">Degree type</Label>
              <Input id="degree_type" name="degree_type" placeholder="PhD" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" name="deadline" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Programme website</Label>
              <Input id="website" name="website" type="url" placeholder="https://" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                name="priority"
                defaultValue="medium"
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-sm"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" rows={3} placeholder="Fit, research interests, funding notes..." />
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-3 text-sm font-medium">First contact (optional)</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="contact_name">Name</Label>
                <Input id="contact_name" name="contact_name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact_role">Role</Label>
                <select
                  id="contact_role"
                  name="contact_role"
                  defaultValue="advisor"
                  className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-sm"
                >
                  {CONTACT_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact_email">Email</Label>
                <Input id="contact_email" name="contact_email" type="email" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add programme
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
