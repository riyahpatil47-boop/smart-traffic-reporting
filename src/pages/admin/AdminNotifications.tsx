import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Bell, CheckCheck, Info, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { PageHeader, EmptyState, Badge } from '@/components/ui';
import { timeAgo } from '@/lib/utils';

const typeIcon = {
  info: <Info size={16} className="text-blue-500" />,
  critical: <ShieldAlert size={16} className="text-red-500" />,
  status: <AlertTriangle size={16} className="text-amber-500" />,
};

export function AdminNotifications() {
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  const mine = useMemo(
    () =>
      notifications
        .filter((n) => n.userId === user?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications, user]
  );
  const shown =
    filter === 'unread'
      ? mine.filter((n) => !n.read)
      : filter === 'critical'
      ? mine.filter((n) => n.type === 'critical')
      : mine;
  const unread = mine.filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="New reports, critical incidents and platform alerts."
        action={
          unread > 0 ? (
            <button onClick={() => markAllNotificationsRead(user!.id)} className="btn-secondary">
              <CheckCheck size={16} /> Mark all read
            </button>
          ) : undefined
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'unread', 'critical'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize ${filter === f ? 'bg-navy-800 text-white' : 'bg-white text-navy-600 border border-navy-200 hover:bg-navy-50'}`}
          >
            {f === 'all' ? `All (${mine.length})` : f === 'unread' ? `Unread (${unread})` : 'Critical'}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={<Bell size={28} />}
          title="No notifications"
          message="You are all caught up. New incident reports and critical alerts will appear here."
        />
      ) : (
        <div className="card divide-y divide-slate-100">
          {shown.map((n) => (
            <div key={n.id} className={`flex items-start gap-3 px-5 py-4 transition-colors ${n.read ? 'bg-white' : 'bg-traffic-50/40'}`}>
              <div className="mt-0.5 shrink-0">{typeIcon[n.type]}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-navy-900">{n.title}</p>
                  {!n.read && <Badge className="bg-traffic-100 text-traffic-700">New</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-navy-600">{n.message}</p>
                <p className="mt-1 text-xs text-navy-400">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.read && (
                <button onClick={() => markNotificationRead(n.id)} className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-navy-500 hover:bg-navy-100">
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link to="/admin/incidents" className="text-sm font-semibold text-traffic-600 hover:text-traffic-700">
          Go to incident management →
        </Link>
      </div>
    </div>
  );
}
