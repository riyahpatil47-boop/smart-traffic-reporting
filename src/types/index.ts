export type Role = 'user' | 'admin';

export type IncidentCategory =
  | 'Accident'
  | 'Traffic Congestion'
  | 'Broken Traffic Signal'
  | 'Road Damage'
  | 'Road Obstruction'
  | 'Other';

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface StatusEntry {
  status: IncidentStatus;
  note: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Incident {
  id: string;
  userId: string;
  title: string;
  category: IncidentCategory;
  description: string;
  location: string;
  severity: Severity;
  submittedAt: string;
  status: IncidentStatus;
  history: StatusEntry[];
  image?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'critical' | 'status';
  read: boolean;
  createdAt: string;
  incidentId?: string;
}

export const CATEGORIES: IncidentCategory[] = [
  'Accident',
  'Traffic Congestion',
  'Broken Traffic Signal',
  'Road Damage',
  'Road Obstruction',
  'Other',
];

export const SEVERITIES: Severity[] = ['Low', 'Medium', 'High', 'Critical'];
export const STATUSES: IncidentStatus[] = ['Pending', 'In Progress', 'Resolved'];
