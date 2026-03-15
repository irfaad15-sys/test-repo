"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/forms/form-field";
import { calculateConcreteVolume, calculateConcreteMaterials } from "@/lib/calculations";

export default function ConcreteCalcPage() {
  const [length, setLength] = useState(0);
  const [breadth, setBreadth] = useState(0);
  const [depth, setDepth] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [grade, setGrade] = useState("M25");

  const volume = calculateConcreteVolume(length, breadth, depth, quantity);
  const materials = calculateConcreteMaterials(volume, grade);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Concrete Calculator</h1>
        <p className="text-sm text-gray-500">Module 2 — Auto-calculates materials from dimensions + grade</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Length (m)" name="length" type="number" value={length} onChange={(v) => setLength(Number(v))} />
              <FormField label="Breadth (m)" name="breadth" type="number" value={breadth} onChange={(v) => setBreadth(Number(v))} />
              <FormField label="Depth (m)" name="depth" type="number" value={depth} onChange={(v) => setDepth(Number(v))} />
              <FormField label="Quantity (nos)" name="quantity" type="number" value={quantity} onChange={(v) => setQuantity(Number(v))} />
              <FormField
                label="Grade"
                name="grade"
                type="select"
                value={grade}
                onChange={setGrade}
                options={[
                  { label: "M20", value: "M20" },
                  { label: "M25", value: "M25" },
                  { label: "M30", value: "M30" },
                ]}
                className="col-span-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Material Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResultRow label="Volume" value={`${volume} cum`} />
              <ResultRow label="Cement" value={`${materials.cement} bags`} highlight />
              <ResultRow label="Sand" value={`${materials.sand} cft`} />
              <ResultRow label="20mm Aggregate" value={`${materials.aggregate20mm} cft`} />
              <ResultRow label="12mm Aggregate" value={`${materials.aggregate12mm} cft`} />
              <ResultRow label="Water" value={`${materials.water} liters`} />
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Includes 2% wastage. Based on IS standard mix proportions.
            </p>
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
