import type { ReactNode } from 'react';

export function StatCard({
  label,
  value,
  icon,
  tone = 'navy',
  subtitle,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  tone?: 'navy' | 'orange' | 'amber' | 'emerald' | 'red' | 'blue';
  subtitle?: string;
}) {
  const tones: Record<string, string> = {
    navy: 'bg-navy-50 text-navy-700',
    orange: 'bg-traffic-50 text-traffic-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  return (
    <div className="card p-5 transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-navy-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-navy-900 tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-navy-400">{subtitle}</p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${tones[tone]}`}>{icon}</div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-navy-200 bg-white/50 px-6 py-14 text-center">
      <div className="mb-4 rounded-2xl bg-navy-50 p-4 text-navy-400">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-navy-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-navy-500">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-navy-500">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-navy-200 border-t-navy-600"
      style={{ width: size, height: size }}
    />
  );
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return <span className={`badge ${className}`}>{children}</span>;
}
