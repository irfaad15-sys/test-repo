import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProgressChart } from "@/components/charts/progress-chart";
import { StatusBadge } from "@/components/tables/data-table";

const milestones = [
  { milestone: "Foundation & Basement", planned: "Mar 15, 2024", actual: "Mar 14, 2024", status: "completed" },
  { milestone: "Ground Floor Structure", planned: "May 30, 2024", actual: "In Progress", status: "in_progress" },
  { milestone: "1st Floor Structure", planned: "Jul 30, 2024", actual: "—", status: "not_started" },
  { milestone: "2nd Floor Structure", planned: "Sep 30, 2024", actual: "—", status: "not_started" },
  { milestone: "3rd Floor + Terrace", planned: "Nov 30, 2024", actual: "—", status: "not_started" },
  { milestone: "Finishing & Handover", planned: "Dec 31, 2024", actual: "—", status: "not_started" },
];

export default function ClientReportPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Client Report</h1>
        <p className="text-sm text-gray-500">Module 7 — Printable client-facing progress report</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Porur Residential Complex</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Report Period: June 1–10, 2024</p>
            </div>
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Export PDF
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-4">Overall Progress: 42%</h4>
              <ProgressChart />
            </div>

            <div>
              <h4 className="font-semibold mb-4">Milestone Status</h4>
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div>
                      <p className="text-sm font-medium">{m.milestone}</p>
                      <p className="text-xs text-gray-500">Planned: {m.planned}</p>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Financial Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <SummaryRow label="Total Project Cost" value="₹2.4 Cr" />
              <SummaryRow label="Amount Received" value="₹1.5 Cr" />
              <SummaryRow label="Amount Spent" value="₹1.1 Cr" />
              <SummaryRow label="Balance with Builder" value="₹40L" />
              <SummaryRow label="Next Installment Due" value="₹45L — Jul 2024" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Next Week Plan</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">&#8226;</span> Complete 1st floor column casting (C7-C12)</li>
              <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">&#8226;</span> Begin 1st floor beam formwork installation</li>
              <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">&#8226;</span> Continue GF brickwork — target east wall completion</li>
              <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">&#8226;</span> Electrical conduit placement in GF walls</li>
              <li className="flex items-start gap-2"><span className="text-brand-600 mt-0.5">&#8226;</span> Steel delivery expected — PO004 (TATA Steel)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
