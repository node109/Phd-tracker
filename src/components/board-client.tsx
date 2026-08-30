"use client";

import { useMemo, useState, useTransition } from "react";
import { Trash2, X } from "lucide-react";
import { bulkDeleteProgrammes, bulkUpdatePriority, bulkUpdateStage } from "@/app/actions";
import { KanbanCard } from "@/components/kanban-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRIORITIES, STAGES, STAGE_LABELS, type Priority, type Programme, type Stage } from "@/lib/types";

interface BoardClientProps {
  programmes: Programme[];
  advisorByProgramme: Record<string, string | undefined>;
}

export function BoardClient({ programmes, advisorByProgramme }: BoardClientProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const columns = useMemo(
    () => STAGES.map((stage) => ({ stage, programmes: programmes.filter((p) => p.stage === stage) })),
    [programmes]
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  const selectedIds = [...selected];

  function handleDelete() {
    const count = selectedIds.length;
    if (!confirm(`Delete ${count} programme${count === 1 ? "" : "s"}? This also removes their contacts, interactions, and documents. This cannot be undone.`)) {
      return;
    }
    startTransition(async () => {
      await bulkDeleteProgrammes(selectedIds);
      clearSelection();
    });
  }

  function handleSetStage(stage: Stage) {
    startTransition(async () => {
      await bulkUpdateStage(selectedIds, stage);
      clearSelection();
    });
  }

  function handleSetPriority(priority: Priority) {
    startTransition(async () => {
      await bulkUpdatePriority(selectedIds, priority);
      clearSelection();
    });
  }

  return (
    <div className="space-y-4">
      {selected.size > 0 && (
        <div className="sticky top-2 z-10 flex flex-wrap items-center gap-3 rounded-lg border border-primary bg-card p-3 shadow-md">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Select disabled={isPending} onValueChange={(value) => handleSetStage(value as Stage)}>
            <SelectTrigger className="h-8 w-44 text-xs">
              <SelectValue placeholder="Move to stage..." />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {STAGE_LABELS[stage]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select disabled={isPending} onValueChange={(value) => handleSetPriority(value as Priority)}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="Set priority..." />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="destructive" size="sm" disabled={isPending} onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
          <Button variant="ghost" size="sm" disabled={isPending} onClick={clearSelection}>
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(({ stage, programmes: inStage }) => (
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
                  advisorName={advisorByProgramme[programme.id]}
                  selected={selected.has(programme.id)}
                  onToggleSelect={() => toggle(programme.id)}
                />
              ))}
              {inStage.length === 0 && (
                <div className="rounded-md border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                  Empty
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
