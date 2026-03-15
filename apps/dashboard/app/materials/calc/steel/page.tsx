"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/forms/form-field";
import { calculateSteelWeight } from "@/lib/calculations";

export default function SteelCalcPage() {
  const [diameter, setDiameter] = useState(16);
  const [length, setLength] = useState(0);
  const [bars, setBars] = useState(1);
  const [wastage, setWastage] = useState(5);
  const [rate, setRate] = useState(72);

  const weight = calculateSteelWeight(diameter, length, bars, wastage);
  const cost = +(weight * rate).toFixed(0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Steel Calculator</h1>
        <p className="text-sm text-gray-500">Module 2 — Weight = d²/162 x length x nos</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Input</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Bar Diameter (mm)"
                name="diameter"
                type="select"
                value={String(diameter)}
                onChange={(v) => setDiameter(Number(v))}
                options={[8, 10, 12, 16, 20, 25, 32].map((d) => ({ label: `${d}mm`, value: String(d) }))}
              />
              <FormField label="Cut Length (m)" name="length" type="number" value={length} onChange={(v) => setLength(Number(v))} />
              <FormField label="Number of Bars" name="bars" type="number" value={bars} onChange={(v) => setBars(Number(v))} />
              <FormField label="Wastage %" name="wastage" type="number" value={wastage} onChange={(v) => setWastage(Number(v))} />
              <FormField label="Rate (₹/kg)" name="rate" type="number" value={rate} onChange={(v) => setRate(Number(v))} className="col-span-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Result</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResultRow label="Unit Weight" value={`${((diameter * diameter) / 162).toFixed(3)} kg/m`} />
              <ResultRow label="Net Weight" value={`${calculateSteelWeight(diameter, length, bars, 0)} kg`} />
              <ResultRow label="Total Weight (incl. wastage)" value={`${weight} kg`} highlight />
              <ResultRow label="Estimated Cost" value={`₹${cost.toLocaleString("en-IN")}`} highlight />
            </div>
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
