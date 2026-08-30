"use client";

import { useMemo, useState, useTransition } from "react";
import { DndContext, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { Search, Trash2, X } from "lucide-react";
import { bulkDeleteProgrammes, bulkUpdatePriority, bulkUpdateStage, updateStage } from "@/app/actions";
import { KanbanCard } from "@/components/kanban-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRIORITIES, STAGES, STAGE_LABELS, type Priority, type Programme, type Stage } from "@/lib/types";

interface BoardClientProps {
  programmes: Programme[];
  advisorByProgramme: Record<string, string | undefined>;
}

const ALL = "all";

function DroppableColumn({ stage, children }: { stage: Stage; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div ref={setNodeRef} className={`space-y-2 rounded-md ${isOver ? "bg-accent" : ""}`}>
      {children}
    </div>
  );
}

export function BoardClient({ programmes, advisorByProgramme }: BoardClientProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState(ALL);
  const [priorityFilter, setPriorityFilter] = useState(ALL);

  const countries = useMemo(
    () => [...new Set(programmes.map((p) => p.country).filter((c): c is string => !!c))].sort(),
    [programmes]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programmes.filter((p) => {
      if (q && !`${p.university} ${p.programme}`.toLowerCase().includes(q)) return false;
      if (countryFilter !== ALL && p.country !== countryFilter) return false;
      if (priorityFilter !== ALL && p.priority !== priorityFilter) return false;
      return true;
    });
  }, [programmes, query, countryFilter, priorityFilter]);

  const columns = useMemo(
    () => STAGES.map((stage) => ({ stage, programmes: filtered.filter((p) => p.stage === stage) })),
    [filtered]
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const programmeId = active.id as string;
    const targetStage = over.id as Stage;
    const programme = programmes.find((p) => p.id === programmeId);
    if (!programme || programme.stage === targetStage) return;
    startTransition(() => updateStage(programmeId, targetStage));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search university or programme..."
            className="h-8 w-64 pl-8 text-xs"
          />
        </div>
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="h-8 w-40 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All countries</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All priorities</SelectItem>
            {PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(query || countryFilter !== ALL || priorityFilter !== ALL) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => {
              setQuery("");
              setCountryFilter(ALL);
              setPriorityFilter(ALL);
            }}
          >
            Reset filters
          </Button>
        )}
      </div>

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

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map(({ stage, programmes: inStage }) => (
            <div key={stage} className="w-72 flex-none">
              <div className="mb-2 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold">{STAGE_LABELS[stage]}</h2>
                <span className="text-xs text-muted-foreground">{inStage.length}</span>
              </div>
              <DroppableColumn stage={stage}>
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
              </DroppableColumn>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
