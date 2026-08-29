import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatTile({ label, value, className }: StatTileProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-1">
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent className={cn("text-2xl font-semibold")}>{value}</CardContent>
    </Card>
  );
}
