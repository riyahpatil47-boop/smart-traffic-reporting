import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Bell,
  ClipboardList,
  Footprints,
  MapPin,
  ShieldCheck,
  TrafficCone,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const features = [
  {
    icon: ClipboardList,
    title: 'Incident Reporting',
    desc: 'Citizens can report accidents, congestion, broken signals, road damage and obstructions in seconds with photos and severity levels.',
  },
  {
    icon: TrendingUp,
    title: 'Incident Tracking',
    desc: 'Every report gets a unique ID and a live status timeline, so reporters always know where their submission stands.',
  },
  {
    icon: BarChart3,
    title: 'Traffic Monitoring',
    desc: 'Administrators monitor all reported incidents on a unified map panel with category and severity breakdowns.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Report an incident',
    desc: 'Choose a category, describe what you see, drop a location and set the severity.',
  },
  {
    n: '02',
    title: 'Administrators triage',
    desc: 'The operations team reviews submissions, updates status and adds official notes.',
  },
  {
    n: '03',
    title: 'Track resolution',
    desc: 'Follow the status timeline from Pending to In Progress to Resolved in real time.',
  },
];

const stats = [
  { label: 'Incidents reported', value: '12,480+' },
  { label: 'Avg. response time', value: '18 min' },
  { label: 'Resolution rate', value: '94%' },
  { label: 'Active citizens', value: '3,200' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-navy-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm font-medium text-navy-600 hover:text-navy-900">
              Features
            </a>
            <a href="#how" className="text-sm font-medium text-navy-600 hover:text-navy-900">
              How it works
            </a>
            <a href="#about" className="text-sm font-medium text-navy-600 hover:text-navy-900">
              About
            </a>
            <a href="#contact" className="text-sm font-medium text-navy-600 hover:text-navy-900">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost">
              Log in
            </Link>
            <Link to="/signup" className="btn-accent">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #fb6511 0, transparent 40%), radial-gradient(circle at 80% 0%, #3b528f 0, transparent 45%)' }} />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col justify-center">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-navy-700 bg-navy-800/60 px-3 py-1 text-xs font-medium text-navy-200">
              <TrafficCone size={14} className="text-traffic-400" />
              Civic Traffic Management Platform
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Smarter Roads.
              <br />
              <span className="text-traffic-400">Safer Journeys.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-navy-200">
              The Smart Traffic Reporting System lets citizens report traffic
              incidents instantly and empowers administrators to monitor, triage
              and resolve them — all from one clean dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="btn-accent px-5 py-3 text-base">
                Get started free
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="btn px-5 py-3 text-base border border-navy-600 text-white hover:bg-navy-800"
              >
                Demo login
              </Link>
            </div>
            <p className="mt-4 text-xs text-navy-400">
              Demo accounts available on the login page — no signup required to explore.
            </p>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 border border-navy-700/50" />
            <div className="relative grid h-full grid-cols-2 gap-4 p-6">
              <div className="rounded-2xl bg-white/5 p-5 backdrop-blur border border-white/10">
                <TrafficCone className="text-traffic-400" size={28} />
                <p className="mt-4 text-3xl font-bold">12,480</p>
                <p className="text-sm text-navy-300">Incidents reported</p>
              </div>
              <div className="mt-8 rounded-2xl bg-white/5 p-5 backdrop-blur border border-white/10">
                <ShieldCheck className="text-emerald-400" size={28} />
                <p className="mt-4 text-3xl font-bold">94%</p>
                <p className="text-sm text-navy-300">Resolution rate</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-5 backdrop-blur border border-white/10">
                <Bell className="text-amber-400" size={28} />
                <p className="mt-4 text-3xl font-bold">18m</p>
                <p className="text-sm text-navy-300">Avg. response</p>
              </div>
              <div className="mt-8 rounded-2xl bg-white/5 p-5 backdrop-blur border border-white/10">
                <Users className="text-blue-400" size={28} />
                <p className="mt-4 text-3xl font-bold">3,200</p>
                <p className="text-sm text-navy-300">Active citizens</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-traffic-600">
            What it does
          </p>
          <h2 className="mt-2 text-3xl font-bold text-navy-900 sm:text-4xl">
            Everything a city needs to manage traffic incidents
          </h2>
          <p className="mt-4 text-navy-500">
            From the moment a citizen spots an issue to the moment it is resolved,
            STRS keeps everyone informed and aligned.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="card p-6 transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="rounded-xl bg-navy-50 p-3 text-navy-700 w-fit">
                <f.icon size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-extrabold text-navy-900">{s.value}</p>
                <p className="mt-1 text-sm text-navy-500">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-navy-400">
            Demonstration data shown for illustration purposes only.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-traffic-600">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-bold text-navy-900 sm:text-4xl">
            From report to resolution in three steps
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <span className="text-5xl font-extrabold text-navy-100">
                {s.n}
              </span>
              <h3 className="mt-2 text-lg font-bold text-navy-900">{s.title}</h3>
              <p className="mt-2 text-sm text-navy-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to make your roads safer?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-navy-200">
            Create a citizen account in seconds, or jump straight in with a demo
            login to explore the full platform.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/signup" className="btn-accent px-5 py-3 text-base">
              Create an account
            </Link>
            <Link
              to="/login"
              className="btn px-5 py-3 text-base border border-navy-600 text-white hover:bg-navy-800"
            >
              Try the demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-white border-t border-navy-100">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-1">
              <Logo />
              <p className="mt-4 max-w-xs text-sm text-navy-500">
                A civic-tech platform for reporting and managing traffic
                incidents. Built as a college engineering demonstration project.
              </p>
            </div>
            <div id="contact">
              <h4 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                About
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-navy-500">
                <li><a href="#features" className="hover:text-navy-900">Features</a></li>
                <li><a href="#how" className="hover:text-navy-900">How it works</a></li>
                <li><a href="/" className="hover:text-navy-900">Project goals</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                Features
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-navy-500">
                <li>Incident reporting</li>
                <li>Status tracking</li>
                <li>Admin operations console</li>
                <li>Traffic monitoring map</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                Contact
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-navy-500">
                <li className="flex items-center gap-2">
                  <MapPin size={14} /> STRS Control Center, Civic Plaza
                </li>
                <li className="flex items-center gap-2">
                  <Footprints size={14} /> support@strs.demo
                </li>
                <li className="flex items-center gap-2">
                  <Bell size={14} /> +1 (555) 010-1000
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-navy-100 pt-6 text-xs text-navy-400 sm:flex-row">
            <p>© {new Date().getFullYear()} Smart Traffic Reporting System. Demonstration project.</p>
            <p>Not affiliated with any government agency. Demo data only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
