# Metabase Setup Guide

## Architecture

```
Google Sheets (data entry) → Sync Script → PostgreSQL → Metabase (dashboards)
```

- **Google Sheets**: Your team enters data here (daily log, attendance, POs, expenses)
- **Sync Script**: Runs every 5-15 min, reads all sheets, upserts into PostgreSQL
- **PostgreSQL**: Stores all 32 tables + 7 dashboard views + indexes
- **Metabase**: Connects to PostgreSQL, provides interactive dashboards

## Quick Start

### Step 1: Start PostgreSQL + Metabase

```bash
cd metabase
docker compose up -d
```

This starts:
- **PostgreSQL** on port `5432` (auto-creates schema from `schema.sql`)
- **Metabase** on port `3000`

### Step 2: Initial Metabase Setup

1. Open **http://localhost:3000**
2. Complete the setup wizard:
   - Language: English
   - Admin account: create your login
   - **Add your data**: select **PostgreSQL**
     - Host: `postgres` (if using Docker) or `localhost` (if external)
     - Port: `5432`
     - Database: `porur_construction`
     - Username: `porur_admin`
     - Password: `porur_secure_pass_2024`
3. Click **Connect** → Metabase will scan all tables and views

### Step 3: Run the Sync Script

Add `DATABASE_URL` to your `apps/dashboard/.env`:

```
DATABASE_URL=postgresql://porur_admin:porur_secure_pass_2024@localhost:5432/porur_construction
```

Install pg dependency and run:

```bash
npm install pg @types/pg
npx tsx scripts/sync/sheets-to-postgres.ts
```

### Step 4: Schedule Auto-Sync

**Option A: Cron job (Linux/Mac)**
```bash
# Sync every 10 minutes
*/10 * * * * cd /path/to/test-repo && npx tsx scripts/sync/sheets-to-postgres.ts >> /var/log/porur-sync.log 2>&1
```

**Option B: n8n workflow**
- Create a new workflow with a Schedule trigger (every 10 min)
- Add an Execute Command node: `npx tsx scripts/sync/sheets-to-postgres.ts`

**Option C: PM2 (process manager)**
```bash
npm install -g pm2
pm2 start scripts/sync/sheets-to-postgres.ts --interpreter tsx --cron "*/10 * * * *" --name porur-sync
```

---

## Recommended Metabase Dashboards

### Dashboard 1: Master Overview
Create a new dashboard and add these questions:

| Card | Type | Query/View |
|------|------|------------|
| Overall Progress | Number | `SELECT ROUND(AVG(percent_complete),1) FROM project_schedule` |
| Budget Utilization | Number | `SELECT * FROM v_finance_dashboard` |
| Labor Today | Number | `SELECT SUM(labor_count) FROM daily_log WHERE date = CURRENT_DATE` |
| Inventory Alerts | Number | `SELECT COUNT(*) FROM v_inventory_alerts` |
| Budget vs Actual | Bar Chart | `SELECT * FROM v_budget_breakdown` |
| Floor Progress | Bar Chart | `SELECT * FROM v_schedule_progress` |
| Active Alerts | Table | `SELECT * FROM v_inventory_alerts` |
| Cash Flow Trend | Line Chart | `SELECT date, running_balance FROM cash_flow ORDER BY date` |

### Dashboard 2: Finance
| Card | Type | Source |
|------|------|--------|
| Total Budget | Number | `v_finance_dashboard.total_budget` |
| Total Spent | Number | `v_finance_dashboard.total_spent` |
| Pending Payables | Number | `v_finance_dashboard.pending_payables` |
| Budget by Category | Bar | `v_budget_breakdown` |
| Cash Flow | Area | `cash_flow` table, date vs running_balance |
| Expense Breakdown | Pie | `expense_log` grouped by category |
| Payment Status | Donut | `payments_tracker` grouped by status |
| Monthly Trend | Line | `expense_log` grouped by month |

### Dashboard 3: Site Operations
| Card | Type | Source |
|------|------|--------|
| Labor by Category | Stacked Bar | `v_labor_summary` |
| Attendance Trend | Line | `v_labor_summary` by date |
| Quality Pass Rate | Gauge | `v_quality_summary` |
| Safety Score | Number | `safety_log` calculation |
| Recent Daily Logs | Table | `daily_log ORDER BY date DESC LIMIT 10` |
| Concrete Volume | Bar | `concrete_register` by floor |
| Steel Usage | Bar | `steel_register` by floor |

### Dashboard 4: Supply Chain
| Card | Type | Source |
|------|------|--------|
| Open POs | Number | `purchase_orders WHERE status NOT IN ('completed','cancelled')` |
| Low Stock Items | Table | `v_inventory_alerts` |
| PO Status | Donut | `purchase_orders` grouped by status |
| Material Summary | Table | `material_summary` |
| Rate Trends | Line | `rate_history` by date for key materials |
| Vendor Performance | Table | `vendor_master` with rating |

### Dashboard 5: Schedule & Progress
| Card | Type | Source |
|------|------|--------|
| Floor Progress | Horizontal Bar | `v_schedule_progress` |
| Critical Path Tasks | Table | `project_schedule WHERE is_critical_path = TRUE` |
| Delayed Tasks | Number + Table | `project_schedule WHERE status = 'delayed'` |
| Task Completion | Pie | `task_tracker` by status |
| Gantt View | Table/Timeline | `project_schedule` with start/end dates |

---

## Pre-built Views (ready for Metabase)

The schema includes 7 views optimized for Metabase:

| View | Purpose |
|------|---------|
| `v_master_dashboard` | All KPIs for each project |
| `v_finance_dashboard` | Financial summary per project |
| `v_inventory_alerts` | Low stock items needing reorder |
| `v_labor_summary` | Daily labor by category with totals |
| `v_budget_breakdown` | Budget vs actual by category |
| `v_schedule_progress` | Floor-wise task completion |
| `v_quality_summary` | Pass/fail rates by check type |

In Metabase, these appear under **"Custom question" → Select a table → Views**.
You can use them directly as data sources for cards.

---

## Metabase Tips

1. **Auto-refresh**: Set dashboards to refresh every 10 minutes (matches sync interval)
2. **Filters**: Add project filter to dashboards — connects to `project_id` across all cards
3. **Alerts**: Set up Metabase alerts for inventory_alerts view (email when count > 0)
4. **Sharing**: Create public dashboard links for clients (read-only, no login needed)
5. **Mobile**: Metabase dashboards are responsive — works on phone browsers
