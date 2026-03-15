# n8n Workflow Setup Guide

## Prerequisites

1. Self-hosted n8n instance or n8n Cloud account
2. Google Sheets API credentials (same service account as the dashboard)
3. WhatsApp Business API access
4. SMTP email configuration

## Importing Workflows

All workflow JSON files are in the `/n8n-workflows/` directory:

```bash
# Import via n8n CLI
n8n import:workflow --input=n8n-workflows/critical-alerts.json
n8n import:workflow --input=n8n-workflows/daily-operations.json
n8n import:workflow --input=n8n-workflows/weekly-reports.json
n8n import:workflow --input=n8n-workflows/transaction-triggers.json
```

Or import via the n8n UI: Settings → Import → paste JSON.

## Workflow Overview (12 total)

### 1. Critical Alerts (Immediate)
**File:** `critical-alerts.json`

| Alert | Trigger | Channel |
|-------|---------|---------|
| Inventory below reorder | Sheet change: Inventory | WhatsApp + Email |
| Budget at 90%+ spent | Sheet change: Budget vs Actual | WhatsApp + Email |
| Safety incident logged | New row: Safety Log | WhatsApp + SMS |
| Concrete cube test failure | New row: Quality Checks | WhatsApp + Email |

### 2. Daily Operations (Morning/Evening)
**File:** `daily-operations.json`

| Task | Time | Channel |
|------|------|---------|
| Daily log reminder | 8 AM | WhatsApp to supervisor |
| Attendance summary | 6 PM | WhatsApp to manager |
| Tasks due today | 8 AM | WhatsApp + Slack |
| PO deliveries expected | 8 AM | WhatsApp to site |

### 3. Weekly Reports (Sunday 8 PM)
**File:** `weekly-reports.json`

| Report | Format | Recipient |
|--------|--------|-----------|
| Weekly expense summary | Email PDF | Project Manager |
| Progress vs schedule | Email + WhatsApp | Manager |
| Material consumption | Email PDF | Manager |
| Cash flow forecast | Email | Owner |

### 4. Transaction Triggers (On Data Entry)
**File:** `transaction-triggers.json`

| Event | Auto-Action |
|-------|------------|
| New PO created | Notify vendor (Email/WhatsApp) |
| GRN logged | Update inventory + PO status |
| Payment logged | Update vendor balance |
| Task completed | Update schedule progress |

## Environment Variables for n8n

Set these in your n8n instance:

```
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your-private-key

WHATSAPP_MANAGER_NUMBER=+91xxxxxxxxxx
WHATSAPP_SUPERVISOR_NUMBER=+91xxxxxxxxxx
WHATSAPP_SITE_NUMBER=+91xxxxxxxxxx
WHATSAPP_SAFETY_GROUP=group-id

PROJECT_MANAGER_EMAIL=pm@company.com
OWNER_EMAIL=owner@company.com

PDF_GENERATOR_URL=https://your-pdf-service.com/generate
```

## Workflow Structure

Each workflow follows this pattern:

```
Trigger → Condition (IF/Switch) → Action (Update/Notify) → Output (WhatsApp/Email)
```

- **Trigger**: Google Sheets change or Schedule (cron)
- **Condition**: IF node to check thresholds/status
- **Action**: Update related sheets or generate reports
- **Output**: Send notifications via WhatsApp/Email/Slack
