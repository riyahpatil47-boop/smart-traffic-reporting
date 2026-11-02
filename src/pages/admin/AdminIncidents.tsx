import { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Eye,
  Save,
  Search,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import {
  CATEGORIES,
  SEVERITIES,
  STATUSES,
  type Incident,
  type IncidentStatus,
} from '@/types';
import { PageHeader, EmptyState, Badge } from '@/components/ui';
import {
  categoryStyles,
  filterIncidents,
  formatDate,
  severityStyles,
  severityRank,
  sortIncidents,
  statusStyles,
} from '@/lib/utils';
import { IncidentDetailModal } from '@/components/IncidentDetailModal';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';

export function AdminIncidents() {
  const { user } = useAuth();
  const { incidents, updateIncidentStatus } = useData();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'severity'>('date');
  const [selected, setSelected] = useState<Incident | null>(null);
  const [statusModal, setStatusModal] = useState<Incident | null>(null);

  const [newStatus, setNewStatus] = useState<IncidentStatus>('Pending');
  const [note, setNote] = useState('');
  const [statusError, setStatusError] = useState('');
  const [statusSuccess, setStatusSuccess] = useState('');
  const [confirmStatus, setConfirmStatus] = useState(false);

  const filtered = useMemo(
    () =>
      sortIncidents(
        filterIncidents(incidents, { search, category, severity, status }),
        sortBy
      ),
    [incidents, search, category, severity, status, sortBy]
  );

  const openStatusModal = (inc: Incident) => {
    setStatusModal(inc);
    setNewStatus(inc.status);
    setNote('');
    setStatusError('');
    setStatusSuccess('');
  };

  const applyStatus = () => {
    if (!statusModal) return;
    if (newStatus === statusModal.status && !note.trim()) {
      setStatusError('Choose a new status or add an update note.');
      return;
    }
    updateIncidentStatus(
      statusModal.id,
      newStatus,
      note.trim(),
      user?.name ?? 'Administrator'
    );
    setStatusSuccess('Status updated successfully.');
    setTimeout(() => {
      setStatusModal(null);
      setConfirmStatus(false);
    }, 900);
  };

  return (
    <div>
      <PageHeader
        title="Incident management"
        description="Review, triage and update every reported incident across the platform."
      />

      <div className="card mb-5 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
            <input className="input pl-9" placeholder="Search ID, title, location…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input" value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="all">All severities</option>
            {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
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
          title="No incidents found"
          message="Try adjusting your search or filters."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-navy-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Report ID</th>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="hidden px-5 py-3 font-semibold lg:table-cell">Category</th>
                  <th className="hidden px-5 py-3 font-semibold lg:table-cell">Location</th>
                  <th className="px-5 py-3 font-semibold">Severity</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((inc) => (
                  <tr key={inc.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs text-navy-500">{inc.id}</td>
                    <td className="px-5 py-3 font-medium text-navy-900 max-w-[200px] truncate">{inc.title}</td>
                    <td className="hidden px-5 py-3 lg:table-cell"><Badge className={categoryStyles[inc.category]}>{inc.category}</Badge></td>
                    <td className="hidden px-5 py-3 text-navy-600 lg:table-cell max-w-[160px] truncate">{inc.location}</td>
                    <td className="px-5 py-3"><Badge className={severityStyles[inc.severity]}>{inc.severity}</Badge></td>
                    <td className="hidden px-5 py-3 text-navy-500 sm:table-cell">{formatDate(inc.submittedAt)}</td>
                    <td className="px-5 py-3"><Badge className={statusStyles[inc.status]}>{inc.status}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setSelected(inc)} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-100 hover:text-navy-700" aria-label="View details">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openStatusModal(inc)} className="rounded-lg p-1.5 text-traffic-600 hover:bg-traffic-50" aria-label="Update status">
                          <Save size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <IncidentDetailModal incident={selected} open={!!selected} onClose={() => setSelected(null)} />

      {/* Status update modal */}
      <Modal
        open={!!statusModal}
        onClose={() => setStatusModal(null)}
        title={`Update status — ${statusModal?.id ?? ''}`}
        size="md"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setStatusModal(null)}>Cancel</button>
            <button className="btn-accent" onClick={() => setConfirmStatus(true)}>
              <Save size={16} /> Apply update
            </button>
          </>
        }
      >
        {statusModal && (
          <div className="space-y-4">
            {statusError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{statusError}</span>
              </div>
            )}
            {statusSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-200 animate-fade-in">
                <CheckCircle2 size={16} /> {statusSuccess}
              </div>
            )}
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="font-semibold text-navy-900">{statusModal.title}</p>
              <p className="text-xs text-navy-400">{statusModal.location} · currently {statusModal.status}</p>
            </div>
            <div>
              <label className="label">New status</label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewStatus(s)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      newStatus === s
                        ? 'border-traffic-500 bg-traffic-500 text-white'
                        : 'border-navy-200 bg-white text-navy-600 hover:bg-navy-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label" htmlFor="note">Administrative note</label>
              <textarea id="note" rows={3} className="input resize-y" placeholder="Add an official update for the report owner…" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmStatus}
        title="Apply this status update?"
        message={`Change report ${statusModal?.id} to "${newStatus}"${note.trim() ? ' with your note' : ''}? The report owner will be notified.`}
        confirmLabel="Confirm update"
        onConfirm={applyStatus}
        onCancel={() => setConfirmStatus(false)}
      />
    </div>
  );
}
