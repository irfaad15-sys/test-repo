// =============================================================================
// Porur Construction Management System — Type Definitions
// 7 Modules / 32 Sheets
// =============================================================================

// -----------------------------------------------------------------------------
// MODULE 1: Master Data Layer (Source of Truth)
// -----------------------------------------------------------------------------

export interface ProjectMaster {
  projectId: string;
  projectName: string;
  clientName: string;
  location: string;
  totalFloors: number;
  totalArea: number; // sq ft
  startDate: string;
  expectedEndDate: string;
  status: "planning" | "in_progress" | "on_hold" | "completed";
  projectManager: string;
  siteEngineer: string;
  contactNumber: string;
}

export interface BOQBudget {
  boqId: string;
  projectId: string;
  category: string; // e.g. "Concrete", "Steel", "Brickwork"
  item: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number; // quantity * rate
  floor: string;
  remarks: string;
}

export interface RateMaster {
  rateId: string;
  category: string;
  item: string;
  unit: string;
  currentRate: number;
  previousRate: number;
  lastUpdated: string;
  vendor: string;
  source: "market" | "vendor_quote" | "contract";
}

export interface MaterialMaster {
  materialId: string;
  materialName: string;
  category: string;
  unit: string;
  hsnCode: string;
  gstRate: number;
  reorderLevel: number;
  defaultVendor: string;
  specifications: string;
}

export interface VendorMaster {
  vendorId: string;
  vendorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstNumber: string;
  panNumber: string;
  address: string;
  materialsSupplied: string[];
  paymentTerms: string;
  rating: number; // 1-5
  status: "active" | "inactive" | "blacklisted";
}

export interface Constants {
  key: string;
  value: number;
  unit: string;
  description: string;
  category: "concrete" | "steel" | "brickwork" | "plastering" | "formwork" | "general";
}

// -----------------------------------------------------------------------------
// MODULE 2: Calculation Engine (VLOOKUP from Masters)
// -----------------------------------------------------------------------------

export interface ConcreteCalc {
  calcId: string;
  projectId: string;
  floor: string;
  element: string; // e.g. "Column", "Beam", "Slab", "Foundation"
  grade: string; // e.g. "M20", "M25", "M30"
  length: number;
  breadth: number;
  depth: number;
  quantity: number; // nos
  volume: number; // cubic meters (auto-calc)
  cement: number; // bags (auto-calc from constants)
  sand: number; // cubic ft
  aggregate20mm: number;
  aggregate12mm: number;
  water: number; // liters
  cost: number; // from rate master
}

export interface SteelCalc {
  calcId: string;
  projectId: string;
  floor: string;
  element: string;
  barDiameter: number; // mm
  numberOfBars: number;
  length: number; // meters
  totalWeight: number; // kg (auto-calc: d²/162 * length * nos)
  rate: number;
  cost: number;
  cutLength: number;
  wastagePercent: number;
}

export interface BrickworkCalc {
  calcId: string;
  projectId: string;
  floor: string;
  wallType: string; // "9 inch", "4.5 inch"
  length: number;
  height: number;
  area: number; // sq ft
  openingsArea: number; // deductions for doors/windows
  netArea: number;
  bricksRequired: number; // auto-calc from constants
  mortarCement: number;
  mortarSand: number;
  cost: number;
}

export interface PlasteringCalc {
  calcId: string;
  projectId: string;
  floor: string;
  surface: string; // "internal", "external", "ceiling"
  thickness: number; // mm
  area: number;
  cementRequired: number;
  sandRequired: number;
  cost: number;
}

export interface FormworkCalc {
  calcId: string;
  projectId: string;
  floor: string;
  element: string;
  area: number; // sq ft
  type: "steel" | "plywood" | "aluminum";
  reuses: number;
  costPerSqFt: number;
  totalCost: number;
}

export interface MaterialSummary {
  projectId: string;
  materialId: string;
  materialName: string;
  unit: string;
  concreteQty: number;
  steelQty: number;
  brickworkQty: number;
  plasteringQty: number;
  formworkQty: number;
  totalRequired: number;
  ordered: number;
  received: number;
  used: number;
  balance: number;
  estimatedCost: number;
}

// -----------------------------------------------------------------------------
// MODULE 3: Planning and Scheduling (Gantt + Dependencies)
// -----------------------------------------------------------------------------

export interface ProjectSchedule {
  taskId: string;
  projectId: string;
  wbsCode: string;
  taskName: string;
  floor: string;
  category: string;
  startDate: string;
  endDate: string;
  duration: number; // days
  percentComplete: number;
  status: "not_started" | "in_progress" | "completed" | "delayed";
  predecessors: string[]; // task IDs
  assignedTo: string;
  isCriticalPath: boolean;
}

export interface TaskTracker {
  taskId: string;
  projectId: string;
  scheduleTaskId: string;
  date: string;
  taskDescription: string;
  assignedTo: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "completed" | "blocked";
  remarks: string;
  completedDate: string | null;
}

export interface ResourcePlan {
  resourceId: string;
  projectId: string;
  scheduleTaskId: string;
  resourceType: "labor" | "equipment" | "material";
  resourceName: string;
  quantity: number;
  unit: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalCost: number;
}

export interface Dependency {
  dependencyId: string;
  predecessorTaskId: string;
  successorTaskId: string;
  type: "FS" | "FF" | "SS" | "SF"; // Finish-Start, Finish-Finish, etc.
  lagDays: number;
}

// -----------------------------------------------------------------------------
// MODULE 4: Supply Chain and Procurement (PO to Delivery)
// -----------------------------------------------------------------------------

export interface PurchaseOrder {
  poId: string;
  projectId: string;
  vendorId: string;
  poDate: string;
  expectedDelivery: string;
  items: POItem[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  status: "draft" | "approved" | "sent" | "partial_received" | "completed" | "cancelled";
  approvedBy: string;
  remarks: string;
}

export interface POItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  gstRate: number;
}

export interface GRNDelivery {
  grnId: string;
  poId: string;
  projectId: string;
  vendorId: string;
  receivedDate: string;
  receivedBy: string;
  items: GRNItem[];
  invoiceNumber: string;
  invoiceAmount: number;
  vehicleNumber: string;
  qualityCheck: "pass" | "fail" | "partial";
  remarks: string;
}

export interface GRNItem {
  materialId: string;
  materialName: string;
  orderedQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  unit: string;
}

export interface Inventory {
  inventoryId: string;
  projectId: string;
  materialId: string;
  materialName: string;
  unit: string;
  openingStock: number;
  totalReceived: number; // sum of GRN
  totalIssued: number; // sum of daily log usage
  closingStock: number; // opening + received - issued
  reorderLevel: number;
  isLow: boolean; // closingStock < reorderLevel
  lastUpdated: string;
}

export interface RateHistory {
  historyId: string;
  materialId: string;
  vendorId: string;
  poId: string;
  date: string;
  rate: number;
  quantity: number;
  remarks: string;
}

// -----------------------------------------------------------------------------
// MODULE 5: On-site Operations (Daily Field Data)
// -----------------------------------------------------------------------------

export interface DailyLog {
  logId: string;
  projectId: string;
  date: string;
  floor: string;
  weather: "sunny" | "cloudy" | "rainy" | "stormy";
  workDescription: string;
  materialsUsed: DailyMaterialUsage[];
  laborCount: number;
  equipmentUsed: string[];
  issues: string;
  nextDayPlan: string;
  loggedBy: string;
  supervisorRemarks: string;
}

export interface DailyMaterialUsage {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
}

export interface LaborAttendance {
  attendanceId: string;
  projectId: string;
  date: string;
  laborName: string;
  category: "mason" | "helper" | "carpenter" | "plumber" | "electrician" | "painter" | "bar_bender" | "other";
  contractorName: string;
  present: boolean;
  overtime: number; // hours
  dailyWage: number;
  overtimeRate: number;
  totalWage: number;
}

export interface SteelRegister {
  registerId: string;
  projectId: string;
  date: string;
  floor: string;
  element: string;
  barDiameter: number;
  cutLength: number;
  numberOfPieces: number;
  totalWeight: number;
  grnId: string;
  issuedBy: string;
  receivedBy: string;
}

export interface ConcreteRegister {
  registerId: string;
  projectId: string;
  date: string;
  floor: string;
  element: string;
  grade: string;
  volume: number; // cubic meters
  batchCount: number;
  startTime: string;
  endTime: string;
  slumpValue: number;
  cubesCast: number;
  cubeTestDate7: string;
  cubeTestDate28: string;
  remarks: string;
}

export interface QualityCheck {
  checkId: string;
  projectId: string;
  date: string;
  floor: string;
  checkType: "concrete_cube" | "steel_test" | "alignment" | "level" | "plumb" | "waterproofing" | "other";
  element: string;
  standard: string;
  observedValue: string;
  result: "pass" | "fail" | "marginal";
  checkedBy: string;
  remarks: string;
  photos: string[]; // file paths or URLs
}

export interface SafetyLog {
  logId: string;
  projectId: string;
  date: string;
  incidentType: "near_miss" | "minor_injury" | "major_injury" | "fatality" | "property_damage" | "observation";
  description: string;
  location: string;
  personsInvolved: string[];
  actionTaken: string;
  reportedBy: string;
  status: "open" | "investigating" | "resolved" | "closed";
  severity: "low" | "medium" | "high" | "critical";
}

// -----------------------------------------------------------------------------
// MODULE 6: Finance and Payments (Budget Tracking)
// -----------------------------------------------------------------------------

export interface ExpenseLog {
  expenseId: string;
  projectId: string;
  date: string;
  category: string;
  vendorId: string;
  description: string;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  paymentMode: "cash" | "bank_transfer" | "cheque" | "upi";
  referenceNumber: string;
  billNumber: string;
  approvedBy: string;
}

export interface VoucherRegister {
  voucherId: string;
  projectId: string;
  date: string;
  voucherType: "payment" | "receipt" | "journal" | "contra";
  expenseId: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  approvedBy: string;
  narration: string;
}

export interface BudgetVsActual {
  projectId: string;
  category: string;
  boqBudget: number;
  revisedBudget: number;
  actualSpent: number;
  committed: number; // approved POs not yet paid
  variance: number; // budget - actual
  variancePercent: number;
  status: "under_budget" | "on_track" | "over_budget" | "critical";
  floor: string;
}

export interface CashFlow {
  entryId: string;
  projectId: string;
  date: string;
  type: "inflow" | "outflow";
  category: string;
  description: string;
  amount: number;
  runningBalance: number;
  source: string; // e.g. "Client payment", "Vendor payment"
}

export interface PaymentsTracker {
  paymentId: string;
  projectId: string;
  vendorId: string;
  poId: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  paidAmount: number;
  balanceDue: number;
  dueDate: string;
  status: "pending" | "partial" | "paid" | "overdue";
  paymentDate: string | null;
  paymentMode: "cash" | "bank_transfer" | "cheque" | "upi";
}

// -----------------------------------------------------------------------------
// MODULE 7: Dashboards and Reports (All Data Flows Here)
// -----------------------------------------------------------------------------

export interface MasterDashboard {
  projectId: string;
  projectName: string;
  overallProgress: number;
  budgetUtilization: number;
  scheduleVariance: number; // days ahead/behind
  activeAlerts: DashboardAlert[];
  todayLabor: number;
  openPOs: number;
  pendingPayments: number;
  inventoryAlerts: number;
  qualityScore: number;
  safetyScore: number;
}

export interface DashboardAlert {
  alertId: string;
  type: "inventory" | "budget" | "schedule" | "safety" | "quality" | "payment";
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface FinanceDashboard {
  projectId: string;
  totalBudget: number;
  totalSpent: number;
  totalCommitted: number;
  availableBudget: number;
  cashInHand: number;
  pendingReceivables: number;
  pendingPayables: number;
  monthlyBurn: number;
  categoryBreakdown: { category: string; budget: number; actual: number }[];
}

export interface ProjectDashboard {
  projectId: string;
  floorProgress: { floor: string; percent: number; status: string }[];
  criticalTasks: TaskTracker[];
  upcomingMilestones: ProjectSchedule[];
  resourceUtilization: number;
  delayedTasks: number;
  completedTasks: number;
  totalTasks: number;
}

export interface MaterialReport {
  projectId: string;
  reportDate: string;
  materials: {
    materialName: string;
    budgetQty: number;
    actualUsed: number;
    variance: number;
    wastagePercent: number;
    cost: number;
  }[];
  totalMaterialCost: number;
  wastageValue: number;
}

export interface ClientReport {
  projectId: string;
  reportDate: string;
  reportPeriod: string;
  overallProgress: number;
  milestoneStatus: { milestone: string; planned: string; actual: string; status: string }[];
  financialSummary: { received: number; spent: number; balance: number };
  photosAttached: string[];
  nextWeekPlan: string[];
  concerns: string[];
}

// -----------------------------------------------------------------------------
// Sheet Configuration — maps sheets to their tab names and key columns
// -----------------------------------------------------------------------------

export interface SheetConfig {
  sheetName: string;
  module: number;
  headerRow: number;
  keyColumn: string;
  columns: string[];
}

export const SHEET_REGISTRY: Record<string, SheetConfig> = {
  // Module 1: Master Data
  project_master: { sheetName: "Project Master", module: 1, headerRow: 1, keyColumn: "projectId", columns: ["projectId", "projectName", "clientName", "location", "totalFloors", "totalArea", "startDate", "expectedEndDate", "status", "projectManager", "siteEngineer", "contactNumber"] },
  boq_budget: { sheetName: "BOQ Budget", module: 1, headerRow: 1, keyColumn: "boqId", columns: ["boqId", "projectId", "category", "item", "description", "unit", "quantity", "rate", "amount", "floor", "remarks"] },
  rate_master: { sheetName: "Rate Master", module: 1, headerRow: 1, keyColumn: "rateId", columns: ["rateId", "category", "item", "unit", "currentRate", "previousRate", "lastUpdated", "vendor", "source"] },
  material_master: { sheetName: "Material Master", module: 1, headerRow: 1, keyColumn: "materialId", columns: ["materialId", "materialName", "category", "unit", "hsnCode", "gstRate", "reorderLevel", "defaultVendor", "specifications"] },
  vendor_master: { sheetName: "Vendor Master", module: 1, headerRow: 1, keyColumn: "vendorId", columns: ["vendorId", "vendorName", "contactPerson", "phone", "email", "gstNumber", "panNumber", "address", "materialsSupplied", "paymentTerms", "rating", "status"] },
  constants: { sheetName: "Constants", module: 1, headerRow: 1, keyColumn: "key", columns: ["key", "value", "unit", "description", "category"] },

  // Module 2: Calculation Engine
  concrete_calc: { sheetName: "Concrete Calc", module: 2, headerRow: 1, keyColumn: "calcId", columns: ["calcId", "projectId", "floor", "element", "grade", "length", "breadth", "depth", "quantity", "volume", "cement", "sand", "aggregate20mm", "aggregate12mm", "water", "cost"] },
  steel_calc: { sheetName: "Steel Calc", module: 2, headerRow: 1, keyColumn: "calcId", columns: ["calcId", "projectId", "floor", "element", "barDiameter", "numberOfBars", "length", "totalWeight", "rate", "cost", "cutLength", "wastagePercent"] },
  brickwork_calc: { sheetName: "Brickwork Calc", module: 2, headerRow: 1, keyColumn: "calcId", columns: ["calcId", "projectId", "floor", "wallType", "length", "height", "area", "openingsArea", "netArea", "bricksRequired", "mortarCement", "mortarSand", "cost"] },
  plastering_calc: { sheetName: "Plastering Calc", module: 2, headerRow: 1, keyColumn: "calcId", columns: ["calcId", "projectId", "floor", "surface", "thickness", "area", "cementRequired", "sandRequired", "cost"] },
  formwork_calc: { sheetName: "Formwork Calc", module: 2, headerRow: 1, keyColumn: "calcId", columns: ["calcId", "projectId", "floor", "element", "area", "type", "reuses", "costPerSqFt", "totalCost"] },
  material_summary: { sheetName: "Material Summary", module: 2, headerRow: 1, keyColumn: "materialId", columns: ["projectId", "materialId", "materialName", "unit", "concreteQty", "steelQty", "brickworkQty", "plasteringQty", "formworkQty", "totalRequired", "ordered", "received", "used", "balance", "estimatedCost"] },

  // Module 3: Planning & Scheduling
  project_schedule: { sheetName: "Project Schedule", module: 3, headerRow: 1, keyColumn: "taskId", columns: ["taskId", "projectId", "wbsCode", "taskName", "floor", "category", "startDate", "endDate", "duration", "percentComplete", "status", "predecessors", "assignedTo", "isCriticalPath"] },
  task_tracker: { sheetName: "Task Tracker", module: 3, headerRow: 1, keyColumn: "taskId", columns: ["taskId", "projectId", "scheduleTaskId", "date", "taskDescription", "assignedTo", "priority", "status", "remarks", "completedDate"] },
  resource_plan: { sheetName: "Resource Plan", module: 3, headerRow: 1, keyColumn: "resourceId", columns: ["resourceId", "projectId", "scheduleTaskId", "resourceType", "resourceName", "quantity", "unit", "startDate", "endDate", "dailyRate", "totalCost"] },
  dependencies: { sheetName: "Dependencies", module: 3, headerRow: 1, keyColumn: "dependencyId", columns: ["dependencyId", "predecessorTaskId", "successorTaskId", "type", "lagDays"] },

  // Module 4: Supply Chain
  purchase_orders: { sheetName: "Purchase Orders", module: 4, headerRow: 1, keyColumn: "poId", columns: ["poId", "projectId", "vendorId", "poDate", "expectedDelivery", "subtotal", "gstAmount", "totalAmount", "status", "approvedBy", "remarks"] },
  grn_delivery: { sheetName: "GRN / Delivery", module: 4, headerRow: 1, keyColumn: "grnId", columns: ["grnId", "poId", "projectId", "vendorId", "receivedDate", "receivedBy", "invoiceNumber", "invoiceAmount", "vehicleNumber", "qualityCheck", "remarks"] },
  inventory: { sheetName: "Inventory", module: 4, headerRow: 1, keyColumn: "inventoryId", columns: ["inventoryId", "projectId", "materialId", "materialName", "unit", "openingStock", "totalReceived", "totalIssued", "closingStock", "reorderLevel", "isLow", "lastUpdated"] },
  rate_history: { sheetName: "Rate History", module: 4, headerRow: 1, keyColumn: "historyId", columns: ["historyId", "materialId", "vendorId", "poId", "date", "rate", "quantity", "remarks"] },

  // Module 5: On-site Operations
  daily_log: { sheetName: "Daily Log", module: 5, headerRow: 1, keyColumn: "logId", columns: ["logId", "projectId", "date", "floor", "weather", "workDescription", "laborCount", "issues", "nextDayPlan", "loggedBy", "supervisorRemarks"] },
  labor_attendance: { sheetName: "Labor Attendance", module: 5, headerRow: 1, keyColumn: "attendanceId", columns: ["attendanceId", "projectId", "date", "laborName", "category", "contractorName", "present", "overtime", "dailyWage", "overtimeRate", "totalWage"] },
  steel_register: { sheetName: "Steel Register", module: 5, headerRow: 1, keyColumn: "registerId", columns: ["registerId", "projectId", "date", "floor", "element", "barDiameter", "cutLength", "numberOfPieces", "totalWeight", "grnId", "issuedBy", "receivedBy"] },
  concrete_register: { sheetName: "Concrete Register", module: 5, headerRow: 1, keyColumn: "registerId", columns: ["registerId", "projectId", "date", "floor", "element", "grade", "volume", "batchCount", "startTime", "endTime", "slumpValue", "cubesCast", "cubeTestDate7", "cubeTestDate28", "remarks"] },
  quality_checks: { sheetName: "Quality Checks", module: 5, headerRow: 1, keyColumn: "checkId", columns: ["checkId", "projectId", "date", "floor", "checkType", "element", "standard", "observedValue", "result", "checkedBy", "remarks"] },
  safety_log: { sheetName: "Safety Log", module: 5, headerRow: 1, keyColumn: "logId", columns: ["logId", "projectId", "date", "incidentType", "description", "location", "personsInvolved", "actionTaken", "reportedBy", "status", "severity"] },

  // Module 6: Finance
  expense_log: { sheetName: "Expense Log", module: 6, headerRow: 1, keyColumn: "expenseId", columns: ["expenseId", "projectId", "date", "category", "vendorId", "description", "amount", "gstAmount", "totalAmount", "paymentMode", "referenceNumber", "billNumber", "approvedBy"] },
  voucher_register: { sheetName: "Voucher Register", module: 6, headerRow: 1, keyColumn: "voucherId", columns: ["voucherId", "projectId", "date", "voucherType", "expenseId", "description", "debitAccount", "creditAccount", "amount", "approvedBy", "narration"] },
  budget_vs_actual: { sheetName: "Budget vs Actual", module: 6, headerRow: 1, keyColumn: "category", columns: ["projectId", "category", "boqBudget", "revisedBudget", "actualSpent", "committed", "variance", "variancePercent", "status", "floor"] },
  cash_flow: { sheetName: "Cash Flow", module: 6, headerRow: 1, keyColumn: "entryId", columns: ["entryId", "projectId", "date", "type", "category", "description", "amount", "runningBalance", "source"] },
  payments_tracker: { sheetName: "Payments Tracker", module: 6, headerRow: 1, keyColumn: "paymentId", columns: ["paymentId", "projectId", "vendorId", "poId", "invoiceNumber", "invoiceDate", "invoiceAmount", "paidAmount", "balanceDue", "dueDate", "status", "paymentDate", "paymentMode"] },

  // Module 7: Dashboards (computed, not stored as sheets)
  master_dashboard: { sheetName: "Master Dashboard", module: 7, headerRow: 1, keyColumn: "projectId", columns: ["projectId", "projectName", "overallProgress", "budgetUtilization", "scheduleVariance", "todayLabor", "openPOs", "pendingPayments", "inventoryAlerts", "qualityScore", "safetyScore"] },
  finance_dashboard: { sheetName: "Finance Dashboard", module: 7, headerRow: 1, keyColumn: "projectId", columns: ["projectId", "totalBudget", "totalSpent", "totalCommitted", "availableBudget", "cashInHand", "pendingReceivables", "pendingPayables", "monthlyBurn"] },
  project_dashboard: { sheetName: "Project Dashboard", module: 7, headerRow: 1, keyColumn: "projectId", columns: ["projectId", "delayedTasks", "completedTasks", "totalTasks", "resourceUtilization"] },
  material_report: { sheetName: "Material Report", module: 7, headerRow: 1, keyColumn: "projectId", columns: ["projectId", "reportDate", "totalMaterialCost", "wastageValue"] },
  client_report: { sheetName: "Client Report", module: 7, headerRow: 1, keyColumn: "projectId", columns: ["projectId", "reportDate", "reportPeriod", "overallProgress"] },
};
