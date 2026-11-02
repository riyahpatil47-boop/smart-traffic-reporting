import type {
  AppNotification,
  Incident,
  User,
  IncidentStatus,
} from '@/types';

const KEYS = {
  users: 'strs_users',
  incidents: 'strs_incidents',
  notifications: 'strs_notifications',
  session: 'strs_session',
  seeded: 'strs_seeded',
} as const;

export const STORAGE_KEYS = KEYS;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getUsers: () => read<User[]>(KEYS.users, []),
  setUsers: (u: User[]) => write(KEYS.users, u),
  getIncidents: () => read<Incident[]>(KEYS.incidents, []),
  setIncidents: (i: Incident[]) => write(KEYS.incidents, i),
  getNotifications: () => read<AppNotification[]>(KEYS.notifications, []),
  setNotifications: (n: AppNotification[]) => write(KEYS.notifications, n),
  getSession: () => read<string | null>(KEYS.session, null),
  setSession: (id: string | null) => write(KEYS.session, id),
  isSeeded: () => read<boolean>(KEYS.seeded, false),
  markSeeded: () => write(KEYS.seeded, true),
};

export function generateReportId(): string {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const stamp = `${y}${String(d.getMonth() + 1).padStart(2, '0')}${String(
    d.getDate()
  ).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RPT-${stamp}-${rand}`;
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(
    36
  )}`;
}

// ---------- Seed data ----------

const ADMIN_ID = 'usr_admin_demo';
const DEMO_USER_ID = 'usr_demo_user';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.floor(Math.random() * 12) + 6, Math.floor(Math.random() * 59), 0, 0);
  return d.toISOString();
}

function makeHistory(
  start: IncidentStatus,
  final: IncidentStatus,
  submittedAt: string,
  adminName: string
) {
  const history = [
    {
      status: start,
      note: 'Report submitted by citizen.',
      updatedAt: submittedAt,
      updatedBy: 'Citizen',
    },
  ];
  if (final !== start) {
    history.push({
      status: final,
      note: 'Status updated by administrator.',
      updatedAt: new Date(
        new Date(submittedAt).getTime() + 3600_000 * 6
      ).toISOString(),
      updatedBy: adminName,
    });
  }
  return history;
}

export function seedData(): void {
  if (storage.isSeeded()) return;

  const admin: User = {
    id: ADMIN_ID,
    name: 'System Administrator',
    email: 'admin@strs.demo',
    password: 'admin123',
    role: 'admin',
    phone: '+1 (555) 010-1000',
    address: 'STRS Control Center, Civic Plaza',
    createdAt: daysAgo(60),
  };

  const demoUser: User = {
    id: DEMO_USER_ID,
    name: 'Jordan Reyes',
    email: 'user@strs.demo',
    password: 'user123',
    role: 'user',
    phone: '+1 (555) 220-4567',
    address: '204 Maple Avenue, Riverside District',
    createdAt: daysAgo(30),
  };

  const adminName = 'System Administrator';

  const incidents: Incident[] = [
    {
      id: 'RPT-241012-A3F1',
      userId: DEMO_USER_ID,
      title: 'Multi-vehicle collision on Highway 9',
      category: 'Accident',
      description:
        'Three vehicles involved in a rear-end collision near the Maple Street overpass. Right lane blocked, emergency services on scene.',
      location: 'Highway 9 — Maple Street Overpass',
      severity: 'Critical',
      submittedAt: daysAgo(1),
      status: 'In Progress',
      history: makeHistory('Pending', 'In Progress', daysAgo(1), adminName),
    },
    {
      id: 'RPT-241011-B7C2',
      userId: DEMO_USER_ID,
      title: 'Heavy congestion near Central Market',
      category: 'Traffic Congestion',
      description:
        'Standstill traffic stretching approximately 2 km from Central Market roundabout toward the riverside. No visible cause yet.',
      location: 'Central Market Roundabout',
      severity: 'Medium',
      submittedAt: daysAgo(2),
      status: 'Resolved',
      history: makeHistory('Pending', 'Resolved', daysAgo(2), adminName),
    },
    {
      id: 'RPT-241009-C2D4',
      userId: DEMO_USER_ID,
      title: 'Traffic signal not working at 5th & Pine',
      category: 'Broken Traffic Signal',
      description:
        'The traffic signal at the intersection of 5th Avenue and Pine Street is completely dark, causing confusion for drivers.',
      location: '5th Avenue & Pine Street',
      severity: 'High',
      submittedAt: daysAgo(4),
      status: 'Pending',
      history: makeHistory('Pending', 'Pending', daysAgo(4), adminName),
    },
    {
      id: 'RPT-241006-D9E5',
      userId: DEMO_USER_ID,
      title: 'Large pothole damaging vehicles',
      category: 'Road Damage',
      description:
        'A deep pothole near the school zone on Birch Lane is damaging vehicle tires. Needs urgent repair before school hours.',
      location: 'Birch Lane — Near School Zone',
      severity: 'High',
      submittedAt: daysAgo(7),
      status: 'Resolved',
      history: makeHistory('Pending', 'Resolved', daysAgo(7), adminName),
    },
    {
      id: 'RPT-241003-E1F6',
      userId: DEMO_USER_ID,
      title: 'Fallen tree blocking residential road',
      category: 'Road Obstruction',
      description:
        'A large tree branch has fallen across Oakwood Drive, blocking both lanes. Pedestrians and vehicles cannot pass.',
      location: 'Oakwood Drive',
      severity: 'Medium',
      submittedAt: daysAgo(10),
      status: 'Resolved',
      history: makeHistory('Pending', 'Resolved', daysAgo(10), adminName),
    },
  ];

  const notifications: AppNotification[] = [
    {
      id: uid('ntf'),
      userId: DEMO_USER_ID,
      title: 'Report status updated',
      message: 'Your report "Heavy congestion near Central Market" has been marked as Resolved.',
      type: 'status',
      read: false,
      createdAt: daysAgo(1),
      incidentId: 'RPT-241011-B7C2',
    },
    {
      id: uid('ntf'),
      userId: DEMO_USER_ID,
      title: 'Report under review',
      message: 'Your report "Multi-vehicle collision on Highway 9" is now In Progress.',
      type: 'status',
      read: false,
      createdAt: daysAgo(1),
      incidentId: 'RPT-241012-A3F1',
    },
    {
      id: uid('ntf'),
      userId: ADMIN_ID,
      title: 'New critical incident reported',
      message: 'A Critical severity accident was reported on Highway 9.',
      type: 'critical',
      read: false,
      createdAt: daysAgo(1),
      incidentId: 'RPT-241012-A3F1',
    },
    {
      id: uid('ntf'),
      userId: ADMIN_ID,
      title: 'New report submitted',
      message: 'A broken traffic signal was reported at 5th Avenue & Pine Street.',
      type: 'info',
      read: true,
      createdAt: daysAgo(4),
      incidentId: 'RPT-241009-C2D4',
    },
  ];

  storage.setUsers([admin, demoUser]);
  storage.setIncidents(incidents);
  storage.setNotifications(notifications);
  storage.markSeeded();
}

export function resetDemoData(): void {
  localStorage.removeItem(KEYS.users);
  localStorage.removeItem(KEYS.incidents);
  localStorage.removeItem(KEYS.notifications);
  localStorage.removeItem(KEYS.seeded);
  localStorage.removeItem(KEYS.session);
  seedData();
}
