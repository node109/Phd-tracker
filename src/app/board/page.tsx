import { getContacts, getProgrammes } from "@/lib/data";
import { KanbanCard } from "@/components/kanban-card";
import { STAGES, STAGE_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const [programmes, contacts] = await Promise.all([getProgrammes(), getContacts()]);

  const primaryAdvisorByProgramme = new Map<string, string>();
  for (const contact of contacts) {
    if (!primaryAdvisorByProgramme.has(contact.programme_id)) {
      primaryAdvisorByProgramme.set(contact.programme_id, contact.name);
    }
  }

  if (programmes.length === 0) {
    return <p className="text-sm text-muted-foreground">No programmes yet — add one to start the board.</p>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const inStage = programmes.filter((p) => p.stage === stage);
        return (
          <div key={stage} className="w-72 flex-none">
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold">{STAGE_LABELS[stage]}</h2>
              <span className="text-xs text-muted-foreground">{inStage.length}</span>
            </div>
            <div className="space-y-2">
              {inStage.map((programme) => (
                <KanbanCard
                  key={programme.id}
                  programme={programme}
                  advisorName={primaryAdvisorByProgramme.get(programme.id)}
                />
              ))}
              {inStage.length === 0 && (
                <div className="rounded-md border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                  Empty
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
