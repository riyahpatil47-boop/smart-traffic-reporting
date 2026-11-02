import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AppNotification,
  Incident,
  IncidentStatus,
  Severity,
} from '@/types';
import {
  generateReportId,
  resetDemoData,
  seedData,
  storage,
  uid,
} from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';

interface DataContextValue {
  incidents: Incident[];
  notifications: AppNotification[];
  createIncident: (input: Omit<Incident, 'id' | 'userId' | 'status' | 'history'> & { submittedAt?: string }) => Incident;
  updateIncidentStatus: (
    id: string,
    status: IncidentStatus,
    note: string,
    adminName: string
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const refresh = useCallback(() => {
    setIncidents(storage.getIncidents());
    setNotifications(storage.getNotifications());
  }, []);

  useMemo(() => {
    seedData();
    refresh();
  }, [refresh]);

  const createIncident: DataContextValue['createIncident'] = useCallback(
    (input) => {
      const now = new Date().toISOString();
      const incident: Incident = {
        ...input,
        id: generateReportId(),
        userId: user?.id ?? 'anonymous',
        submittedAt: input.submittedAt ?? now,
        status: 'Pending',
        history: [
          {
            status: 'Pending',
            note: 'Report submitted by citizen.',
            updatedAt: now,
            updatedBy: user?.name ?? 'Citizen',
          },
        ],
      };
      const all = [incident, ...storage.getIncidents()];
      storage.setIncidents(all);
      setIncidents(all);

      const adminNtf: AppNotification = {
        id: uid('ntf'),
        userId: 'usr_admin_demo',
        title:
          incident.severity === 'Critical'
            ? 'New critical incident reported'
            : 'New report submitted',
        message: `"${incident.title}" was reported at ${incident.location}.`,
        type: incident.severity === 'Critical' ? 'critical' : 'info',
        read: false,
        createdAt: now,
        incidentId: incident.id,
      };
      const ntfs = [adminNtf, ...storage.getNotifications()];
      storage.setNotifications(ntfs);
      setNotifications(ntfs);

      return incident;
    },
    [user]
  );

  const updateIncidentStatus: DataContextValue['updateIncidentStatus'] =
    useCallback(
      (id, status, note, adminName) => {
        const all = storage.getIncidents().map((inc) => {
          if (inc.id !== id) return inc;
          const entry = {
            status,
            note: note || `Status changed to ${status}.`,
            updatedAt: new Date().toISOString(),
            updatedBy: adminName,
          };
          return { ...inc, status, history: [...inc.history, entry] };
        });
        storage.setIncidents(all);
        setIncidents(all);

        const target = all.find((i) => i.id === id);
        if (target) {
          const userNtf: AppNotification = {
            id: uid('ntf'),
            userId: target.userId,
            title: 'Report status updated',
            message: `Your report "${target.title}" is now ${status}.`,
            type: 'status',
            read: false,
            createdAt: new Date().toISOString(),
            incidentId: target.id,
          };
          const ntfs = [userNtf, ...storage.getNotifications()];
          storage.setNotifications(ntfs);
          setNotifications(ntfs);
        }
      },
      []
    );

  const markNotificationRead = useCallback((id: string) => {
    const ntfs = storage
      .getNotifications()
      .map((n) => (n.id === id ? { ...n, read: true } : n));
    storage.setNotifications(ntfs);
    setNotifications(ntfs);
  }, []);

  const markAllNotificationsRead = useCallback((userId: string) => {
    const ntfs = storage
      .getNotifications()
      .map((n) => (n.userId === userId ? { ...n, read: true } : n));
    storage.setNotifications(ntfs);
    setNotifications(ntfs);
  }, []);

  const resetData = useCallback(() => {
    resetDemoData();
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      incidents,
      notifications,
      createIncident,
      updateIncidentStatus,
      markNotificationRead,
      markAllNotificationsRead,
      resetData,
    }),
    [
      incidents,
      notifications,
      createIncident,
      updateIncidentStatus,
      markNotificationRead,
      markAllNotificationsRead,
      resetData,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
