import { differenceInCalendarDays, parseISO } from "date-fns";
import { STAGES, type Programme } from "./types";

export const DUE_SOON_DAYS = 14;

// Once a programme has been submitted, its deadline is moot — "submitted",
// "interview", and "decision" should never show as due-soon/overdue.
function isPastDeadlineStage(stage: Programme["stage"]): boolean {
  return STAGES.indexOf(stage) >= STAGES.indexOf("submitted");
}

export function daysUntilDeadline(deadline: string, today: Date = new Date()): number {
  return differenceInCalendarDays(parseISO(deadline), today);
}

export function isDueSoon(programme: Pick<Programme, "deadline" | "stage">, today: Date = new Date()): boolean {
  if (!programme.deadline || isPastDeadlineStage(programme.stage)) return false;
  return daysUntilDeadline(programme.deadline, today) <= DUE_SOON_DAYS;
}

export function isOverdue(programme: Pick<Programme, "deadline" | "stage">, today: Date = new Date()): boolean {
  if (!programme.deadline || isPastDeadlineStage(programme.stage)) return false;
  return daysUntilDeadline(programme.deadline, today) < 0;
}
