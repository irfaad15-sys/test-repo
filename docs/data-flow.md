# Data Flow Documentation

## Core Principle: Update Once, Cascades Everywhere

All data originates from the Master Data layer (Module 1) and flows downstream.
Google Sheets formulas and n8n workflows propagate changes automatically.

## Sheet Dependencies

### Module 1 → Everything
| Sheet | Pulls From | Feeds Into |
|-------|-----------|------------|
| Project Master | — | All sheets (project filter) |
| BOQ Budget | — | Schedule, Budget vs Actual |
| Rate Master | — | All calculators, POs |
| Material Master | — | Inventory, POs, Calcs |
| Vendor Master | — | POs, Payments |
| Constants | — | All calculators |

### Module 2 → Material Summary → Dashboard
| Sheet | Pulls From | Feeds Into |
|-------|-----------|------------|
| Concrete Calc | Rates, Constants | Material Summary |
| Steel Calc | Rates, Constants | Material Summary |
| Brickwork Calc | Rates, Constants | Material Summary |
| Plastering Calc | Rates, Constants | Material Summary |
| Formwork Calc | Rates, Constants | Material Summary |
| Material Summary | All calculators | Dashboard, Reports |

### Module 3 → Tasks → Daily Log
| Sheet | Pulls From | Feeds Into |
|-------|-----------|------------|
| Project Schedule | BOQ, Tasks | Dashboard, Reports |
| Task Tracker | Schedule | Schedule, Daily Log |
| Resource Plan | Schedule, Labor | Dashboard |
| Dependencies | Schedule | Schedule alerts |

### Module 4 → Inventory → Alerts
| Sheet | Pulls From | Feeds Into |
|-------|-----------|------------|
| Purchase Orders | Vendors, Rates, Materials | GRN, Inventory, Payments |
| GRN / Delivery | POs | Inventory, PO status |
| Inventory | GRN, Daily Log | Dashboard, Alerts |
| Rate History | POs (historical) | Rate Master, Reports |

### Module 5 → Finance + Progress
| Sheet | Pulls From | Feeds Into |
|-------|-----------|------------|
| Daily Log | Tasks, Materials | Inventory, Progress |
| Labor Attendance | — | Wages, Dashboard |
| Steel Register | BOQ, GRN | Inventory, Reports |
| Concrete Register | BOQ, Schedule | Progress, Quality |
| Quality Checks | Concrete, Steel | Dashboard, Alerts |
| Safety Log | — | Dashboard, Alerts |

### Module 6 → Dashboard
| Sheet | Pulls From | Feeds Into |
|-------|-----------|------------|
| Expense Log | POs, Vendors | Budget vs Actual, Cash Flow |
| Voucher Register | Expenses | Audit trail |
| Budget vs Actual | BOQ, Expenses | Dashboard |
| Cash Flow | Payments, POs | Dashboard |
| Payments Tracker | POs, Invoices | Vendor balance |

## n8n Auto-sync Triggers

| Trigger Event | Auto-Updates |
|--------------|-------------|
| New PO created | → Vendor notification (WhatsApp/Email) |
| GRN logged | → Inventory stock + PO status |
| Payment logged | → Vendor balance in Payments Tracker |
| Task completed | → Schedule progress % |
| Inventory below reorder | → WhatsApp + Email alert |
| Budget at 90%+ | → WhatsApp + Email alert |
| Safety incident | → WhatsApp + SMS alert |
| Quality test failure | → WhatsApp + Email alert |
