import { Flame, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Badge as BadgeType } from "@/lib/gamification";

const POINTS_PER_LEVEL = 100;

interface GamificationHeaderProps {
  points: number;
  streak: number;
  badges: BadgeType[];
}

export function GamificationHeader({ points, streak, badges }: GamificationHeaderProps) {
  const level = Math.floor(points / POINTS_PER_LEVEL) + 1;
  const pointsIntoLevel = points % POINTS_PER_LEVEL;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="min-w-[160px]">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold">Level {level}</span>
              <span className="text-sm text-muted-foreground">{points} pts</span>
            </div>
            <Progress value={(pointsIntoLevel / POINTS_PER_LEVEL) * 100} className="mt-1.5 w-40" />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Flame className={cn("h-4 w-4", streak > 0 && "text-warning")} />
            {streak > 0 ? `${streak}-day streak` : "No streak yet"}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge.id}
              title={badge.description}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium",
                badge.achieved
                  ? "border-transparent bg-primary/10 text-primary"
                  : "border-border text-muted-foreground/50"
              )}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
