import { Badge } from "@/components/ui/badge";
import { OUTCOME_LABELS, STAGE_LABELS, type Outcome, type Priority, type Stage } from "@/lib/types";

export function StageBadge({ stage }: { stage: Stage }) {
  return <Badge variant="secondary">{STAGE_LABELS[stage]}</Badge>;
}

const PRIORITY_VARIANT: Record<Priority, "destructive" | "warning" | "outline"> = {
  high: "destructive",
  medium: "warning",
  low: "outline",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge variant={PRIORITY_VARIANT[priority]}>{priority} priority</Badge>;
}

const OUTCOME_VARIANT: Record<Outcome, "success" | "destructive" | "warning" | "secondary"> = {
  accepted: "success",
  rejected: "destructive",
  waitlisted: "warning",
  withdrawn: "secondary",
};

export function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  return <Badge variant={OUTCOME_VARIANT[outcome]}>{OUTCOME_LABELS[outcome]}</Badge>;
}

export function DueSoonBadge({ overdue }: { overdue: boolean }) {
  return (
    <Badge variant={overdue ? "destructive" : "warning"}>{overdue ? "Overdue" : "Due soon"}</Badge>
  );
}
