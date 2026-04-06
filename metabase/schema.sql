-- =============================================================================
-- Porur Construction Management — PostgreSQL Schema
-- Mirrors all 32 Google Sheets for Metabase dashboards
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 1: Master Data Layer
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE project_master (
    project_id       TEXT PRIMARY KEY,
    project_name     TEXT NOT NULL,
    client_name      TEXT,
    location         TEXT,
    total_floors     INTEGER,
    total_area       NUMERIC,
    start_date       DATE,
    expected_end_date DATE,
    status           TEXT CHECK (status IN ('planning','in_progress','on_hold','completed')),
    project_manager  TEXT,
    site_engineer    TEXT,
    contact_number   TEXT,
    synced_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE boq_budget (
    boq_id      TEXT PRIMARY KEY,
    project_id  TEXT REFERENCES project_master(project_id),
    category    TEXT,
    item        TEXT,
    description TEXT,
    unit        TEXT,
    quantity    NUMERIC,
    rate        NUMERIC,
    amount      NUMERIC GENERATED ALWAYS AS (quantity * rate) STORED,
    floor       TEXT,
    remarks     TEXT,
    synced_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rate_master (
    rate_id       TEXT PRIMARY KEY,
    category      TEXT,
    item          TEXT,
    unit          TEXT,
    current_rate  NUMERIC,
    previous_rate NUMERIC,
    last_updated  DATE,
    vendor        TEXT,
    source        TEXT CHECK (source IN ('market','vendor_quote','contract')),
    synced_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE material_master (
    material_id    TEXT PRIMARY KEY,
    material_name  TEXT NOT NULL,
    category       TEXT,
    unit           TEXT,
    hsn_code       TEXT,
    gst_rate       NUMERIC,
    reorder_level  NUMERIC,
    default_vendor TEXT,
    specifications TEXT,
    synced_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE vendor_master (
    vendor_id          TEXT PRIMARY KEY,
    vendor_name        TEXT NOT NULL,
    contact_person     TEXT,
    phone              TEXT,
    email              TEXT,
    gst_number         TEXT,
    pan_number         TEXT,
    address            TEXT,
    materials_supplied TEXT,
    payment_terms      TEXT,
    rating             INTEGER CHECK (rating BETWEEN 1 AND 5),
    status             TEXT CHECK (status IN ('active','inactive','blacklisted')),
    synced_at          TIMESTAMP DEFAULT NOW()
);

CREATE TABLE constants (
    key         TEXT PRIMARY KEY,
    value       NUMERIC,
    unit        TEXT,
    description TEXT,
    category    TEXT,
    synced_at   TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 2: Calculation Engine
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE concrete_calc (
    calc_id        TEXT PRIMARY KEY,
    project_id     TEXT REFERENCES project_master(project_id),
    floor          TEXT,
    element        TEXT,
    grade          TEXT,
    length         NUMERIC,
    breadth        NUMERIC,
    depth          NUMERIC,
    quantity       INTEGER,
    volume         NUMERIC,
    cement         NUMERIC,
    sand           NUMERIC,
    aggregate_20mm NUMERIC,
    aggregate_12mm NUMERIC,
    water          NUMERIC,
    cost           NUMERIC,
    synced_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE steel_calc (
    calc_id         TEXT PRIMARY KEY,
    project_id      TEXT REFERENCES project_master(project_id),
    floor           TEXT,
    element         TEXT,
    bar_diameter    NUMERIC,
    number_of_bars  INTEGER,
    length          NUMERIC,
    total_weight    NUMERIC,
    rate            NUMERIC,
    cost            NUMERIC,
    cut_length      NUMERIC,
    wastage_percent NUMERIC,
    synced_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE brickwork_calc (
    calc_id         TEXT PRIMARY KEY,
    project_id      TEXT REFERENCES project_master(project_id),
    floor           TEXT,
    wall_type       TEXT,
    length          NUMERIC,
    height          NUMERIC,
    area            NUMERIC,
    openings_area   NUMERIC,
    net_area        NUMERIC,
    bricks_required INTEGER,
    mortar_cement   NUMERIC,
    mortar_sand     NUMERIC,
    cost            NUMERIC,
    synced_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE plastering_calc (
    calc_id          TEXT PRIMARY KEY,
    project_id       TEXT REFERENCES project_master(project_id),
    floor            TEXT,
    surface          TEXT,
    thickness        NUMERIC,
    area             NUMERIC,
    cement_required  NUMERIC,
    sand_required    NUMERIC,
    cost             NUMERIC,
    synced_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE formwork_calc (
    calc_id       TEXT PRIMARY KEY,
    project_id    TEXT REFERENCES project_master(project_id),
    floor         TEXT,
    element       TEXT,
    area          NUMERIC,
    type          TEXT CHECK (type IN ('steel','plywood','aluminum')),
    reuses        INTEGER,
    cost_per_sqft NUMERIC,
    total_cost    NUMERIC,
    synced_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE material_summary (
    id             SERIAL PRIMARY KEY,
    project_id     TEXT REFERENCES project_master(project_id),
    material_id    TEXT,
    material_name  TEXT,
    unit           TEXT,
    concrete_qty   NUMERIC DEFAULT 0,
    steel_qty      NUMERIC DEFAULT 0,
    brickwork_qty  NUMERIC DEFAULT 0,
    plastering_qty NUMERIC DEFAULT 0,
    formwork_qty   NUMERIC DEFAULT 0,
    total_required NUMERIC DEFAULT 0,
    ordered        NUMERIC DEFAULT 0,
    received       NUMERIC DEFAULT 0,
    used           NUMERIC DEFAULT 0,
    balance        NUMERIC DEFAULT 0,
    estimated_cost NUMERIC DEFAULT 0,
    synced_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 3: Planning & Scheduling
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE project_schedule (
    task_id          TEXT PRIMARY KEY,
    project_id       TEXT REFERENCES project_master(project_id),
    wbs_code         TEXT,
    task_name        TEXT,
    floor            TEXT,
    category         TEXT,
    start_date       DATE,
    end_date         DATE,
    duration         INTEGER,
    percent_complete NUMERIC DEFAULT 0,
    status           TEXT CHECK (status IN ('not_started','in_progress','completed','delayed')),
    predecessors     TEXT,
    assigned_to      TEXT,
    is_critical_path BOOLEAN DEFAULT FALSE,
    synced_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE task_tracker (
    task_id          TEXT PRIMARY KEY,
    project_id       TEXT REFERENCES project_master(project_id),
    schedule_task_id TEXT,
    date             DATE,
    task_description TEXT,
    assigned_to      TEXT,
    priority         TEXT CHECK (priority IN ('low','medium','high','critical')),
    status           TEXT CHECK (status IN ('pending','in_progress','completed','blocked')),
    remarks          TEXT,
    completed_date   DATE,
    synced_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE resource_plan (
    resource_id      TEXT PRIMARY KEY,
    project_id       TEXT REFERENCES project_master(project_id),
    schedule_task_id TEXT,
    resource_type    TEXT CHECK (resource_type IN ('labor','equipment','material')),
    resource_name    TEXT,
    quantity         NUMERIC,
    unit             TEXT,
    start_date       DATE,
    end_date         DATE,
    daily_rate       NUMERIC,
    total_cost       NUMERIC,
    synced_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dependencies (
    dependency_id      TEXT PRIMARY KEY,
    predecessor_task_id TEXT,
    successor_task_id   TEXT,
    type               TEXT CHECK (type IN ('FS','FF','SS','SF')),
    lag_days           INTEGER DEFAULT 0,
    synced_at          TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 4: Supply Chain
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE purchase_orders (
    po_id             TEXT PRIMARY KEY,
    project_id        TEXT REFERENCES project_master(project_id),
    vendor_id         TEXT REFERENCES vendor_master(vendor_id),
    po_date           DATE,
    expected_delivery DATE,
    subtotal          NUMERIC,
    gst_amount        NUMERIC,
    total_amount      NUMERIC,
    status            TEXT CHECK (status IN ('draft','approved','sent','partial_received','completed','cancelled')),
    approved_by       TEXT,
    remarks           TEXT,
    synced_at         TIMESTAMP DEFAULT NOW()
);

CREATE TABLE grn_delivery (
    grn_id         TEXT PRIMARY KEY,
    po_id          TEXT REFERENCES purchase_orders(po_id),
    project_id     TEXT REFERENCES project_master(project_id),
    vendor_id      TEXT REFERENCES vendor_master(vendor_id),
    received_date  DATE,
    received_by    TEXT,
    invoice_number TEXT,
    invoice_amount NUMERIC,
    vehicle_number TEXT,
    quality_check  TEXT CHECK (quality_check IN ('pass','fail','partial')),
    remarks        TEXT,
    synced_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inventory (
    inventory_id   TEXT PRIMARY KEY,
    project_id     TEXT REFERENCES project_master(project_id),
    material_id    TEXT REFERENCES material_master(material_id),
    material_name  TEXT,
    unit           TEXT,
    opening_stock  NUMERIC DEFAULT 0,
    total_received NUMERIC DEFAULT 0,
    total_issued   NUMERIC DEFAULT 0,
    closing_stock  NUMERIC DEFAULT 0,
    reorder_level  NUMERIC,
    is_low         BOOLEAN DEFAULT FALSE,
    last_updated   DATE,
    synced_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rate_history (
    history_id  TEXT PRIMARY KEY,
    material_id TEXT,
    vendor_id   TEXT,
    po_id       TEXT,
    date        DATE,
    rate        NUMERIC,
    quantity    NUMERIC,
    remarks     TEXT,
    synced_at   TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 5: On-site Operations
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE daily_log (
    log_id              TEXT PRIMARY KEY,
    project_id          TEXT REFERENCES project_master(project_id),
    date                DATE,
    floor               TEXT,
    weather             TEXT CHECK (weather IN ('sunny','cloudy','rainy','stormy')),
    work_description    TEXT,
    labor_count         INTEGER,
    issues              TEXT,
    next_day_plan       TEXT,
    logged_by           TEXT,
    supervisor_remarks  TEXT,
    synced_at           TIMESTAMP DEFAULT NOW()
);

CREATE TABLE labor_attendance (
    attendance_id   TEXT PRIMARY KEY,
    project_id      TEXT REFERENCES project_master(project_id),
    date            DATE,
    labor_name      TEXT,
    category        TEXT CHECK (category IN ('mason','helper','carpenter','plumber','electrician','painter','bar_bender','other')),
    contractor_name TEXT,
    present         BOOLEAN,
    overtime        NUMERIC DEFAULT 0,
    daily_wage      NUMERIC,
    overtime_rate   NUMERIC,
    total_wage      NUMERIC,
    synced_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE steel_register (
    register_id      TEXT PRIMARY KEY,
    project_id       TEXT REFERENCES project_master(project_id),
    date             DATE,
    floor            TEXT,
    element          TEXT,
    bar_diameter     NUMERIC,
    cut_length       NUMERIC,
    number_of_pieces INTEGER,
    total_weight     NUMERIC,
    grn_id           TEXT,
    issued_by        TEXT,
    received_by      TEXT,
    synced_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE concrete_register (
    register_id     TEXT PRIMARY KEY,
    project_id      TEXT REFERENCES project_master(project_id),
    date            DATE,
    floor           TEXT,
    element         TEXT,
    grade           TEXT,
    volume          NUMERIC,
    batch_count     INTEGER,
    start_time      TEXT,
    end_time        TEXT,
    slump_value     NUMERIC,
    cubes_cast      INTEGER,
    cube_test_date_7  DATE,
    cube_test_date_28 DATE,
    remarks         TEXT,
    synced_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE quality_checks (
    check_id       TEXT PRIMARY KEY,
    project_id     TEXT REFERENCES project_master(project_id),
    date           DATE,
    floor          TEXT,
    check_type     TEXT,
    element        TEXT,
    standard       TEXT,
    observed_value TEXT,
    result         TEXT CHECK (result IN ('pass','fail','marginal')),
    checked_by     TEXT,
    remarks        TEXT,
    synced_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE safety_log (
    log_id            TEXT PRIMARY KEY,
    project_id        TEXT REFERENCES project_master(project_id),
    date              DATE,
    incident_type     TEXT CHECK (incident_type IN ('near_miss','minor_injury','major_injury','fatality','property_damage','observation')),
    description       TEXT,
    location          TEXT,
    persons_involved  TEXT,
    action_taken      TEXT,
    reported_by       TEXT,
    status            TEXT CHECK (status IN ('open','investigating','resolved','closed')),
    severity          TEXT CHECK (severity IN ('low','medium','high','critical')),
    synced_at         TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 6: Finance & Payments
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE expense_log (
    expense_id       TEXT PRIMARY KEY,
    project_id       TEXT REFERENCES project_master(project_id),
    date             DATE,
    category         TEXT,
    vendor_id        TEXT,
    description      TEXT,
    amount           NUMERIC,
    gst_amount       NUMERIC,
    total_amount     NUMERIC,
    payment_mode     TEXT CHECK (payment_mode IN ('cash','bank_transfer','cheque','upi')),
    reference_number TEXT,
    bill_number      TEXT,
    approved_by      TEXT,
    synced_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE voucher_register (
    voucher_id    TEXT PRIMARY KEY,
    project_id    TEXT REFERENCES project_master(project_id),
    date          DATE,
    voucher_type  TEXT CHECK (voucher_type IN ('payment','receipt','journal','contra')),
    expense_id    TEXT,
    description   TEXT,
    debit_account TEXT,
    credit_account TEXT,
    amount        NUMERIC,
    approved_by   TEXT,
    narration     TEXT,
    synced_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE budget_vs_actual (
    id               SERIAL PRIMARY KEY,
    project_id       TEXT REFERENCES project_master(project_id),
    category         TEXT,
    boq_budget       NUMERIC,
    revised_budget   NUMERIC,
    actual_spent     NUMERIC,
    committed        NUMERIC,
    variance         NUMERIC,
    variance_percent NUMERIC,
    status           TEXT CHECK (status IN ('under_budget','on_track','over_budget','critical')),
    floor            TEXT,
    synced_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cash_flow (
    entry_id        TEXT PRIMARY KEY,
    project_id      TEXT REFERENCES project_master(project_id),
    date            DATE,
    type            TEXT CHECK (type IN ('inflow','outflow')),
    category        TEXT,
    description     TEXT,
    amount          NUMERIC,
    running_balance NUMERIC,
    source          TEXT,
    synced_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments_tracker (
    payment_id     TEXT PRIMARY KEY,
    project_id     TEXT REFERENCES project_master(project_id),
    vendor_id      TEXT,
    po_id          TEXT,
    invoice_number TEXT,
    invoice_date   DATE,
    invoice_amount NUMERIC,
    paid_amount    NUMERIC,
    balance_due    NUMERIC,
    due_date       DATE,
    status         TEXT CHECK (status IN ('pending','partial','paid','overdue')),
    payment_date   DATE,
    payment_mode   TEXT CHECK (payment_mode IN ('cash','bank_transfer','cheque','upi')),
    synced_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 7: Dashboard Views (Metabase will query these)
-- ─────────────────────────────────────────────────────────────────────────────

-- Master Dashboard View
CREATE VIEW v_master_dashboard AS
SELECT
    p.project_id,
    p.project_name,
    p.status,
    COALESCE(AVG(s.percent_complete), 0) AS overall_progress,
    COALESCE(SUM(bva.actual_spent) / NULLIF(SUM(bva.boq_budget), 0) * 100, 0) AS budget_utilization,
    (SELECT COUNT(*) FROM daily_log dl WHERE dl.project_id = p.project_id AND dl.date = CURRENT_DATE) AS logs_today,
    (SELECT COALESCE(SUM(dl.labor_count), 0) FROM daily_log dl WHERE dl.project_id = p.project_id AND dl.date = CURRENT_DATE) AS labor_today,
    (SELECT COUNT(*) FROM purchase_orders po WHERE po.project_id = p.project_id AND po.status NOT IN ('completed','cancelled')) AS open_pos,
    (SELECT COUNT(*) FROM payments_tracker pt WHERE pt.project_id = p.project_id AND pt.status IN ('pending','overdue')) AS pending_payments,
    (SELECT COUNT(*) FROM inventory i WHERE i.project_id = p.project_id AND i.is_low = TRUE) AS inventory_alerts
FROM project_master p
LEFT JOIN project_schedule s ON s.project_id = p.project_id
LEFT JOIN budget_vs_actual bva ON bva.project_id = p.project_id
GROUP BY p.project_id, p.project_name, p.status;

-- Finance Dashboard View
CREATE VIEW v_finance_dashboard AS
SELECT
    p.project_id,
    p.project_name,
    COALESCE(SUM(bva.boq_budget), 0) AS total_budget,
    COALESCE(SUM(bva.actual_spent), 0) AS total_spent,
    COALESCE(SUM(bva.committed), 0) AS total_committed,
    COALESCE(SUM(bva.boq_budget) - SUM(bva.actual_spent) - SUM(bva.committed), 0) AS available_budget,
    (SELECT COALESCE(SUM(cf.amount), 0) FROM cash_flow cf WHERE cf.project_id = p.project_id AND cf.type = 'inflow') AS total_inflow,
    (SELECT COALESCE(SUM(cf.amount), 0) FROM cash_flow cf WHERE cf.project_id = p.project_id AND cf.type = 'outflow') AS total_outflow,
    (SELECT COALESCE(SUM(pt.balance_due), 0) FROM payments_tracker pt WHERE pt.project_id = p.project_id AND pt.status != 'paid') AS pending_payables
FROM project_master p
LEFT JOIN budget_vs_actual bva ON bva.project_id = p.project_id
GROUP BY p.project_id, p.project_name;

-- Inventory Alerts View
CREATE VIEW v_inventory_alerts AS
SELECT
    i.inventory_id,
    i.project_id,
    p.project_name,
    i.material_name,
    i.unit,
    i.closing_stock,
    i.reorder_level,
    i.closing_stock - i.reorder_level AS stock_gap,
    i.last_updated
FROM inventory i
JOIN project_master p ON p.project_id = i.project_id
WHERE i.is_low = TRUE
ORDER BY (i.closing_stock - i.reorder_level) ASC;

-- Daily Labor Summary View
CREATE VIEW v_labor_summary AS
SELECT
    la.project_id,
    la.date,
    la.category,
    COUNT(*) FILTER (WHERE la.present = TRUE) AS present_count,
    COUNT(*) FILTER (WHERE la.present = FALSE) AS absent_count,
    SUM(la.overtime) AS total_overtime_hours,
    SUM(la.total_wage) AS total_wages
FROM labor_attendance la
GROUP BY la.project_id, la.date, la.category;

-- Budget Category Breakdown View
CREATE VIEW v_budget_breakdown AS
SELECT
    bva.project_id,
    p.project_name,
    bva.category,
    bva.boq_budget,
    bva.actual_spent,
    bva.committed,
    bva.variance,
    bva.variance_percent,
    bva.status,
    CASE
        WHEN bva.boq_budget > 0 THEN ROUND(bva.actual_spent / bva.boq_budget * 100, 1)
        ELSE 0
    END AS utilization_percent
FROM budget_vs_actual bva
JOIN project_master p ON p.project_id = bva.project_id
ORDER BY bva.actual_spent DESC;

-- Schedule Progress View
CREATE VIEW v_schedule_progress AS
SELECT
    ps.project_id,
    ps.floor,
    COUNT(*) AS total_tasks,
    COUNT(*) FILTER (WHERE ps.status = 'completed') AS completed_tasks,
    COUNT(*) FILTER (WHERE ps.status = 'delayed') AS delayed_tasks,
    ROUND(AVG(ps.percent_complete), 1) AS avg_progress,
    COUNT(*) FILTER (WHERE ps.is_critical_path = TRUE) AS critical_path_tasks
FROM project_schedule ps
GROUP BY ps.project_id, ps.floor;

-- Quality Summary View
CREATE VIEW v_quality_summary AS
SELECT
    qc.project_id,
    qc.check_type,
    COUNT(*) AS total_checks,
    COUNT(*) FILTER (WHERE qc.result = 'pass') AS passed,
    COUNT(*) FILTER (WHERE qc.result = 'fail') AS failed,
    ROUND(COUNT(*) FILTER (WHERE qc.result = 'pass')::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1) AS pass_rate
FROM quality_checks qc
GROUP BY qc.project_id, qc.check_type;

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes for Metabase query performance
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX idx_boq_project ON boq_budget(project_id);
CREATE INDEX idx_schedule_project ON project_schedule(project_id);
CREATE INDEX idx_schedule_status ON project_schedule(status);
CREATE INDEX idx_tasks_date ON task_tracker(date);
CREATE INDEX idx_tasks_status ON task_tracker(status);
CREATE INDEX idx_po_project ON purchase_orders(project_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_grn_po ON grn_delivery(po_id);
CREATE INDEX idx_inventory_project ON inventory(project_id);
CREATE INDEX idx_inventory_low ON inventory(is_low) WHERE is_low = TRUE;
CREATE INDEX idx_daily_log_date ON daily_log(date);
CREATE INDEX idx_labor_date ON labor_attendance(date);
CREATE INDEX idx_labor_project_date ON labor_attendance(project_id, date);
CREATE INDEX idx_expense_date ON expense_log(date);
CREATE INDEX idx_expense_project ON expense_log(project_id);
CREATE INDEX idx_budget_project ON budget_vs_actual(project_id);
CREATE INDEX idx_cashflow_date ON cash_flow(date);
CREATE INDEX idx_payments_status ON payments_tracker(status);
CREATE INDEX idx_quality_project ON quality_checks(project_id);
CREATE INDEX idx_safety_project ON safety_log(project_id);
CREATE INDEX idx_safety_severity ON safety_log(severity);
