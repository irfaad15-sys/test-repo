/**
 * Google Sheets → PostgreSQL Sync Script
 *
 * Reads all 32 sheets and upserts data into PostgreSQL for Metabase.
 * Run on a schedule (cron or n8n) every 5-15 minutes.
 *
 * Usage:
 *   npx tsx scripts/sync/sheets-to-postgres.ts
 *
 * Environment variables required:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID
 *   DATABASE_URL (e.g. postgresql://user:pass@localhost:5432/porur_construction)
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../apps/dashboard/.env") });

// ─────────────────────────────────────────────────────────────────────────────
// Config: Sheet name → Table name + column mapping
// ─────────────────────────────────────────────────────────────────────────────

interface SheetMapping {
  sheetName: string;
  tableName: string;
  primaryKey: string;
  columns: { sheet: string; db: string; type: "text" | "numeric" | "integer" | "date" | "boolean" }[];
}

const SHEET_MAPPINGS: SheetMapping[] = [
  // Module 1: Master Data
  {
    sheetName: "Project Master", tableName: "project_master", primaryKey: "project_id",
    columns: [
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "projectName", db: "project_name", type: "text" },
      { sheet: "clientName", db: "client_name", type: "text" },
      { sheet: "location", db: "location", type: "text" },
      { sheet: "totalFloors", db: "total_floors", type: "integer" },
      { sheet: "totalArea", db: "total_area", type: "numeric" },
      { sheet: "startDate", db: "start_date", type: "date" },
      { sheet: "expectedEndDate", db: "expected_end_date", type: "date" },
      { sheet: "status", db: "status", type: "text" },
      { sheet: "projectManager", db: "project_manager", type: "text" },
      { sheet: "siteEngineer", db: "site_engineer", type: "text" },
      { sheet: "contactNumber", db: "contact_number", type: "text" },
    ],
  },
  {
    sheetName: "BOQ Budget", tableName: "boq_budget", primaryKey: "boq_id",
    columns: [
      { sheet: "boqId", db: "boq_id", type: "text" },
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "category", db: "category", type: "text" },
      { sheet: "item", db: "item", type: "text" },
      { sheet: "description", db: "description", type: "text" },
      { sheet: "unit", db: "unit", type: "text" },
      { sheet: "quantity", db: "quantity", type: "numeric" },
      { sheet: "rate", db: "rate", type: "numeric" },
      { sheet: "floor", db: "floor", type: "text" },
      { sheet: "remarks", db: "remarks", type: "text" },
    ],
  },
  {
    sheetName: "Rate Master", tableName: "rate_master", primaryKey: "rate_id",
    columns: [
      { sheet: "rateId", db: "rate_id", type: "text" },
      { sheet: "category", db: "category", type: "text" },
      { sheet: "item", db: "item", type: "text" },
      { sheet: "unit", db: "unit", type: "text" },
      { sheet: "currentRate", db: "current_rate", type: "numeric" },
      { sheet: "previousRate", db: "previous_rate", type: "numeric" },
      { sheet: "lastUpdated", db: "last_updated", type: "date" },
      { sheet: "vendor", db: "vendor", type: "text" },
      { sheet: "source", db: "source", type: "text" },
    ],
  },
  {
    sheetName: "Material Master", tableName: "material_master", primaryKey: "material_id",
    columns: [
      { sheet: "materialId", db: "material_id", type: "text" },
      { sheet: "materialName", db: "material_name", type: "text" },
      { sheet: "category", db: "category", type: "text" },
      { sheet: "unit", db: "unit", type: "text" },
      { sheet: "hsnCode", db: "hsn_code", type: "text" },
      { sheet: "gstRate", db: "gst_rate", type: "numeric" },
      { sheet: "reorderLevel", db: "reorder_level", type: "numeric" },
      { sheet: "defaultVendor", db: "default_vendor", type: "text" },
      { sheet: "specifications", db: "specifications", type: "text" },
    ],
  },
  {
    sheetName: "Vendor Master", tableName: "vendor_master", primaryKey: "vendor_id",
    columns: [
      { sheet: "vendorId", db: "vendor_id", type: "text" },
      { sheet: "vendorName", db: "vendor_name", type: "text" },
      { sheet: "contactPerson", db: "contact_person", type: "text" },
      { sheet: "phone", db: "phone", type: "text" },
      { sheet: "email", db: "email", type: "text" },
      { sheet: "gstNumber", db: "gst_number", type: "text" },
      { sheet: "panNumber", db: "pan_number", type: "text" },
      { sheet: "address", db: "address", type: "text" },
      { sheet: "materialsSupplied", db: "materials_supplied", type: "text" },
      { sheet: "paymentTerms", db: "payment_terms", type: "text" },
      { sheet: "rating", db: "rating", type: "integer" },
      { sheet: "status", db: "status", type: "text" },
    ],
  },
  {
    sheetName: "Constants", tableName: "constants", primaryKey: "key",
    columns: [
      { sheet: "key", db: "key", type: "text" },
      { sheet: "value", db: "value", type: "numeric" },
      { sheet: "unit", db: "unit", type: "text" },
      { sheet: "description", db: "description", type: "text" },
      { sheet: "category", db: "category", type: "text" },
    ],
  },

  // Module 3: Scheduling
  {
    sheetName: "Project Schedule", tableName: "project_schedule", primaryKey: "task_id",
    columns: [
      { sheet: "taskId", db: "task_id", type: "text" },
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "wbsCode", db: "wbs_code", type: "text" },
      { sheet: "taskName", db: "task_name", type: "text" },
      { sheet: "floor", db: "floor", type: "text" },
      { sheet: "category", db: "category", type: "text" },
      { sheet: "startDate", db: "start_date", type: "date" },
      { sheet: "endDate", db: "end_date", type: "date" },
      { sheet: "duration", db: "duration", type: "integer" },
      { sheet: "percentComplete", db: "percent_complete", type: "numeric" },
      { sheet: "status", db: "status", type: "text" },
      { sheet: "predecessors", db: "predecessors", type: "text" },
      { sheet: "assignedTo", db: "assigned_to", type: "text" },
      { sheet: "isCriticalPath", db: "is_critical_path", type: "boolean" },
    ],
  },
  {
    sheetName: "Task Tracker", tableName: "task_tracker", primaryKey: "task_id",
    columns: [
      { sheet: "taskId", db: "task_id", type: "text" },
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "scheduleTaskId", db: "schedule_task_id", type: "text" },
      { sheet: "date", db: "date", type: "date" },
      { sheet: "taskDescription", db: "task_description", type: "text" },
      { sheet: "assignedTo", db: "assigned_to", type: "text" },
      { sheet: "priority", db: "priority", type: "text" },
      { sheet: "status", db: "status", type: "text" },
      { sheet: "remarks", db: "remarks", type: "text" },
      { sheet: "completedDate", db: "completed_date", type: "date" },
    ],
  },

  // Module 4: Supply Chain
  {
    sheetName: "Purchase Orders", tableName: "purchase_orders", primaryKey: "po_id",
    columns: [
      { sheet: "poId", db: "po_id", type: "text" },
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "vendorId", db: "vendor_id", type: "text" },
      { sheet: "poDate", db: "po_date", type: "date" },
      { sheet: "expectedDelivery", db: "expected_delivery", type: "date" },
      { sheet: "subtotal", db: "subtotal", type: "numeric" },
      { sheet: "gstAmount", db: "gst_amount", type: "numeric" },
      { sheet: "totalAmount", db: "total_amount", type: "numeric" },
      { sheet: "status", db: "status", type: "text" },
      { sheet: "approvedBy", db: "approved_by", type: "text" },
      { sheet: "remarks", db: "remarks", type: "text" },
    ],
  },
  {
    sheetName: "Inventory", tableName: "inventory", primaryKey: "inventory_id",
    columns: [
      { sheet: "inventoryId", db: "inventory_id", type: "text" },
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "materialId", db: "material_id", type: "text" },
      { sheet: "materialName", db: "material_name", type: "text" },
      { sheet: "unit", db: "unit", type: "text" },
      { sheet: "openingStock", db: "opening_stock", type: "numeric" },
      { sheet: "totalReceived", db: "total_received", type: "numeric" },
      { sheet: "totalIssued", db: "total_issued", type: "numeric" },
      { sheet: "closingStock", db: "closing_stock", type: "numeric" },
      { sheet: "reorderLevel", db: "reorder_level", type: "numeric" },
      { sheet: "isLow", db: "is_low", type: "boolean" },
      { sheet: "lastUpdated", db: "last_updated", type: "date" },
    ],
  },

  // Module 5: On-site Operations
  {
    sheetName: "Daily Log", tableName: "daily_log", primaryKey: "log_id",
    columns: [
      { sheet: "logId", db: "log_id", type: "text" },
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "date", db: "date", type: "date" },
      { sheet: "floor", db: "floor", type: "text" },
      { sheet: "weather", db: "weather", type: "text" },
      { sheet: "workDescription", db: "work_description", type: "text" },
      { sheet: "laborCount", db: "labor_count", type: "integer" },
      { sheet: "issues", db: "issues", type: "text" },
      { sheet: "nextDayPlan", db: "next_day_plan", type: "text" },
      { sheet: "loggedBy", db: "logged_by", type: "text" },
      { sheet: "supervisorRemarks", db: "supervisor_remarks", type: "text" },
    ],
  },
  {
    sheetName: "Labor Attendance", tableName: "labor_attendance", primaryKey: "attendance_id",
    columns: [
      { sheet: "attendanceId", db: "attendance_id", type: "text" },
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "date", db: "date", type: "date" },
      { sheet: "laborName", db: "labor_name", type: "text" },
      { sheet: "category", db: "category", type: "text" },
      { sheet: "contractorName", db: "contractor_name", type: "text" },
      { sheet: "present", db: "present", type: "boolean" },
      { sheet: "overtime", db: "overtime", type: "numeric" },
      { sheet: "dailyWage", db: "daily_wage", type: "numeric" },
      { sheet: "overtimeRate", db: "overtime_rate", type: "numeric" },
      { sheet: "totalWage", db: "total_wage", type: "numeric" },
    ],
  },
  {
    sheetName: "Quality Checks", tableName: "quality_checks", primaryKey: "check_id",
    columns: [
      { sheet: "checkId", db: "check_id", type: "text" },
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "date", db: "date", type: "date" },
      { sheet: "floor", db: "floor", type: "text" },
      { sheet: "checkType", db: "check_type", type: "text" },
      { sheet: "element", db: "element", type: "text" },
      { sheet: "standard", db: "standard", type: "text" },
      { sheet: "observedValue", db: "observed_value", type: "text" },
      { sheet: "result", db: "result", type: "text" },
      { sheet: "checkedBy", db: "checked_by", type: "text" },
      { sheet: "remarks", db: "remarks", type: "text" },
    ],
  },
  {
    sheetName: "Safety Log", tableName: "safety_log", primaryKey: "log_id",
    columns: [
      { sheet: "logId", db: "log_id", type: "text" },
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "date", db: "date", type: "date" },
      { sheet: "incidentType", db: "incident_type", type: "text" },
      { sheet: "description", db: "description", type: "text" },
      { sheet: "location", db: "location", type: "text" },
      { sheet: "personsInvolved", db: "persons_involved", type: "text" },
      { sheet: "actionTaken", db: "action_taken", type: "text" },
      { sheet: "reportedBy", db: "reported_by", type: "text" },
      { sheet: "status", db: "status", type: "text" },
      { sheet: "severity", db: "severity", type: "text" },
    ],
  },

  // Module 6: Finance
  {
    sheetName: "Expense Log", tableName: "expense_log", primaryKey: "expense_id",
    columns: [
      { sheet: "expenseId", db: "expense_id", type: "text" },
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "date", db: "date", type: "date" },
      { sheet: "category", db: "category", type: "text" },
      { sheet: "vendorId", db: "vendor_id", type: "text" },
      { sheet: "description", db: "description", type: "text" },
      { sheet: "amount", db: "amount", type: "numeric" },
      { sheet: "gstAmount", db: "gst_amount", type: "numeric" },
      { sheet: "totalAmount", db: "total_amount", type: "numeric" },
      { sheet: "paymentMode", db: "payment_mode", type: "text" },
      { sheet: "referenceNumber", db: "reference_number", type: "text" },
      { sheet: "billNumber", db: "bill_number", type: "text" },
      { sheet: "approvedBy", db: "approved_by", type: "text" },
    ],
  },
  {
    sheetName: "Budget vs Actual", tableName: "budget_vs_actual", primaryKey: "id",
    columns: [
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "category", db: "category", type: "text" },
      { sheet: "boqBudget", db: "boq_budget", type: "numeric" },
      { sheet: "revisedBudget", db: "revised_budget", type: "numeric" },
      { sheet: "actualSpent", db: "actual_spent", type: "numeric" },
      { sheet: "committed", db: "committed", type: "numeric" },
      { sheet: "variance", db: "variance", type: "numeric" },
      { sheet: "variancePercent", db: "variance_percent", type: "numeric" },
      { sheet: "status", db: "status", type: "text" },
      { sheet: "floor", db: "floor", type: "text" },
    ],
  },
  {
    sheetName: "Cash Flow", tableName: "cash_flow", primaryKey: "entry_id",
    columns: [
      { sheet: "entryId", db: "entry_id", type: "text" },
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "date", db: "date", type: "date" },
      { sheet: "type", db: "type", type: "text" },
      { sheet: "category", db: "category", type: "text" },
      { sheet: "description", db: "description", type: "text" },
      { sheet: "amount", db: "amount", type: "numeric" },
      { sheet: "runningBalance", db: "running_balance", type: "numeric" },
      { sheet: "source", db: "source", type: "text" },
    ],
  },
  {
    sheetName: "Payments Tracker", tableName: "payments_tracker", primaryKey: "payment_id",
    columns: [
      { sheet: "paymentId", db: "payment_id", type: "text" },
      { sheet: "projectId", db: "project_id", type: "text" },
      { sheet: "vendorId", db: "vendor_id", type: "text" },
      { sheet: "poId", db: "po_id", type: "text" },
      { sheet: "invoiceNumber", db: "invoice_number", type: "text" },
      { sheet: "invoiceDate", db: "invoice_date", type: "date" },
      { sheet: "invoiceAmount", db: "invoice_amount", type: "numeric" },
      { sheet: "paidAmount", db: "paid_amount", type: "numeric" },
      { sheet: "balanceDue", db: "balance_due", type: "numeric" },
      { sheet: "dueDate", db: "due_date", type: "date" },
      { sheet: "status", db: "status", type: "text" },
      { sheet: "paymentDate", db: "payment_date", type: "date" },
      { sheet: "paymentMode", db: "payment_mode", type: "text" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Google Sheets Client
// ─────────────────────────────────────────────────────────────────────────────

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return google.sheets({ version: "v4", auth });
}

async function readSheet(sheetName: string): Promise<Record<string, string>[]> {
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
    range: `'${sheetName}'!A1:ZZ`,
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0] as string[];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] || "";
    });
    return obj;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PostgreSQL Upsert
// ─────────────────────────────────────────────────────────────────────────────

function castValue(val: string, type: string): unknown {
  if (!val || val === "") return null;
  switch (type) {
    case "numeric": return parseFloat(val) || null;
    case "integer": return parseInt(val, 10) || null;
    case "boolean": return val === "TRUE" || val === "true" || val === "yes";
    case "date": {
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d.toISOString().split("T")[0];
    }
    default: return val;
  }
}

async function upsertRows(
  pool: pg.Pool,
  mapping: SheetMapping,
  rows: Record<string, string>[]
): Promise<number> {
  if (rows.length === 0) return 0;

  const dbCols = mapping.columns.map((c) => c.db);
  const pkCol = mapping.primaryKey;

  // For budget_vs_actual which has auto-increment PK, use delete+insert
  if (pkCol === "id") {
    await pool.query(`DELETE FROM ${mapping.tableName}`);
    let count = 0;
    for (const row of rows) {
      const values = mapping.columns.map((c) => castValue(row[c.sheet], c.type));
      const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
      await pool.query(
        `INSERT INTO ${mapping.tableName} (${dbCols.join(", ")}) VALUES (${placeholders})`,
        values
      );
      count++;
    }
    return count;
  }

  let count = 0;
  for (const row of rows) {
    const values = mapping.columns.map((c) => castValue(row[c.sheet], c.type));
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
    const updateSet = dbCols
      .filter((c) => c !== pkCol)
      .map((c, i) => `${c} = EXCLUDED.${c}`)
      .join(", ");

    await pool.query(
      `INSERT INTO ${mapping.tableName} (${dbCols.join(", ")})
       VALUES (${placeholders})
       ON CONFLICT (${pkCol}) DO UPDATE SET ${updateSet}, synced_at = NOW()`,
      values
    );
    count++;
  }
  return count;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Missing DATABASE_URL environment variable");
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: databaseUrl });

  console.log(`\nSyncing ${SHEET_MAPPINGS.length} sheets → PostgreSQL...\n`);

  let totalRows = 0;
  let successCount = 0;
  let failCount = 0;

  for (const mapping of SHEET_MAPPINGS) {
    try {
      const rows = await readSheet(mapping.sheetName);
      if (rows.length === 0) {
        console.log(`  ○ ${mapping.sheetName} → ${mapping.tableName} — empty, skipped`);
        continue;
      }
      const count = await upsertRows(pool, mapping, rows);
      totalRows += count;
      successCount++;
      console.log(`  ✓ ${mapping.sheetName} → ${mapping.tableName} — ${count} rows`);
    } catch (error) {
      failCount++;
      console.log(`  ✗ ${mapping.sheetName} — ${(error as Error).message}`);
    }
  }

  console.log(`\nDone! ${successCount} sheets synced, ${totalRows} total rows, ${failCount} failures.`);

  await pool.end();
}

main().catch(console.error);
