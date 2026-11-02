import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ClipboardList,
  TrendingUp,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { PageHeader, StatCard, Badge, EmptyState } from '@/components/ui';
import {
  categoryStyles,
  formatDateTime,
  severityStyles,
  statusStyles,
  timeAgo,
} from '@/lib/utils';
import { CategoryBreakdown, SeverityBreakdown } from '@/components/charts/Charts';
import { IncidentDetailModal } from '@/components/IncidentDetailModal';
import type { Incident } from '@/types';

export function AdminOverview() {
  const { incidents } = useData();
  const [selected, setSelected] = useState<Incident | null>(null);

  const stats = useMemo(() => {
    const pending = incidents.filter((i) => i.status === 'Pending').length;
    const inProgress = incidents.filter((i) => i.status === 'In Progress').length;
    const resolved = incidents.filter((i) => i.status === 'Resolved').length;
    const critical = incidents.filter((i) => i.severity === 'Critical').length;
    return { total: incidents.length, pending, inProgress, resolved, critical };
  }, [incidents]);

  const recent = useMemo(
    () =>
      [...incidents]
        .sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime()
        )
        .slice(0, 6),
    [incidents]
  );

  return (
    <div>
      <PageHeader
        title="Operations overview"
        description="Monitor all reported traffic incidents across the platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total incidents" value={stats.total} icon={<ClipboardList size={20} />} tone="navy" />
        <StatCard label="Pending" value={stats.pending} icon={<Clock size={20} />} tone="amber" />
        <StatCard label="In progress" value={stats.inProgress} icon={<Activity size={20} />} tone="blue" />
        <StatCard label="Resolved" value={stats.resolved} icon={<CheckCircle2 size={20} />} tone="emerald" />
        <StatCard label="Critical" value={stats.critical} icon={<AlertTriangle size={20} />} tone="red" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-navy-900">Recent incidents</h2>
          {recent.length === 0 ? (
            <EmptyState icon={<ClipboardList size={28} />} title="No incidents" message="No reports have been submitted yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-navy-400">
                  <tr>
                    <th className="pb-3 font-semibold">Report</th>
                    <th className="hidden pb-3 font-semibold sm:table-cell">Location</th>
                    <th className="pb-3 font-semibold">Severity</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="hidden pb-3 font-semibold md:table-cell">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.map((inc) => (
                    <tr key={inc.id} onClick={() => setSelected(inc)} className="cursor-pointer transition-colors hover:bg-slate-50">
                      <td className="py-3">
                        <p className="font-medium text-navy-900 max-w-[180px] truncate">{inc.title}</p>
                        <p className="font-mono text-xs text-navy-400">{inc.id}</p>
                      </td>
                      <td className="hidden py-3 text-navy-600 sm:table-cell max-w-[150px] truncate">{inc.location}</td>
                      <td className="py-3"><Badge className={severityStyles[inc.severity]}>{inc.severity}</Badge></td>
                      <td className="py-3"><Badge className={statusStyles[inc.status]}>{inc.status}</Badge></td>
                      <td className="hidden py-3 text-navy-500 md:table-cell">{timeAgo(inc.submittedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">Severity breakdown</h2>
          <SeverityBreakdown incidents={incidents} />
        </div>
      </div>

      <div className="mt-6 card p-6">
        <h2 className="mb-4 text-lg font-bold text-navy-900">Category breakdown</h2>
        <CategoryBreakdown incidents={incidents} />
        <p className="mt-4 text-xs text-navy-400">Demo analytics — computed from locally stored demonstration data.</p>
      </div>

      <IncidentDetailModal incident={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
