import type { Incident, IncidentCategory, Severity } from '@/types';

export function countBy<T extends string>(
  items: { key: T }[],
  keys: readonly T[]
): Record<T, number> {
  const acc = {} as Record<T, number>;
  keys.forEach((k) => (acc[k] = 0));
  items.forEach((i) => (acc[i.key] += 1));
  return acc;
}

const severityColors: Record<Severity, string> = {
  Low: '#22c55e',
  Medium: '#eab308',
  High: '#f97316',
  Critical: '#ef4444',
};

const categoryColors: Record<IncidentCategory, string> = {
  Accident: '#ef4444',
  'Traffic Congestion': '#f59e0b',
  'Broken Traffic Signal': '#3b82f6',
  'Road Damage': '#f97316',
  'Road Obstruction': '#a855f7',
  Other: '#64748b',
};

export function DonutChart({
  data,
  colors,
  size = 160,
}: {
  data: { label: string; value: number }[];
  colors: string[];
  size?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <svg width={size} height={size} className="shrink-0">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#eef2f8" strokeWidth={16} />
        {total > 0 &&
          data.map((d, i) => {
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const seg = (
              <circle
                key={d.label}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth={16}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            );
            offset += dash;
            return seg;
          })}
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-navy-900 font-bold" style={{ fontSize: 24 }}>
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="fill-navy-400" style={{ fontSize: 11 }}>
          Total
        </text>
      </svg>
      <ul className="space-y-1.5">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-navy-600">{d.label}</span>
            <span className="ml-auto font-semibold text-navy-900">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarChart({
  data,
  colors,
}: {
  data: { label: string; value: number }[];
  colors: string[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-navy-600">{d.label}</span>
            <span className="font-semibold text-navy-900">{d.value}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(d.value / max) * 100}%`,
                backgroundColor: colors[i % colors.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoryBreakdown({ incidents }: { incidents: Incident[] }) {
  const cats = Object.keys(categoryColors) as IncidentCategory[];
  const counts = countBy(
    incidents.map((i) => ({ key: i.category })),
    cats
  );
  const data = cats.map((c) => ({ label: c, value: counts[c] }));
  return (
    <BarChart
      data={data}
      colors={cats.map((c) => categoryColors[c])}
    />
  );
}

export function SeverityBreakdown({ incidents }: { incidents: Incident[] }) {
  const sevs = Object.keys(severityColors) as Severity[];
  const counts = countBy(
    incidents.map((i) => ({ key: i.severity })),
    sevs
  );
  const data = sevs.map((s) => ({ label: s, value: counts[s] }));
  return (
    <DonutChart
      data={data}
      colors={sevs.map((s) => severityColors[s])}
    />
  );
}
