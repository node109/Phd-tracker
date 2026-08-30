import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getDashboardData();
  const payload = { exported_at: new Date().toISOString(), ...data };
  const filename = `phd-tracker-export-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
