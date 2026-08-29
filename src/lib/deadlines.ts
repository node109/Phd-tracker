import { differenceInCalendarDays, parseISO } from "date-fns";
import type { Programme } from "./types";

export const DUE_SOON_DAYS = 14;

export function daysUntilDeadline(deadline: string, today: Date = new Date()): number {
  return differenceInCalendarDays(parseISO(deadline), today);
}

export function isDueSoon(programme: Pick<Programme, "deadline" | "stage">, today: Date = new Date()): boolean {
  if (!programme.deadline || programme.stage === "decision") return false;
  return daysUntilDeadline(programme.deadline, today) <= DUE_SOON_DAYS;
}

export function isOverdue(programme: Pick<Programme, "deadline" | "stage">, today: Date = new Date()): boolean {
  if (!programme.deadline || programme.stage === "decision") return false;
  return daysUntilDeadline(programme.deadline, today) < 0;
}
