"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteTask, toggleTask } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";

export function TaskRow({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-start gap-3 rounded-md border border-border p-3 text-sm">
      <input
        type="checkbox"
        checked={task.done}
        disabled={isPending}
        onChange={(e) => startTransition(() => toggleTask(task.id, e.target.checked))}
        className="mt-0.5 h-4 w-4 flex-none accent-[var(--primary)]"
        aria-label={`Mark "${task.title}" ${task.done ? "not done" : "done"}`}
      />
      <div className="flex-1">
        <div className={cn("font-medium", task.done && "text-muted-foreground line-through")}>{task.title}</div>
        {task.notes && <div className="text-muted-foreground">{task.notes}</div>}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isPending}
        onClick={() => startTransition(() => deleteTask(task.id))}
        aria-label={`Delete "${task.title}"`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
