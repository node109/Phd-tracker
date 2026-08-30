import { NextResponse } from "next/server";
import { getDashboardData, getTasks } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const [data, tasks] = await Promise.all([getDashboardData(), getTasks()]);
  const payload = { exported_at: new Date().toISOString(), ...data, tasks };
  const filename = `phd-tracker-export-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
