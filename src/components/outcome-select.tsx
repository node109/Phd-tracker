"use client";

import { useTransition } from "react";
import { updateOutcome } from "@/app/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OUTCOMES, type Outcome } from "@/lib/types";

export function OutcomeSelect({ programmeId, outcome }: { programmeId: string; outcome: Outcome | null }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={outcome ?? "none"}
      disabled={isPending}
      onValueChange={(value) => {
        if (value === "none") return;
        startTransition(() => updateOutcome(programmeId, value as Outcome));
      }}
    >
      <SelectTrigger className="h-8 w-40 text-xs">
        <SelectValue placeholder="Set outcome" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Not decided yet</SelectItem>
        {OUTCOMES.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
