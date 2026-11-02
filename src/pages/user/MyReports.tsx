import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Eye,
  PlusCircle,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { CATEGORIES, STATUSES, type Incident } from '@/types';
import { PageHeader, EmptyState, Badge } from '@/components/ui';
import {
  categoryStyles,
  filterIncidents,
  formatDate,
  severityStyles,
  sortIncidents,
  statusStyles,
} from '@/lib/utils';
import { IncidentDetailModal } from '@/components/IncidentDetailModal';

export function MyReports() {
  const { user } = useAuth();
  const { incidents } = useData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'severity'>('date');
  const [selected, setSelected] = useState<Incident | null>(null);

  const mine = useMemo(
    () => incidents.filter((i) => i.userId === user?.id),
    [incidents, user]
  );

  const filtered = useMemo(
    () =>
      sortIncidents(
        filterIncidents(mine, { search, category, status }),
        sortBy
      ),
    [mine, search, category, status, sortBy]
  );

  return (
    <div>
      <PageHeader
        title="My reports"
        description="All the traffic incidents you have submitted."
        action={
          <Link to="/user/report" className="btn-accent">
            <PlusCircle size={16} /> New report
          </Link>
        }
      />

      {/* Filters */}
      <div className="card mb-5 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
            <input className="input pl-9" placeholder="Search title or location…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'severity')}>
            <option value="date">Sort: Newest first</option>
            <option value="severity">Sort: Highest severity</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={28} />}
          title={mine.length === 0 ? 'No reports yet' : 'No matching reports'}
          message={
            mine.length === 0
              ? 'Submit your first traffic incident report to see it here.'
              : 'Try adjusting your search or filters.'
          }
          action={
            mine.length === 0 ? (
              <Link to="/user/report" className="btn-accent">
                <PlusCircle size={16} /> Report an incident
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-navy-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Report ID</th>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="hidden px-5 py-3 font-semibold md:table-cell">Category</th>
                  <th className="hidden px-5 py-3 font-semibold lg:table-cell">Location</th>
                  <th className="px-5 py-3 font-semibold">Severity</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((inc) => (
                  <tr key={inc.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs text-navy-500">{inc.id}</td>
                    <td className="px-5 py-3 font-medium text-navy-900 max-w-[200px] truncate">{inc.title}</td>
                    <td className="hidden px-5 py-3 md:table-cell">
                      <Badge className={categoryStyles[inc.category]}>{inc.category}</Badge>
                    </td>
                    <td className="hidden px-5 py-3 text-navy-600 lg:table-cell max-w-[180px] truncate">{inc.location}</td>
                    <td className="px-5 py-3"><Badge className={severityStyles[inc.severity]}>{inc.severity}</Badge></td>
                    <td className="hidden px-5 py-3 text-navy-500 sm:table-cell">{formatDate(inc.submittedAt)}</td>
                    <td className="px-5 py-3"><Badge className={statusStyles[inc.status]}>{inc.status}</Badge></td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => setSelected(inc)} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-100 hover:text-navy-700" aria-label="View details">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <IncidentDetailModal incident={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
