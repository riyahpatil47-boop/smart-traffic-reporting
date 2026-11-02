import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  ClipboardList,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { StatCard, PageHeader, EmptyState } from '@/components/ui';
import {
  categoryStyles,
  formatDateTime,
  severityStyles,
  statusStyles,
  timeAgo,
} from '@/lib/utils';
import { Badge } from '@/components/ui';
import { IncidentDetailModal } from '@/components/IncidentDetailModal';
import type { Incident } from '@/types';

export function UserOverview() {
  const { user } = useAuth();
  const { incidents } = useData();
  const [selected, setSelected] = useState<Incident | null>(null);

  const mine = useMemo(
    () => incidents.filter((i) => i.userId === user?.id),
    [incidents, user]
  );
  const pending = mine.filter((i) => i.status === 'Pending').length;
  const inProgress = mine.filter((i) => i.status === 'In Progress').length;
  const resolved = mine.filter((i) => i.status === 'Resolved').length;

  const recent = [...mine]
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name.split(' ')[0]}`}
        description="Here is the latest on your reported traffic incidents."
        action={
          <Link to="/user/report" className="btn-accent">
            <PlusCircle size={16} /> Report an incident
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total reports" value={mine.length} icon={<ClipboardList size={20} />} tone="navy" />
        <StatCard label="Pending" value={pending} icon={<Clock size={20} />} tone="amber" />
        <StatCard label="In progress" value={inProgress} icon={<Activity size={20} />} tone="blue" />
        <StatCard label="Resolved" value={resolved} icon={<CheckCircle2 size={20} />} tone="emerald" />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-900">Recent activity</h2>
          <Link to="/user/reports" className="text-sm font-semibold text-traffic-600 hover:text-traffic-700">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={28} />}
            title="No reports yet"
            message="When you submit a traffic incident, it will appear here."
            action={
              <Link to="/user/report" className="btn-accent">
                <PlusCircle size={16} /> Report your first incident
              </Link>
            }
          />
        ) : (
          <div className="card divide-y divide-slate-100">
            {recent.map((inc) => (
              <button
                key={inc.id}
                onClick={() => setSelected(inc)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-600">
                  <TrendingUp size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">
                    {inc.title}
                  </p>
                  <p className="truncate text-xs text-navy-400">
                    {inc.id} · {inc.location} · {timeAgo(inc.submittedAt)}
                  </p>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <Badge className={severityStyles[inc.severity]}>{inc.severity}</Badge>
                  <Badge className={statusStyles[inc.status]}>{inc.status}</Badge>
                </div>
                <ArrowRight size={16} className="text-navy-300" />
              </button>
            ))}
          </div>
        )}
      </div>

      <IncidentDetailModal
        incident={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
