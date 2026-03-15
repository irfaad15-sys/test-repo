import { NextRequest, NextResponse } from "next/server";
import { readSheet } from "@/lib/sheets";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const lowOnly = searchParams.get("lowOnly") === "true";

  try {
    const filters = projectId ? { projectId } : undefined;
    let data = await readSheet("inventory", filters);

    if (lowOnly) {
      data = data.filter((item) => item.isLow === true);
    }

    return NextResponse.json({
      data,
      count: data.length,
      lowStockCount: data.filter((item) => item.isLow === true).length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
