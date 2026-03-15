import { NextRequest, NextResponse } from "next/server";
import { readSheet, batchReadSheets } from "@/lib/sheets";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("id");

  try {
    if (projectId) {
      // Fetch project with all related data
      const data = await batchReadSheets([
        "project_master",
        "boq_budget",
        "project_schedule",
        "budget_vs_actual",
        "inventory",
      ]);

      const project = data.project_master.find((p) => p.projectId === projectId);
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      return NextResponse.json({
        project,
        boq: data.boq_budget.filter((b) => b.projectId === projectId),
        schedule: data.project_schedule.filter((s) => s.projectId === projectId),
        budget: data.budget_vs_actual.filter((b) => b.projectId === projectId),
        inventory: data.inventory.filter((i) => i.projectId === projectId),
      });
    }

    // List all projects
    const projects = await readSheet("project_master");
    return NextResponse.json({ data: projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
