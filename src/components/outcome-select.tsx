"use client";

import { useTransition } from "react";
import { updateOutcome } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type Outcome } from "@/lib/types";

const OTHER_OUTCOMES = ["waitlisted", "withdrawn"] as const;

export function OutcomeSelect({ programmeId, outcome }: { programmeId: string; outcome: Outcome | null }) {
  const [isPending, startTransition] = useTransition();

  function set(value: Outcome) {
    startTransition(() => updateOutcome(programmeId, value));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        size="sm"
        disabled={isPending}
        onClick={() => set("accepted")}
        className={cn(
          "border-transparent",
          outcome === "accepted" ? "bg-success text-white hover:opacity-90" : "bg-success/15 text-success hover:bg-success/25"
        )}
      >
        Offer received
      </Button>
      <Button
        type="button"
        size="sm"
        disabled={isPending}
        onClick={() => set("rejected")}
        className={cn(
          "border-transparent",
          outcome === "rejected"
            ? "bg-destructive text-destructive-foreground hover:opacity-90"
            : "bg-destructive/15 text-destructive hover:bg-destructive/25"
        )}
      >
        Application rejected
      </Button>
      <Select
        value={outcome && OTHER_OUTCOMES.includes(outcome as (typeof OTHER_OUTCOMES)[number]) ? outcome : "none"}
        disabled={isPending}
        onValueChange={(value) => {
          if (value === "none") return;
          set(value as Outcome);
        }}
      >
        <SelectTrigger className="h-8 w-36 text-xs">
          <SelectValue placeholder="Other outcome..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Other outcome...</SelectItem>
          <SelectItem value="waitlisted">Waitlisted</SelectItem>
          <SelectItem value="withdrawn">Withdrawn</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
