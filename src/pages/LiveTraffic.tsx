import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Car,
  Info,
  MapPin,
  Navigation,
  Search,
  TrafficCone,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES, SEVERITIES, type Incident } from '@/types';
import { Badge, PageHeader, EmptyState } from '@/components/ui';
import {
  categoryStyles,
  filterIncidents,
  severityStyles,
  statusStyles,
} from '@/lib/utils';

// Pseudo-coordinates assigned to known sample locations for the demo map panel.
const LOC_COORDS: Record<string, { x: number; y: number }> = {
  'Highway 9 — Maple Street Overpass': { x: 72, y: 30 },
  'Central Market Roundabout': { x: 40, y: 55 },
  '5th Avenue & Pine Street': { x: 58, y: 42 },
  'Birch Lane — Near School Zone': { x: 25, y: 68 },
  'Oakwood Drive': { x: 80, y: 70 },
};

function coordFor(inc: Incident): { x: number; y: number } {
  if (LOC_COORDS[inc.location]) return LOC_COORDS[inc.location];
  // deterministic pseudo-location based on the id hash
  const hash = inc.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return { x: 15 + (hash % 70), y: 20 + ((hash * 7) % 60) };
}

const severityDot: Record<string, string> = {
  Low: 'bg-emerald-500',
  Medium: 'bg-amber-500',
  High: 'bg-orange-500',
  Critical: 'bg-red-500',
};

export function LiveTraffic() {
  const { incidents } = useData();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [selected, setSelected] = useState<Incident | null>(null);

  const shown = useMemo(
    () => filterIncidents(incidents, { search, category, severity }),
    [incidents, search, category, severity]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-navy-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {user && (
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
                className="rounded-lg p-2 text-navy-600 hover:bg-navy-50"
              >
                <ArrowLeft size={18} />
              </Link>
            )}
            <div className="flex items-center gap-2">
              <Navigation size={20} className="text-traffic-500" />
              <h1 className="text-lg font-bold text-navy-900">Live Traffic Monitor</h1>
            </div>
          </div>
          <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
            Demo Data — Not Live Traffic
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <PageHeader
          title="Traffic monitoring map"
          description="Explore reported incidents by location, category and severity."
        />

        {/* Filters */}
        <div className="card mb-6 p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
              <input className="input pl-9" placeholder="Search location or title…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input" value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="all">All severities</option>
              {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map panel */}
          <div className="lg:col-span-2">
            <div className="relative card overflow-hidden">
              <div
                className="relative h-[420px] w-full sm:h-[520px]"
                style={{
                  backgroundColor: '#e8eef6',
                  backgroundImage:
                    'linear-gradient(0deg, rgba(34,49,89,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,49,89,0.06) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              >
                {/* Decorative roads */}
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                  <line x1="0" y1="55%" x2="100%" y2="40%" stroke="#c5d1e6" strokeWidth="6" />
                  <line x1="20%" y1="0" x2="60%" y2="100%" stroke="#c5d1e6" strokeWidth="6" />
                  <line x1="0" y1="80%" x2="100%" y2="75%" stroke="#c5d1e6" strokeWidth="4" />
                  <circle cx="40%" cy="55%" r="14" fill="#d5ddee" />
                  <circle cx="72%" cy="30%" r="10" fill="#d5ddee" />
                </svg>

                {/* Incidents */}
                {shown.map((inc) => {
                  const { x, y } = coordFor(inc);
                  const active = selected?.id === inc.id;
                  return (
                    <button
                      key={inc.id}
                      onClick={() => setSelected(inc)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      aria-label={inc.title}
                    >
                      <span className={`relative flex h-4 w-4 ${active ? 'scale-150' : ''}`}>
                        <span className={`absolute inline-flex h-full w-full rounded-full ${severityDot[inc.severity]} opacity-60 animate-ping`} />
                        <span className={`relative inline-flex h-4 w-4 rounded-full ${severityDot[inc.severity]} border-2 border-white shadow`} />
                      </span>
                    </button>
                  );
                })}

                {shown.length === 0 && (
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <Car size={32} className="mx-auto text-navy-300" />
                      <p className="mt-2 text-sm text-navy-400">No incidents match these filters.</p>
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-3 py-2 shadow-card backdrop-blur">
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-navy-500">
                    Severity legend
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {SEVERITIES.map((s) => (
                      <div key={s} className="flex items-center gap-1.5 text-xs text-navy-600">
                        <span className={`h-2.5 w-2.5 rounded-full ${severityDot[s]}`} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-navy-400">
              <Info size={13} /> Markers are positioned on a stylized demo grid — no real-time traffic feed or mapping API is used.
            </p>
          </div>

          {/* Incident list + detail */}
          <div className="space-y-4">
            <div className="card p-4">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-navy-900">
                <TrafficCone size={16} className="text-traffic-500" /> Incidents on map
              </h2>
              {shown.length === 0 ? (
                <p className="py-6 text-center text-sm text-navy-400">No incidents.</p>
              ) : (
                <ul className="max-h-[260px] space-y-2 overflow-y-auto">
                  {shown.map((inc) => (
                    <li key={inc.id}>
                      <button
                        onClick={() => setSelected(inc)}
                        className={`w-full rounded-lg border p-3 text-left transition-colors ${selected?.id === inc.id ? 'border-navy-700 bg-navy-50' : 'border-navy-100 hover:bg-slate-50'}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-navy-900">{inc.title}</p>
                          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${severityDot[inc.severity]}`} />
                        </div>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-navy-400">
                          <MapPin size={11} /> {inc.location}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selected ? (
              <div className="card animate-fade-in p-5">
                <h3 className="text-base font-bold text-navy-900">{selected.title}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge className={categoryStyles[selected.category]}>{selected.category}</Badge>
                  <Badge className={severityStyles[selected.severity]}>{selected.severity}</Badge>
                  <Badge className={statusStyles[selected.status]}>{selected.status}</Badge>
                </div>
                <div className="mt-3 flex items-start gap-2 text-sm text-navy-600">
                  <MapPin size={15} className="mt-0.5 text-navy-400" />
                  <span>{selected.location}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-navy-700">{selected.description}</p>
                <p className="mt-3 font-mono text-xs text-navy-400">{selected.id}</p>
              </div>
            ) : (
              <EmptyState
                icon={<AlertTriangle size={24} />}
                title="Select an incident"
                message="Click a marker on the map or a list item to see full details."
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
