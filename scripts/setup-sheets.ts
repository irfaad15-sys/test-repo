/**
 * Setup Script — Auto-create all 32 sheets in Google Spreadsheet
 *
 * Usage: npx ts-node scripts/setup-sheets.ts
 *
 * Prerequisites:
 * - Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID
 *   in your environment or .env file
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../apps/dashboard/.env") });

import { google } from "googleapis";

const SHEETS_TO_CREATE = [
  // Module 1: Master Data
  { name: "Project Master", headers: ["projectId", "projectName", "clientName", "location", "totalFloors", "totalArea", "startDate", "expectedEndDate", "status", "projectManager", "siteEngineer", "contactNumber"], color: { red: 0.6, green: 0.4, blue: 0.2 } },
  { name: "BOQ Budget", headers: ["boqId", "projectId", "category", "item", "description", "unit", "quantity", "rate", "amount", "floor", "remarks"], color: { red: 0.6, green: 0.4, blue: 0.2 } },
  { name: "Rate Master", headers: ["rateId", "category", "item", "unit", "currentRate", "previousRate", "lastUpdated", "vendor", "source"], color: { red: 0.6, green: 0.4, blue: 0.2 } },
  { name: "Material Master", headers: ["materialId", "materialName", "category", "unit", "hsnCode", "gstRate", "reorderLevel", "defaultVendor", "specifications"], color: { red: 0.6, green: 0.4, blue: 0.2 } },
  { name: "Vendor Master", headers: ["vendorId", "vendorName", "contactPerson", "phone", "email", "gstNumber", "panNumber", "address", "materialsSupplied", "paymentTerms", "rating", "status"], color: { red: 0.6, green: 0.4, blue: 0.2 } },
  { name: "Constants", headers: ["key", "value", "unit", "description", "category"], color: { red: 0.6, green: 0.4, blue: 0.2 } },

  // Module 2: Calculation Engine
  { name: "Concrete Calc", headers: ["calcId", "projectId", "floor", "element", "grade", "length", "breadth", "depth", "quantity", "volume", "cement", "sand", "aggregate20mm", "aggregate12mm", "water", "cost"], color: { red: 0.3, green: 0.3, blue: 0.7 } },
  { name: "Steel Calc", headers: ["calcId", "projectId", "floor", "element", "barDiameter", "numberOfBars", "length", "totalWeight", "rate", "cost", "cutLength", "wastagePercent"], color: { red: 0.3, green: 0.3, blue: 0.7 } },
  { name: "Brickwork Calc", headers: ["calcId", "projectId", "floor", "wallType", "length", "height", "area", "openingsArea", "netArea", "bricksRequired", "mortarCement", "mortarSand", "cost"], color: { red: 0.3, green: 0.3, blue: 0.7 } },
  { name: "Plastering Calc", headers: ["calcId", "projectId", "floor", "surface", "thickness", "area", "cementRequired", "sandRequired", "cost"], color: { red: 0.3, green: 0.3, blue: 0.7 } },
  { name: "Formwork Calc", headers: ["calcId", "projectId", "floor", "element", "area", "type", "reuses", "costPerSqFt", "totalCost"], color: { red: 0.3, green: 0.3, blue: 0.7 } },
  { name: "Material Summary", headers: ["projectId", "materialId", "materialName", "unit", "concreteQty", "steelQty", "brickworkQty", "plasteringQty", "formworkQty", "totalRequired", "ordered", "received", "used", "balance", "estimatedCost"], color: { red: 0.3, green: 0.3, blue: 0.7 } },

  // Module 3: Planning & Scheduling
  { name: "Project Schedule", headers: ["taskId", "projectId", "wbsCode", "taskName", "floor", "category", "startDate", "endDate", "duration", "percentComplete", "status", "predecessors", "assignedTo", "isCriticalPath"], color: { red: 0.2, green: 0.4, blue: 0.6 } },
  { name: "Task Tracker", headers: ["taskId", "projectId", "scheduleTaskId", "date", "taskDescription", "assignedTo", "priority", "status", "remarks", "completedDate"], color: { red: 0.2, green: 0.4, blue: 0.6 } },
  { name: "Resource Plan", headers: ["resourceId", "projectId", "scheduleTaskId", "resourceType", "resourceName", "quantity", "unit", "startDate", "endDate", "dailyRate", "totalCost"], color: { red: 0.2, green: 0.4, blue: 0.6 } },
  { name: "Dependencies", headers: ["dependencyId", "predecessorTaskId", "successorTaskId", "type", "lagDays"], color: { red: 0.2, green: 0.4, blue: 0.6 } },

  // Module 4: Supply Chain
  { name: "Purchase Orders", headers: ["poId", "projectId", "vendorId", "poDate", "expectedDelivery", "subtotal", "gstAmount", "totalAmount", "status", "approvedBy", "remarks"], color: { red: 0.1, green: 0.5, blue: 0.5 } },
  { name: "GRN / Delivery", headers: ["grnId", "poId", "projectId", "vendorId", "receivedDate", "receivedBy", "invoiceNumber", "invoiceAmount", "vehicleNumber", "qualityCheck", "remarks"], color: { red: 0.1, green: 0.5, blue: 0.5 } },
  { name: "Inventory", headers: ["inventoryId", "projectId", "materialId", "materialName", "unit", "openingStock", "totalReceived", "totalIssued", "closingStock", "reorderLevel", "isLow", "lastUpdated"], color: { red: 0.1, green: 0.5, blue: 0.5 } },
  { name: "Rate History", headers: ["historyId", "materialId", "vendorId", "poId", "date", "rate", "quantity", "remarks"], color: { red: 0.1, green: 0.5, blue: 0.5 } },

  // Module 5: On-site Operations
  { name: "Daily Log", headers: ["logId", "projectId", "date", "floor", "weather", "workDescription", "laborCount", "issues", "nextDayPlan", "loggedBy", "supervisorRemarks"], color: { red: 0.6, green: 0.4, blue: 0.1 } },
  { name: "Labor Attendance", headers: ["attendanceId", "projectId", "date", "laborName", "category", "contractorName", "present", "overtime", "dailyWage", "overtimeRate", "totalWage"], color: { red: 0.6, green: 0.4, blue: 0.1 } },
  { name: "Steel Register", headers: ["registerId", "projectId", "date", "floor", "element", "barDiameter", "cutLength", "numberOfPieces", "totalWeight", "grnId", "issuedBy", "receivedBy"], color: { red: 0.6, green: 0.4, blue: 0.1 } },
  { name: "Concrete Register", headers: ["registerId", "projectId", "date", "floor", "element", "grade", "volume", "batchCount", "startTime", "endTime", "slumpValue", "cubesCast", "cubeTestDate7", "cubeTestDate28", "remarks"], color: { red: 0.6, green: 0.4, blue: 0.1 } },
  { name: "Quality Checks", headers: ["checkId", "projectId", "date", "floor", "checkType", "element", "standard", "observedValue", "result", "checkedBy", "remarks"], color: { red: 0.6, green: 0.4, blue: 0.1 } },
  { name: "Safety Log", headers: ["logId", "projectId", "date", "incidentType", "description", "location", "personsInvolved", "actionTaken", "reportedBy", "status", "severity"], color: { red: 0.6, green: 0.4, blue: 0.1 } },

  // Module 6: Finance
  { name: "Expense Log", headers: ["expenseId", "projectId", "date", "category", "vendorId", "description", "amount", "gstAmount", "totalAmount", "paymentMode", "referenceNumber", "billNumber", "approvedBy"], color: { red: 0.2, green: 0.5, blue: 0.2 } },
  { name: "Voucher Register", headers: ["voucherId", "projectId", "date", "voucherType", "expenseId", "description", "debitAccount", "creditAccount", "amount", "approvedBy", "narration"], color: { red: 0.2, green: 0.5, blue: 0.2 } },
  { name: "Budget vs Actual", headers: ["projectId", "category", "boqBudget", "revisedBudget", "actualSpent", "committed", "variance", "variancePercent", "status", "floor"], color: { red: 0.2, green: 0.5, blue: 0.2 } },
  { name: "Cash Flow", headers: ["entryId", "projectId", "date", "type", "category", "description", "amount", "runningBalance", "source"], color: { red: 0.2, green: 0.5, blue: 0.2 } },
  { name: "Payments Tracker", headers: ["paymentId", "projectId", "vendorId", "poId", "invoiceNumber", "invoiceDate", "invoiceAmount", "paidAmount", "balanceDue", "dueDate", "status", "paymentDate", "paymentMode"], color: { red: 0.2, green: 0.5, blue: 0.2 } },

  // Module 7: Dashboards
  { name: "Master Dashboard", headers: ["projectId", "projectName", "overallProgress", "budgetUtilization", "scheduleVariance", "todayLabor", "openPOs", "pendingPayments", "inventoryAlerts", "qualityScore", "safetyScore"], color: { red: 0.5, green: 0.3, blue: 0.1 } },
];

async function main() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID!;

  console.log(`Setting up ${SHEETS_TO_CREATE.length} sheets...`);

  // Create all sheet tabs
  const requests = SHEETS_TO_CREATE.map((sheet, index) => ({
    addSheet: {
      properties: {
        title: sheet.name,
        index,
        tabColor: sheet.color,
        gridProperties: {
          frozenRowCount: 1,
        },
      },
    },
  }));

  try {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
    console.log("All sheet tabs created.");
  } catch (error) {
    console.log("Some sheets may already exist, continuing with headers...");
    console.error("batchUpdate error:", (error as any)?.message || error);
  }

  // Add headers to each sheet
  for (const sheet of SHEETS_TO_CREATE) {
    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'${sheet.name}'!A1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [sheet.headers],
        },
      });
      console.log(`  ✓ ${sheet.name} — ${sheet.headers.length} columns`);
    } catch (error) {
      console.log(`  ✗ ${sheet.name} — failed: ${(error as any)?.message}`);
    }
  }

  console.log("\nDone! All 32 sheets are ready.");
}

main().catch(console.error);
