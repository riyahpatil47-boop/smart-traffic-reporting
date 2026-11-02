import type { Incident, IncidentCategory, IncidentStatus, Severity } from '@/types';

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export const severityStyles: Record<Severity, string> = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
};

export const statusStyles: Record<IncidentStatus, string> = {
  Pending: 'bg-slate-200 text-slate-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
};

export const categoryStyles: Record<IncidentCategory, string> = {
  Accident: 'bg-red-50 text-red-700 border border-red-200',
  'Traffic Congestion': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Broken Traffic Signal': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Road Damage': 'bg-orange-50 text-orange-700 border border-orange-200',
  'Road Obstruction': 'bg-purple-50 text-purple-700 border border-purple-200',
  Other: 'bg-slate-100 text-slate-700 border border-slate-200',
};

export function severityRank(s: Severity): number {
  return { Low: 0, Medium: 1, High: 2, Critical: 3 }[s];
}

export function filterIncidents(
  incidents: Incident[],
  opts: {
    search?: string;
    category?: string;
    severity?: string;
    status?: string;
    userId?: string;
  }
): Incident[] {
  const q = opts.search?.trim().toLowerCase();
  return incidents.filter((inc) => {
    if (opts.userId && inc.userId !== opts.userId) return false;
    if (opts.category && opts.category !== 'all' && inc.category !== opts.category)
      return false;
    if (opts.severity && opts.severity !== 'all' && inc.severity !== opts.severity)
      return false;
    if (opts.status && opts.status !== 'all' && inc.status !== opts.status)
      return false;
    if (q) {
      const hay = `${inc.title} ${inc.location} ${inc.id}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sortIncidents(
  incidents: Incident[],
  by: 'date' | 'severity'
): Incident[] {
  return [...incidents].sort((a, b) => {
    if (by === 'severity') {
      return severityRank(b.severity) - severityRank(a.severity);
    }
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });
}
