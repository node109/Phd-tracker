"use client";

import { useTransition } from "react";
import Link from "next/link";
import { updateStage } from "@/app/actions";
import { PriorityBadge, DueSoonBadge } from "@/components/badges";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isDueSoon, isOverdue } from "@/lib/deadlines";
import { STAGES, STAGE_LABELS, type Programme } from "@/lib/types";

interface KanbanCardProps {
  programme: Programme;
  advisorName?: string;
  selected: boolean;
  onToggleSelect: () => void;
}

export function KanbanCard({ programme, advisorName, selected, onToggleSelect }: KanbanCardProps) {
  const [isPending, startTransition] = useTransition();
  const dueSoon = isDueSoon(programme);

  return (
    <div
      className={`space-y-2 rounded-md border p-3 text-sm shadow-sm ${
        selected ? "border-primary bg-accent" : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="mt-1 h-3.5 w-3.5 flex-none accent-[var(--primary)]"
          aria-label={`Select ${programme.university}`}
        />
        <Link href={`/programmes/${programme.id}`} className="block font-medium hover:underline">
          {programme.university}
        </Link>
      </div>
      <div className="text-muted-foreground">{programme.programme}</div>
      {advisorName && <div className="text-xs text-muted-foreground">Advisor: {advisorName}</div>}
      <div className="flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={programme.priority} />
        {dueSoon && <DueSoonBadge overdue={isOverdue(programme)} />}
      </div>
      {programme.deadline && <div className="text-xs text-muted-foreground">Deadline: {programme.deadline}</div>}
      <Select
        value={programme.stage}
        disabled={isPending}
        onValueChange={(value) => startTransition(() => updateStage(programme.id, value as Programme["stage"]))}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STAGES.map((stage) => (
            <SelectItem key={stage} value={stage}>
              {STAGE_LABELS[stage]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
