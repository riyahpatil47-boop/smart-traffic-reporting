import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Logo } from '@/components/ui/Logo';

const navItems = [
  { to: '/user/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/user/report', label: 'Report Incident', icon: PlusCircle },
  { to: '/user/reports', label: 'My Reports', icon: ClipboardList },
  { to: '/user/notifications', label: 'Notifications', icon: Bell },
  { to: '/user/profile', label: 'Profile', icon: UserIcon },
];

export function UserLayout() {
  const { user, logout } = useAuth();
  const { notifications } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const unread = notifications.filter(
    (n) => n.userId === user?.id && !n.read
  ).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-navy-100 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-navy-100 px-5">
          <Logo size="sm" />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-navy-800 text-white'
                    : 'text-navy-600 hover:bg-navy-50'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.label === 'Notifications' && unread > 0 && (
                <span className="ml-auto rounded-full bg-traffic-500 px-2 py-0.5 text-xs font-bold text-white">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-navy-100 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white animate-slide-in">
            <div className="flex h-16 items-center justify-between border-b border-navy-100 px-5">
              <Logo size="sm" />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-navy-800 text-white'
                        : 'text-navy-600 hover:bg-navy-50'
                    }`
                  }
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {item.label === 'Notifications' && unread > 0 && (
                    <span className="ml-auto rounded-full bg-traffic-500 px-2 py-0.5 text-xs font-bold text-white">
                      {unread}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-navy-100 p-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-navy-100 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-navy-600 hover:bg-navy-50 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <p className="text-sm text-navy-500">Citizen Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/user/notifications"
              className="relative rounded-lg p-2 text-navy-600 hover:bg-navy-50"
            >
              <Bell size={20} />
              {unread > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-traffic-500" />
              )}
            </Link>
            <div className="flex items-center gap-2 rounded-lg border border-navy-100 px-3 py-1.5">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-navy-100 text-sm font-bold text-navy-700">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-navy-800 leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-navy-400">Citizen</p>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const { user, logout } = useAuth();
  const { notifications } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const unread = notifications.filter(
    (n) => n.userId === user?.id && !n.read
  ).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/incidents', label: 'Incident Management', icon: ClipboardList },
    { to: '/admin/analytics', label: 'Analytics', icon: ClipboardList },
    { to: '/admin/notifications', label: 'Notifications', icon: Bell },
    { to: '/admin/profile', label: 'Profile', icon: UserIcon },
  ];

  const SidebarContent: ReactNode = (
    <>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-traffic-500 text-white'
                  : 'text-navy-600 hover:bg-navy-50'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
            {item.label === 'Notifications' && unread > 0 && (
              <span className="ml-auto rounded-full bg-traffic-500 px-2 py-0.5 text-xs font-bold text-white">
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-navy-100 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-navy-100 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-navy-100 px-5">
          <Logo size="sm" />
        </div>
        {SidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white animate-slide-in">
            <div className="flex h-16 items-center justify-between border-b border-navy-100 px-5">
              <Logo size="sm" />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50"
              >
                <X size={18} />
              </button>
            </div>
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-navy-100 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-navy-600 hover:bg-navy-50 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-traffic-50 px-2 py-1 text-xs font-bold uppercase tracking-wider text-traffic-600">
                Admin
              </span>
              <p className="hidden text-sm text-navy-500 sm:block">
                Operations Console
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/notifications"
              className="relative rounded-lg p-2 text-navy-600 hover:bg-navy-50"
            >
              <Bell size={20} />
              {unread > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-traffic-500" />
              )}
            </Link>
            <div className="flex items-center gap-2 rounded-lg border border-navy-100 px-3 py-1.5">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-navy-800 text-sm font-bold text-white">
                A
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-navy-800 leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-navy-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
