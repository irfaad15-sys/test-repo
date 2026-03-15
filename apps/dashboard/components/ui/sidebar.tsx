"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  {
    group: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: "grid" },
    ],
  },
  {
    group: "Module 1: Master Data",
    items: [
      { name: "Projects", href: "/projects", icon: "building" },
      { name: "BOQ Budget", href: "/projects/boq", icon: "file-text" },
      { name: "Rate Master", href: "/materials/rates", icon: "tag" },
      { name: "Material Master", href: "/materials", icon: "package" },
      { name: "Vendor Master", href: "/materials/vendors", icon: "truck" },
    ],
  },
  {
    group: "Module 2: Calculations",
    items: [
      { name: "Concrete Calc", href: "/materials/calc/concrete", icon: "calculator" },
      { name: "Steel Calc", href: "/materials/calc/steel", icon: "calculator" },
      { name: "Brickwork Calc", href: "/materials/calc/brickwork", icon: "calculator" },
      { name: "Material Summary", href: "/materials/summary", icon: "clipboard" },
    ],
  },
  {
    group: "Module 3: Scheduling",
    items: [
      { name: "Project Schedule", href: "/projects/schedule", icon: "calendar" },
      { name: "Task Tracker", href: "/projects/tasks", icon: "check-circle" },
      { name: "Resource Plan", href: "/projects/resources", icon: "users" },
    ],
  },
  {
    group: "Module 4: Supply Chain",
    items: [
      { name: "Purchase Orders", href: "/materials/purchase-orders", icon: "shopping-cart" },
      { name: "GRN / Delivery", href: "/materials/grn", icon: "package" },
      { name: "Inventory", href: "/materials/inventory", icon: "database" },
    ],
  },
  {
    group: "Module 5: Site Ops",
    items: [
      { name: "Daily Log", href: "/projects/daily-log", icon: "edit" },
      { name: "Labor Attendance", href: "/projects/labor", icon: "users" },
      { name: "Steel Register", href: "/projects/steel-register", icon: "layers" },
      { name: "Concrete Register", href: "/projects/concrete-register", icon: "layers" },
      { name: "Quality Checks", href: "/projects/quality", icon: "shield" },
      { name: "Safety Log", href: "/projects/safety", icon: "alert-triangle" },
    ],
  },
  {
    group: "Module 6: Finance",
    items: [
      { name: "Expense Log", href: "/finance", icon: "credit-card" },
      { name: "Voucher Register", href: "/finance/vouchers", icon: "file" },
      { name: "Budget vs Actual", href: "/finance/budget", icon: "bar-chart" },
      { name: "Cash Flow", href: "/finance/cashflow", icon: "trending-up" },
      { name: "Payments", href: "/finance/payments", icon: "dollar-sign" },
    ],
  },
  {
    group: "Module 7: Reports",
    items: [
      { name: "Master Dashboard", href: "/reports", icon: "pie-chart" },
      { name: "Finance Dashboard", href: "/reports/finance", icon: "bar-chart-2" },
      { name: "Project Dashboard", href: "/reports/project", icon: "activity" },
      { name: "Material Report", href: "/reports/materials", icon: "file-text" },
      { name: "Client Report", href: "/reports/client", icon: "briefcase" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-lg font-bold text-gray-900">Porur CMS</h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((group) => (
          <div key={group.group} className="mb-4">
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {group.group}
            </p>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
