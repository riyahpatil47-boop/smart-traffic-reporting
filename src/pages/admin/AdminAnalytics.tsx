import { useMemo } from 'react';
import {
  BarChart3,
  Clock,
  Gauge,
  MapPin,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { PageHeader, StatCard, Badge } from '@/components/ui';
import {
  CategoryBreakdown,
  SeverityBreakdown,
  BarChart,
  DonutChart,
} from '@/components/charts/Charts';
import { CATEGORIES, SEVERITIES, STATUSES } from '@/types';
import {
  statusStyles,
  categoryStyles,
  severityStyles,
  severityRank,
} from '@/lib/utils';

const statusColors = ['#94a3b8', '#3b82f6', '#22c55e'];

export function AdminAnalytics() {
  const { incidents } = useData();

  const statusData = useMemo(
    () =>
      STATUSES.map((s) => ({
        label: s,
        value: incidents.filter((i) => i.status === s).length,
      })),
    [incidents]
  );

  const monthly = useMemo(() => {
    const buckets: { label: string; value: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('en-US', { month: 'short' });
      const count = incidents.filter((inc) => {
        const dt = new Date(inc.submittedAt);
        return (
          dt.getFullYear() === d.getFullYear() && dt.getMonth() === d.getMonth()
        );
      }).length;
      buckets.push({ label, value: count });
    }
    return buckets;
  }, [incidents]);

  const topLocations = useMemo(() => {
    const counts = new Map<string, number>();
    incidents.forEach((inc) =>
      counts.set(inc.location, (counts.get(inc.location) ?? 0) + 1)
    );
    return [...counts.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [incidents]);

  const resolved = useMemo(
    () => incidents.filter((i) => i.status === 'Resolved'),
    [incidents]
  );

  const avgResolutionHours = useMemo(() => {
    if (resolved.length === 0) return null;
    const totalHours = resolved.reduce((sum, inc) => {
      const submit = new Date(inc.submittedAt).getTime();
      const last = inc.history[inc.history.length - 1];
      const end = last ? new Date(last.updatedAt).getTime() : submit;
      return sum + Math.max(0, (end - submit) / 3_600_000);
    }, 0);
    return totalHours / resolved.length;
  }, [resolved]);

  const crossTab = useMemo(() => {
    const grid: Record<string, Record<string, number>> = {};
    SEVERITIES.forEach((s) => {
      grid[s] = {};
      STATUSES.forEach((st) => (grid[s][st] = 0));
    });
    incidents.forEach((inc) => {
      grid[inc.severity][inc.status] += 1;
    });
    return grid;
  }, [incidents]);

  const maxCell = useMemo(
    () =>
      Math.max(
        1,
        ...SEVERITIES.flatMap((s) => STATUSES.map((st) => crossTab[s][st]))
      ),
    [crossTab]
  );

  const avgSeverity = (
    incidents.reduce((s, i) => s + severityRank(i.severity), 0) /
    Math.max(1, incidents.length)
  ).toFixed(1);
  const resolutionRate = Math.round(
    (resolved.length / Math.max(1, incidents.length)) * 100
  );

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Demonstration analytics computed from locally stored incident data."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Avg. severity"
          value={avgSeverity}
          icon={<Gauge size={20} />}
          tone="orange"
          subtitle="0 = Low · 3 = Critical"
        />
        <StatCard
          label="Resolution rate"
          value={`${resolutionRate}%`}
          icon={<TrendingUp size={20} />}
          tone="emerald"
          subtitle={`${resolved.length} of ${incidents.length} resolved`}
        />
        <StatCard
          label="Avg. resolution time"
          value={avgResolutionHours === null ? '—' : `${avgResolutionHours.toFixed(0)}h`}
          icon={<Timer size={20} />}
          tone="blue"
          subtitle="Submit to final status"
        />
        <StatCard
          label="Categories tracked"
          value={CATEGORIES.length}
          icon={<BarChart3 size={20} />}
          tone="navy"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">
            Incidents by category
          </h2>
          <CategoryBreakdown incidents={incidents} />
        </div>
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">
            Incidents by severity
          </h2>
          <SeverityBreakdown incidents={incidents} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">
            Status distribution
          </h2>
          <BarChart data={statusData} colors={statusColors} />
        </div>
        <div className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy-900">
            <MapPin size={18} className="text-navy-400" /> Top reported locations
          </h2>
          {topLocations.length === 0 ? (
            <p className="py-6 text-center text-sm text-navy-400">
              No location data yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {topLocations.map((loc, i) => (
                <li key={loc.label} className="flex items-center gap-3 py-2.5">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy-100 text-xs font-bold text-navy-700">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-navy-700">
                    {loc.label}
                  </span>
                  <span className="shrink-0 rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-bold text-navy-700">
                    {loc.value}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">
            Reports over the last 6 months
          </h2>
          <BarChart data={monthly} colors={['#223159']} />
          <p className="mt-3 text-xs text-navy-400">
            Based on incident submission dates in demo data.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy-900">
            <Clock size={18} className="text-navy-400" /> Severity × Status
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-center text-sm">
              <thead>
                <tr>
                  <th className="px-3 pb-3 text-left text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Severity
                  </th>
                  {STATUSES.map((st) => (
                    <th key={st} className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-navy-400">
                      {st}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SEVERITIES.map((sev) => (
                  <tr key={sev}>
                    <td className="px-3 py-2 text-left">
                      <Badge className={severityStyles[sev]}>{sev}</Badge>
                    </td>
                    {STATUSES.map((st) => {
                      const count = crossTab[sev][st];
                      const intensity = count / maxCell;
                      return (
                        <td key={st} className="px-3 py-2">
                          <div
                            className="mx-auto grid h-12 w-full max-w-[90px] place-items-center rounded-lg text-sm font-bold transition-all"
                            style={{
                              backgroundColor:
                                count === 0
                                  ? '#f1f5f9'
                                  : `rgba(34, 49, 89, ${0.15 + intensity * 0.65})`,
                              color: intensity > 0.5 ? '#fff' : '#223159',
                            }}
                            title={`${sev} · ${st}: ${count}`}
                          >
                            {count}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-navy-400">
            Darker cells indicate more incidents at that severity and status.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">Category mix</h2>
          <DonutChart
            data={CATEGORIES.map((c) => ({
              label: c,
              value: incidents.filter((i) => i.category === c).length,
            }))}
            colors={['#ef4444', '#f59e0b', '#3b82f6', '#f97316', '#a855f7', '#64748b']}
          />
        </div>
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">Severities</h2>
          <div className="flex flex-wrap gap-2">
            {SEVERITIES.map((s) => (
              <Badge key={s} className={severityStyles[s]}>
                {s}
              </Badge>
            ))}
          </div>
          <h3 className="mb-2 mt-5 text-sm font-bold text-navy-900">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Badge key={c} className={categoryStyles[c]}>
                {c}
              </Badge>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-navy-900">Statuses</h2>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Badge key={s} className={statusStyles[s]}>
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-navy-400">
        Demo analytics — all figures are derived from demonstration data stored
        in your browser. Not real civic statistics.
      </p>
    </div>
  );
}
