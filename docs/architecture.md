# Porur Construction Management System — Architecture

## Overview

Complete construction management system with 7 modules and 32 interconnected Google Sheets,
a Next.js 14 dashboard, n8n automation workflows, and a mobile daily log app (Phase 2).

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Data Layer**: Google Sheets API (googleapis)
- **Automation**: n8n (12 workflows)
- **Notifications**: WhatsApp Business API, Email (SMTP), Slack
- **Deployment**: Vercel
- **Mobile** (Phase 2): React Native

## Module Architecture

```
Module 1: Master Data Layer (Source of Truth)
├── Project Master, BOQ Budget, Rate Master
├── Material Master, Vendor Master, Constants
└── Feeds → All other modules

Module 2: Calculation Engine (VLOOKUP from Masters)
├── Concrete, Steel, Brickwork, Plastering, Formwork calcs
└── Material Summary → Aggregated requirements

Module 3: Planning & Scheduling (Gantt + Dependencies)
├── Project Schedule, Task Tracker
└── Resource Plan, Dependencies

Module 4: Supply Chain (PO to Delivery)
├── Purchase Orders, GRN / Delivery
└── Inventory, Rate History

Module 5: On-site Operations (Daily Field Data)
├── Daily Log, Labor Attendance
├── Steel Register, Concrete Register
└── Quality Checks, Safety Log

Module 6: Finance & Payments (Budget Tracking)
├── Expense Log, Voucher Register
├── Budget vs Actual, Cash Flow
└── Payments Tracker

Module 7: Dashboards & Reports (All Data Flows Here)
├── Master Dashboard, Finance Dashboard, Project Dashboard
└── Material Report, Client Report
```

## Data Flow

Update once in Master Data → cascades everywhere:

1. Master Data → Calculators, Schedule, Supply Chain
2. Calculators → Material Summary
3. Schedule → Task Tracker → Daily Log
4. Supply Chain → Inventory
5. On-site Operations → Budget vs Actual, Progress, Cash Flow
6. All above → Master Dashboard → n8n Automation Triggers

## API Routes

- `GET /api/sheets?sheet=<key>` — Read any sheet
- `POST /api/sheets?sheet=<key>` — Append row to any sheet
- `PATCH /api/sheets?sheet=<key>&key=<value>` — Update row by key
- `GET /api/projects` — List all projects
- `GET /api/projects?id=<projectId>` — Project with all related data
- `GET /api/inventory?lowOnly=true` — Low stock items

## Deployment Phases

1. **Phase 1**: Google Sheets master workbook (setup-sheets.ts)
2. **Phase 2**: n8n workflows + WhatsApp integration
3. **Phase 3**: Next.js dashboard (this codebase)
4. **Phase 4**: Mobile daily log app (React Native)
