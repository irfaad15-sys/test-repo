# Google Sheets Formula Reference

## Concrete Calculator
```
Volume = Length × Breadth × Depth × Quantity
Cement (bags) = Volume × Cement_Factor × (1 + Wastage%)
Sand (cft) = Volume × 15.53 × (1 + Wastage%)
20mm Aggregate (cft) = Volume × 20.28 × (1 + Wastage%)
12mm Aggregate (cft) = Volume × 9.14 × (1 + Wastage%)
Water (liters) = Volume × 186

Cement factors per grade:
  M20: 8.22 bags/cum
  M25: 9.51 bags/cum
  M30: 10.80 bags/cum
```

## Steel Calculator
```
Weight (kg) = d² / 162 × Length (m) × Number of Bars
  where d = bar diameter in mm

Example: 16mm bar, 3m length, 10 bars
  = 16² / 162 × 3 × 10 = 47.41 kg

Cost = Weight × Rate per kg × (1 + Wastage%)
```

## Brickwork Calculator
```
Net Area = Gross Area - Openings Area
Bricks Required = Net Area × Factor × (1 + 5% wastage)
  9 inch wall: 13.5 bricks per sqft
  4.5 inch wall: 6.75 bricks per sqft

Mortar Cement = Net Area × 0.1 bags/sqft
Mortar Sand = Net Area × 0.035 cft/sqft
```

## Plastering Calculator
```
Cement = Area × Factor × (1 + 3% wastage)
  12mm thick: 0.073 bags/sqft
  20mm thick: 0.120 bags/sqft

Sand = Area × Factor × (1 + 3% wastage)
  12mm thick: 0.024 cft/sqft
  20mm thick: 0.040 cft/sqft
```

## Inventory Formula
```
Closing Stock = Opening Stock + Total Received (GRN) - Total Issued (Daily Log)
Is Low = IF(Closing Stock < Reorder Level, TRUE, FALSE)
```

## Budget Variance
```
Variance = BOQ Budget - Actual Spent
Variance % = (Variance / BOQ Budget) × 100
Status:
  > 10%  → under_budget
  0-10%  → on_track
  -10-0% → over_budget
  < -10% → critical
```

## Cash Flow
```
Running Balance = Previous Balance + Inflow - Outflow
Monthly Burn = Total Outflow / Number of Days
Days of Cash = Current Balance / Daily Burn Rate
```
