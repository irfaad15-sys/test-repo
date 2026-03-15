import { NextRequest, NextResponse } from "next/server";
import { readSheet, appendToSheet, updateSheetRow } from "@/lib/sheets";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sheet = searchParams.get("sheet");
  const projectId = searchParams.get("projectId");

  if (!sheet) {
    return NextResponse.json({ error: "Missing sheet parameter" }, { status: 400 });
  }

  try {
    const filters = projectId ? { projectId } : undefined;
    const data = await readSheet(sheet, filters);
    return NextResponse.json({ data, count: data.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sheet = searchParams.get("sheet");

  if (!sheet) {
    return NextResponse.json({ error: "Missing sheet parameter" }, { status: 400 });
  }

  try {
    const body = await request.json();
    await appendToSheet(sheet, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sheet = searchParams.get("sheet");
  const key = searchParams.get("key");

  if (!sheet || !key) {
    return NextResponse.json({ error: "Missing sheet or key parameter" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updated = await updateSheetRow(sheet, key, body);
    return NextResponse.json({ success: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
