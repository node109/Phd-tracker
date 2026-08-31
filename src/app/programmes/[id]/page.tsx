import { notFound } from "next/navigation";
import { addContact, addInteraction, deleteProgramme, updateProgramme } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DocumentChecklist } from "@/components/document-checklist";
import { OutcomeSelect } from "@/components/outcome-select";
import { OutcomeBadge, PriorityBadge, StageBadge } from "@/components/badges";
import { getDocumentFileUrls, getProgrammeWithRelations } from "@/lib/data";
import { CONTACT_ROLES, INTERACTION_LABELS, INTERACTION_TYPES, PRIORITIES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProgrammeDetailPage({ params }: PageProps<"/programmes/[id]">) {
  const { id } = await params;
  const programme = await getProgrammeWithRelations(id);
  if (!programme) notFound();
  const documentFileUrls = await getDocumentFileUrls(programme.documents);

  const addInteractionWithId = addInteraction.bind(null, programme.id);
  const addContactWithId = addContact.bind(null, programme.id);
  const updateProgrammeWithId = updateProgramme.bind(null, programme.id);
  const deleteProgrammeWithId = deleteProgramme.bind(null, programme.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{programme.university}</h1>
          <p className="text-muted-foreground">{programme.programme}</p>
        </div>
        <div className="flex items-center gap-2">
          <StageBadge stage={programme.stage} />
          <PriorityBadge priority={programme.priority} />
          {programme.outcome && <OutcomeBadge outcome={programme.outcome} />}
          {programme.stage === "decision" && (
            <OutcomeSelect programmeId={programme.id} outcome={programme.outcome} />
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">Programme details</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateProgrammeWithId} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="university">University</Label>
                  <Input id="university" name="university" defaultValue={programme.university} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="programme">Programme</Label>
                  <Input id="programme" name="programme" defaultValue={programme.programme} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="degree_type">Degree type</Label>
                  <Input id="degree_type" name="degree_type" defaultValue={programme.degree_type ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" defaultValue={programme.country ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" name="deadline" type="date" defaultValue={programme.deadline ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="opens_on">Opens on</Label>
                  <Input id="opens_on" name="opens_on" type="date" defaultValue={programme.opens_on ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" type="url" defaultValue={programme.website ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    name="priority"
                    defaultValue={programme.priority}
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
                <Textarea id="notes" name="notes" rows={3} defaultValue={programme.notes ?? ""} />
              </div>
              <div className="flex justify-between">
                <Button type="submit">Save changes</Button>
                <form action={deleteProgrammeWithId}>
                  <Button type="submit" variant="destructive">
                    Delete programme
                  </Button>
                </form>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentChecklist programmeId={programme.id} documents={programme.documents} fileUrls={documentFileUrls} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {programme.contacts.length === 0 && (
                <p className="text-sm text-muted-foreground">No contacts added yet.</p>
              )}
              {programme.contacts.map((contact) => (
                <div key={contact.id} className="rounded-md border border-border p-2.5 text-sm">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-muted-foreground">
                    {contact.role}
                    {contact.email && ` · ${contact.email}`}
                  </div>
                  {contact.notes && <p className="mt-1 text-muted-foreground">{contact.notes}</p>}
                </div>
              ))}
            </div>
            <form action={addContactWithId} className="grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
              <Input name="name" placeholder="Name" required />
              <select name="role" defaultValue="advisor" className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-sm">
                {CONTACT_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <Input name="email" type="email" placeholder="Email" />
              <Textarea name="notes" rows={2} placeholder="Notes (optional)" className="sm:col-span-3" />
              <Button type="submit" size="sm" className="sm:col-span-3">
                Add contact
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">Interaction timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {programme.interactions.length === 0 && (
                <p className="text-sm text-muted-foreground">No interactions logged yet.</p>
              )}
              {programme.interactions.map((interaction) => (
                <div key={interaction.id} className="rounded-md border border-border p-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{INTERACTION_LABELS[interaction.type]}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(interaction.occurred_at).toLocaleDateString()}
                    </span>
                  </div>
                  {interaction.note && <p className="text-muted-foreground">{interaction.note}</p>}
                </div>
              ))}
            </div>
            <form action={addInteractionWithId} className="space-y-3 border-t border-border pt-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <select name="type" defaultValue="email_sent" className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-sm">
                  {INTERACTION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {INTERACTION_LABELS[t]}
                    </option>
                  ))}
                </select>
                {programme.contacts.length > 0 && (
                  <select name="contact_id" defaultValue="" className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-sm">
                    <option value="">No specific contact</option>
                    {programme.contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <Textarea name="note" rows={2} placeholder="What happened?" />
              <Button type="submit" size="sm">
                Log interaction
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
