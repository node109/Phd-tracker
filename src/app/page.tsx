import { Download } from "lucide-react";
import { getDashboardData } from "@/lib/data";
import { computeBadges, computePoints, computeStreak } from "@/lib/gamification";
import { DUE_SOON_DAYS, isDueSoon } from "@/lib/deadlines";
import { STAGES, type Stage } from "@/lib/types";
import { StatTile } from "@/components/stat-tile";
import { GamificationHeader } from "@/components/gamification-header";
import { DeadlineList } from "@/components/deadline-list";
import { UpcomingOpenDates } from "@/components/upcoming-open-dates";
import { StageFunnelChart } from "@/components/stage-funnel-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This page reads live data from Supabase on every request — there's nothing
// meaningful to prerender at build time (and no DB available then either).
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { programmes, interactions, documents } = await getDashboardData();

  const points = computePoints(interactions, programmes);
  const streak = computeStreak(interactions);
  const badges = computeBadges(interactions, programmes, documents, streak);

  const active = programmes.filter((p) => p.stage !== "decision").length;
  const dueSoonCount = programmes.filter((p) => isDueSoon(p)).length;
  const emailedProgrammeIds = new Set(
    interactions.filter((i) => i.type === "email_sent").map((i) => i.programme_id)
  );
  const repliedProgrammeIds = new Set(
    interactions.filter((i) => i.type === "email_reply").map((i) => i.programme_id)
  );
  const replyRate =
    emailedProgrammeIds.size > 0 ? Math.round((repliedProgrammeIds.size / emailedProgrammeIds.size) * 100) : 0;

  const counts = STAGES.reduce(
    (acc, stage) => ({ ...acc, [stage]: programmes.filter((p) => p.stage === stage).length }),
    {} as Record<Stage, number>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <a href="/api/export" download>
            <Download className="h-3.5 w-3.5" />
            Export data
          </a>
        </Button>
      </div>

      <GamificationHeader points={points} streak={streak} badges={badges} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total programmes" value={programmes.length} />
        <StatTile label="Active" value={active} />
        <StatTile label={`Due within ${DUE_SOON_DAYS} days`} value={dueSoonCount} />
        <StatTile label="Reply rate" value={`${replyRate}%`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DeadlineList programmes={programmes} />
        <UpcomingOpenDates programmes={programmes} />
        <Card>
          <CardHeader>
            <CardTitle>Pipeline by stage</CardTitle>
          </CardHeader>
          <CardContent>
            {programmes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Add your first programme to see it show up here.
              </p>
            ) : (
              <StageFunnelChart counts={counts} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
