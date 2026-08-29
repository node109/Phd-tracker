"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { STAGES, STAGE_LABELS, type Stage } from "@/lib/types";

interface StageFunnelChartProps {
  counts: Record<Stage, number>;
}

const STAGE_COLOR_VARS = STAGES.map((_, i) => `var(--chart-stage-${i})`);

export function StageFunnelChart({ counts }: StageFunnelChartProps) {
  const data = STAGES.map((stage) => ({ stage, label: STAGE_LABELS[stage], count: counts[stage] ?? 0 }));
  const maxCount = Math.max(1, ...data.map((d) => d.count));

  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 4 }} barCategoryGap={6}>
        <XAxis type="number" hide domain={[0, maxCount + 1]} />
        <YAxis
          type="category"
          dataKey="label"
          width={150}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--card-foreground)",
          }}
          formatter={(value) => [`${value} programme${value === 1 ? "" : "s"}`, "Count"]}
          labelFormatter={(label) => label}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((entry, index) => (
            <Cell key={entry.stage} fill={STAGE_COLOR_VARS[index]} />
          ))}
          <LabelList
            dataKey="count"
            position="right"
            style={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            formatter={(value) => (typeof value === "number" && value > 0 ? String(value) : "")}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
