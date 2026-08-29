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
}

export function KanbanCard({ programme, advisorName }: KanbanCardProps) {
  const [isPending, startTransition] = useTransition();
  const dueSoon = isDueSoon(programme);

  return (
    <div className="space-y-2 rounded-md border border-border bg-card p-3 text-sm shadow-sm">
      <Link href={`/programmes/${programme.id}`} className="block font-medium hover:underline">
        {programme.university}
      </Link>
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
