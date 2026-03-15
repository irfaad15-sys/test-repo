import Link from "next/link";

const modules = [
  { name: "Master Data", href: "/dashboard", description: "Source of truth — projects, rates, materials, vendors", color: "bg-amber-700" },
  { name: "Calculations", href: "/materials", description: "Concrete, steel, brickwork, plastering, formwork", color: "bg-indigo-700" },
  { name: "Scheduling", href: "/projects", description: "Gantt chart, tasks, resource planning, dependencies", color: "bg-blue-700" },
  { name: "Supply Chain", href: "/materials", description: "Purchase orders, GRN, inventory, rate history", color: "bg-teal-700" },
  { name: "Site Operations", href: "/projects", description: "Daily log, labor, steel/concrete registers, quality", color: "bg-orange-800" },
  { name: "Finance", href: "/finance", description: "Expenses, vouchers, budget vs actual, cash flow", color: "bg-green-800" },
  { name: "Reports", href: "/reports", description: "Master dashboard, finance, project, material, client", color: "bg-yellow-800" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Porur Construction Management
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            7 modules / 32 interconnected sheets / Full n8n automation
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, i) => (
            <Link
              key={mod.name}
              href={mod.href}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center justify-center rounded-md ${mod.color} px-2.5 py-1 text-xs font-medium text-white`}>
                  Module {i + 1}
                </span>
                <h2 className="text-lg font-semibold text-gray-900">{mod.name}</h2>
              </div>
              <p className="text-sm text-gray-600">{mod.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
