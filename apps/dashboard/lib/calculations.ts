// =============================================================================
// Material Calculation Formulas — mirrors Google Sheets VLOOKUP logic
// =============================================================================

import { Constants } from "./types";

// Default construction constants (overridden by Constants sheet)
const DEFAULT_CONSTANTS: Record<string, number> = {
  // Concrete mix ratios (per cubic meter)
  cement_bags_per_cum_m20: 8.22,
  cement_bags_per_cum_m25: 9.51,
  cement_bags_per_cum_m30: 10.8,
  sand_cft_per_cum: 15.53,
  aggregate20_cft_per_cum: 20.28,
  aggregate12_cft_per_cum: 9.14,
  water_liters_per_cum: 186,

  // Brickwork
  bricks_per_sqft_9inch: 13.5,
  bricks_per_sqft_4inch: 6.75,
  mortar_cement_bags_per_sqft_9inch: 0.1,
  mortar_sand_cft_per_sqft_9inch: 0.035,

  // Plastering
  cement_bags_per_sqft_12mm: 0.073,
  cement_bags_per_sqft_20mm: 0.12,
  sand_cft_per_sqft_12mm: 0.024,
  sand_cft_per_sqft_20mm: 0.04,

  // Steel
  steel_density_kg_per_m: 0.00617, // d²/162 factor for 1m

  // Wastage percentages
  concrete_wastage_percent: 2,
  steel_wastage_percent: 5,
  brick_wastage_percent: 5,
  cement_wastage_percent: 3,
};

let constantsCache: Record<string, number> = { ...DEFAULT_CONSTANTS };

export function loadConstants(sheetConstants: Constants[]): void {
  constantsCache = { ...DEFAULT_CONSTANTS };
  sheetConstants.forEach((c) => {
    constantsCache[c.key] = c.value;
  });
}

// -----------------------------------------------------------------------------
// Concrete Calculations
// -----------------------------------------------------------------------------

export function calculateConcreteVolume(
  length: number,
  breadth: number,
  depth: number,
  quantity: number
): number {
  return +(length * breadth * depth * quantity).toFixed(3);
}

export function calculateConcreteMaterials(
  volume: number,
  grade: string
): {
  cement: number;
  sand: number;
  aggregate20mm: number;
  aggregate12mm: number;
  water: number;
} {
  const gradeKey = grade.toLowerCase().replace(" ", "");
  const cementFactor =
    constantsCache[`cement_bags_per_cum_${gradeKey}`] ||
    constantsCache.cement_bags_per_cum_m20;
  const wastage = 1 + constantsCache.concrete_wastage_percent / 100;

  return {
    cement: +(volume * cementFactor * wastage).toFixed(2),
    sand: +(volume * constantsCache.sand_cft_per_cum * wastage).toFixed(2),
    aggregate20mm: +(volume * constantsCache.aggregate20_cft_per_cum * wastage).toFixed(2),
    aggregate12mm: +(volume * constantsCache.aggregate12_cft_per_cum * wastage).toFixed(2),
    water: +(volume * constantsCache.water_liters_per_cum).toFixed(0),
  };
}

// -----------------------------------------------------------------------------
// Steel Calculations
// -----------------------------------------------------------------------------

export function calculateSteelWeight(
  diameter: number,
  length: number,
  numberOfBars: number,
  wastagePercent?: number
): number {
  // Standard formula: weight = d² / 162 × length (in meters)
  const unitWeight = (diameter * diameter) / 162;
  const netWeight = unitWeight * length * numberOfBars;
  const wastage = wastagePercent ?? constantsCache.steel_wastage_percent;
  return +(netWeight * (1 + wastage / 100)).toFixed(2);
}

export function steelBarsFromWeight(
  diameter: number,
  length: number,
  targetWeight: number
): number {
  const unitWeight = (diameter * diameter) / 162;
  const weightPerBar = unitWeight * length;
  return Math.ceil(targetWeight / weightPerBar);
}

// -----------------------------------------------------------------------------
// Brickwork Calculations
// -----------------------------------------------------------------------------

export function calculateBrickwork(
  length: number,
  height: number,
  openingsArea: number,
  wallType: "9 inch" | "4.5 inch"
): {
  netArea: number;
  bricksRequired: number;
  mortarCement: number;
  mortarSand: number;
} {
  const grossArea = length * height;
  const netArea = +(grossArea - openingsArea).toFixed(2);

  const brickFactor =
    wallType === "9 inch"
      ? constantsCache.bricks_per_sqft_9inch
      : constantsCache.bricks_per_sqft_4inch;
  const wastage = 1 + constantsCache.brick_wastage_percent / 100;

  return {
    netArea,
    bricksRequired: Math.ceil(netArea * brickFactor * wastage),
    mortarCement: +(
      netArea * constantsCache.mortar_cement_bags_per_sqft_9inch * wastage
    ).toFixed(2),
    mortarSand: +(
      netArea * constantsCache.mortar_sand_cft_per_sqft_9inch * wastage
    ).toFixed(2),
  };
}

// -----------------------------------------------------------------------------
// Plastering Calculations
// -----------------------------------------------------------------------------

export function calculatePlastering(
  area: number,
  thickness: number
): {
  cementRequired: number;
  sandRequired: number;
} {
  const thicknessKey = thickness <= 15 ? "12mm" : "20mm";
  const wastage = 1 + constantsCache.cement_wastage_percent / 100;

  return {
    cementRequired: +(
      area * constantsCache[`cement_bags_per_sqft_${thicknessKey}`] * wastage
    ).toFixed(2),
    sandRequired: +(
      area * constantsCache[`sand_cft_per_sqft_${thicknessKey}`] * wastage
    ).toFixed(2),
  };
}

// -----------------------------------------------------------------------------
// Formwork Calculations
// -----------------------------------------------------------------------------

export function calculateFormworkCost(
  area: number,
  type: "steel" | "plywood" | "aluminum",
  reuses: number,
  costPerSqFt: number
): number {
  // Cost amortized over number of reuses
  return +(area * (costPerSqFt / Math.max(reuses, 1))).toFixed(2);
}

// -----------------------------------------------------------------------------
// Material Summary Aggregation
// -----------------------------------------------------------------------------

export function aggregateMaterialSummary(
  concreteCalcs: { cement: number; sand: number; aggregate20mm: number; aggregate12mm: number }[],
  steelCalcs: { totalWeight: number; barDiameter: number }[],
  brickworkCalcs: { bricksRequired: number; mortarCement: number; mortarSand: number }[],
  plasteringCalcs: { cementRequired: number; sandRequired: number }[]
): Record<string, number> {
  const summary: Record<string, number> = {
    cement_bags: 0,
    sand_cft: 0,
    aggregate_20mm_cft: 0,
    aggregate_12mm_cft: 0,
    steel_kg: 0,
    bricks_nos: 0,
  };

  concreteCalcs.forEach((c) => {
    summary.cement_bags += c.cement;
    summary.sand_cft += c.sand;
    summary.aggregate_20mm_cft += c.aggregate20mm;
    summary.aggregate_12mm_cft += c.aggregate12mm;
  });

  steelCalcs.forEach((s) => {
    summary.steel_kg += s.totalWeight;
  });

  brickworkCalcs.forEach((b) => {
    summary.bricks_nos += b.bricksRequired;
    summary.cement_bags += b.mortarCement;
    summary.sand_cft += b.mortarSand;
  });

  plasteringCalcs.forEach((p) => {
    summary.cement_bags += p.cementRequired;
    summary.sand_cft += p.sandRequired;
  });

  // Round all values
  Object.keys(summary).forEach((key) => {
    summary[key] = +summary[key].toFixed(2);
  });

  return summary;
}

// -----------------------------------------------------------------------------
// Budget Variance
// -----------------------------------------------------------------------------

export function calculateVariance(
  budget: number,
  actual: number
): { variance: number; variancePercent: number; status: string } {
  const variance = +(budget - actual).toFixed(2);
  const variancePercent = budget > 0 ? +((variance / budget) * 100).toFixed(1) : 0;
  let status: string;
  if (variancePercent > 10) status = "under_budget";
  else if (variancePercent >= 0) status = "on_track";
  else if (variancePercent >= -10) status = "over_budget";
  else status = "critical";
  return { variance, variancePercent, status };
}
