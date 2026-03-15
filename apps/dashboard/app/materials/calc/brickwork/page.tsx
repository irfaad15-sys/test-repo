"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/forms/form-field";
import { calculateBrickwork } from "@/lib/calculations";

export default function BrickworkCalcPage() {
  const [length, setLength] = useState(0);
  const [height, setHeight] = useState(0);
  const [openings, setOpenings] = useState(0);
  const [wallType, setWallType] = useState<"9 inch" | "4.5 inch">("9 inch");

  const result = calculateBrickwork(length, height, openings, wallType);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Brickwork Calculator</h1>
        <p className="text-sm text-gray-500">Module 2 — Bricks + mortar from wall dimensions</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Input</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Wall Length (ft)" name="length" type="number" value={length} onChange={(v) => setLength(Number(v))} />
              <FormField label="Wall Height (ft)" name="height" type="number" value={height} onChange={(v) => setHeight(Number(v))} />
              <FormField label="Openings Area (sqft)" name="openings" type="number" value={openings} onChange={(v) => setOpenings(Number(v))} />
              <FormField
                label="Wall Type"
                name="wallType"
                type="select"
                value={wallType}
                onChange={(v) => setWallType(v as "9 inch" | "4.5 inch")}
                options={[
                  { label: "9 inch (Full brick)", value: "9 inch" },
                  { label: "4.5 inch (Half brick)", value: "4.5 inch" },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Result</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResultRow label="Gross Area" value={`${(length * height).toFixed(2)} sqft`} />
              <ResultRow label="Net Area" value={`${result.netArea} sqft`} />
              <ResultRow label="Bricks Required" value={`${result.bricksRequired.toLocaleString("en-IN")} nos`} highlight />
              <ResultRow label="Mortar Cement" value={`${result.mortarCement} bags`} />
              <ResultRow label="Mortar Sand" value={`${result.mortarSand} cft`} />
            </div>
            <p className="mt-4 text-xs text-gray-400">Includes 5% wastage.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm ${highlight ? "font-bold text-brand-700" : "font-medium text-gray-900"}`}>{value}</span>
    </div>
  );
}
