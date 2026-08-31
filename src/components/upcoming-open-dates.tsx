import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Programme } from "@/lib/types";

export function UpcomingOpenDates({ programmes }: { programmes: Programme[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = programmes
    .filter((p) => p.opens_on && p.opens_on >= today)
    .sort((a, b) => (a.opens_on ?? "").localeCompare(b.opens_on ?? ""));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming application open dates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {upcoming.length === 0 && (
          <p className="text-sm text-muted-foreground">Nothing waiting to open.</p>
        )}
        {upcoming.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-md border border-border p-2.5 text-sm">
            <div>
              <div className="font-medium">{p.university}</div>
              <div className="text-muted-foreground">{p.programme}</div>
            </div>
            <span className="text-xs text-muted-foreground">
              Opens {new Date(p.opens_on!).toLocaleDateString()}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
