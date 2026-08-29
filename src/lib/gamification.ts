import { format, subDays } from "date-fns";
import { STAGES, type Interaction, type InteractionType, type Programme, type Document } from "./types";

// Points are derived entirely from real logged activity — there is no separate
// mutable score to keep in sync. Reaching a later stage implies every earlier
// stage was already passed, so stage points are (stage index + 1) * 10.
const INTERACTION_POINTS: Record<InteractionType, number> = {
  research: 2,
  email_sent: 10,
  email_reply: 15,
  call: 15,
  meeting: 20,
  other: 2,
};

export function computePoints(interactions: Interaction[], programmes: Programme[]): number {
  const fromInteractions = interactions.reduce((sum, i) => sum + INTERACTION_POINTS[i.type], 0);
  const fromStages = programmes.reduce((sum, p) => sum + (STAGES.indexOf(p.stage) + 1) * 10, 0);
  return fromInteractions + fromStages;
}

export function computeStreak(interactions: Interaction[], today: Date = new Date()): number {
  if (interactions.length === 0) return 0;
  const activeDays = new Set(interactions.map((i) => format(new Date(i.occurred_at), "yyyy-MM-dd")));

  let cursor = today;
  if (!activeDays.has(format(cursor, "yyyy-MM-dd"))) {
    // Grace day: today isn't over yet, so a streak ending yesterday still counts as current.
    cursor = subDays(cursor, 1);
    if (!activeDays.has(format(cursor, "yyyy-MM-dd"))) return 0;
  }

  let streak = 0;
  while (activeDays.has(format(cursor, "yyyy-MM-dd"))) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }
  return streak;
}

export interface Badge {
  id: string;
  label: string;
  description: string;
  achieved: boolean;
}

export function computeBadges(
  interactions: Interaction[],
  programmes: Programme[],
  documents: Document[],
  streak: number
): Badge[] {
  const stageIndex = (p: Programme) => STAGES.indexOf(p.stage);
  const submittedOrBeyond = programmes.filter((p) => stageIndex(p) >= STAGES.indexOf("submitted"));
  const documentsByProgramme = new Map<string, Document[]>();
  for (const d of documents) {
    documentsByProgramme.set(d.programme_id, [...(documentsByProgramme.get(d.programme_id) ?? []), d]);
  }
  const hasFullyDraftedProgramme = [...documentsByProgramme.values()].some(
    (docs) => docs.length > 0 && docs.every((d) => d.status !== "not_started")
  );

  return [
    {
      id: "first_contact",
      label: "First Contact",
      description: "Sent your first outreach email",
      achieved: interactions.some((i) => i.type === "email_sent"),
    },
    {
      id: "first_reply",
      label: "First Reply",
      description: "Received a reply from an advisor or coordinator",
      achieved: interactions.some((i) => i.type === "email_reply"),
    },
    {
      id: "documents_drafted",
      label: "Paperwork Started",
      description: "Every document for a programme is at least drafted",
      achieved: hasFullyDraftedProgramme,
    },
    {
      id: "three_submitted",
      label: "Triple Threat",
      description: "Submitted applications to 3 or more programmes",
      achieved: submittedOrBeyond.length >= 3,
    },
    {
      id: "interview_ready",
      label: "Interview Ready",
      description: "Reached the interview stage with at least one programme",
      achieved: programmes.some((p) => stageIndex(p) >= STAGES.indexOf("interview")),
    },
    {
      id: "on_a_roll",
      label: "On a Roll",
      description: "3+ day streak of logged activity",
      achieved: streak >= 3,
    },
  ];
}
