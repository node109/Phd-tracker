import { getContacts, getProgrammes } from "@/lib/data";
import { BoardClient } from "@/components/board-client";
import { STAGES, type Stage } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BoardPage({ searchParams }: PageProps<"/board">) {
  const params = await searchParams;
  const stageParam = typeof params.stage === "string" ? params.stage : undefined;
  const highlightStage = STAGES.includes(stageParam as Stage) ? (stageParam as Stage) : undefined;

  const [programmes, contacts] = await Promise.all([getProgrammes(), getContacts()]);

  const advisorByProgramme: Record<string, string | undefined> = {};
  for (const contact of contacts) {
    if (!advisorByProgramme[contact.programme_id]) {
      advisorByProgramme[contact.programme_id] = contact.name;
    }
  }

  if (programmes.length === 0) {
    return <p className="text-sm text-muted-foreground">No programmes yet — add one to start the board.</p>;
  }

  return (
    <BoardClient programmes={programmes} advisorByProgramme={advisorByProgramme} highlightStage={highlightStage} />
  );
}
