import {
  Calendar,
  FileText,
  MapPin,
  User as UserIcon,
} from 'lucide-react';
import type { Incident } from '@/types';
import {
  categoryStyles,
  formatDateTime,
  severityStyles,
  statusStyles,
} from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui';

export function IncidentDetailModal({
  incident,
  open,
  onClose,
  footer,
}: {
  incident: Incident | null;
  open: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
}) {
  if (!incident) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Report ${incident.id}`}
      size="lg"
      footer={footer}
    >
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-navy-900">{incident.title}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className={categoryStyles[incident.category]}>
              {incident.category}
            </Badge>
            <Badge className={severityStyles[incident.severity]}>
              {incident.severity} severity
            </Badge>
            <Badge className={statusStyles[incident.status]}>
              {incident.status}
            </Badge>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3">
            <MapPin size={18} className="mt-0.5 text-navy-400" />
            <div>
              <p className="text-xs font-medium uppercase text-navy-400">
                Location
              </p>
              <p className="text-sm text-navy-800">{incident.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3">
            <Calendar size={18} className="mt-0.5 text-navy-400" />
            <div>
              <p className="text-xs font-medium uppercase text-navy-400">
                Submitted
              </p>
              <p className="text-sm text-navy-800">
                {formatDateTime(incident.submittedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3">
          <FileText size={18} className="mt-0.5 text-navy-400" />
          <div className="flex-1">
            <p className="text-xs font-medium uppercase text-navy-400">
              Description
            </p>
            <p className="text-sm leading-relaxed text-navy-800">
              {incident.description}
            </p>
          </div>
        </div>

        {incident.image && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-navy-400">
              Attached image
            </p>
            <img
              src={incident.image}
              alt={incident.title}
              className="max-h-64 w-full rounded-lg object-cover"
            />
          </div>
        )}

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-navy-400">
            Status Timeline
          </p>
          <ol className="relative ml-3 space-y-4 border-l-2 border-navy-100 pl-6">
            {incident.history.map((entry, i) => (
              <li key={i} className="relative">
                <span
                  className={`absolute -left-[31px] top-0.5 h-4 w-4 rounded-full border-2 border-white ${
                    entry.status === 'Resolved'
                      ? 'bg-emerald-500'
                      : entry.status === 'In Progress'
                      ? 'bg-blue-500'
                      : 'bg-slate-400'
                  }`}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={statusStyles[entry.status]}>
                    {entry.status}
                  </Badge>
                  <span className="text-xs text-navy-400">
                    {formatDateTime(entry.updatedAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-navy-700">{entry.note}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-navy-400">
                  <UserIcon size={12} /> {entry.updatedBy}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
}
