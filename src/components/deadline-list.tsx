import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DueSoonBadge } from "@/components/badges";
import { DUE_SOON_DAYS, daysUntilDeadline, isDueSoon, isOverdue } from "@/lib/deadlines";
import type { Programme } from "@/lib/types";

export function DeadlineList({ programmes }: { programmes: Programme[] }) {
  const upcoming = programmes
    .filter((p) => isDueSoon(p))
    .sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming deadlines (next {DUE_SOON_DAYS} days)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {upcoming.length === 0 && <p className="text-sm text-muted-foreground">Nothing due soon.</p>}
        {upcoming.map((p) => {
          const days = daysUntilDeadline(p.deadline!);
          return (
            <Link
              key={p.id}
              href={`/programmes/${p.id}`}
              className="flex items-center justify-between rounded-md border border-border p-3 text-sm hover:bg-muted"
            >
              <div>
                <div className="font-medium">{p.university}</div>
                <div className="text-muted-foreground">{p.programme}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Today" : `in ${days}d`}
                </span>
                <DueSoonBadge overdue={isOverdue(p)} />
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
