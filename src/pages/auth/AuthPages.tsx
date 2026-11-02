import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  Lock,
  Mail,
  ShieldCheck,
  TrafficCone,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-900 p-10 text-white lg:flex">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, #fb6511 0, transparent 40%), radial-gradient(circle at 70% 80%, #3b528f 0, transparent 45%)' }} />
        <div className="relative">
          <Logo light />
        </div>
        <div className="relative">
          <TrafficCone size={40} className="text-traffic-400" />
          <h2 className="mt-6 text-3xl font-bold leading-tight">
            Smarter Roads.
            <br />
            Safer Journeys.
          </h2>
          <p className="mt-4 max-w-md text-navy-200">
            Report traffic incidents, track their resolution, and help your city
            move more safely. The Smart Traffic Reporting System connects
            citizens and administrators on one platform.
          </p>
          <div className="mt-8 flex gap-6">
            <div>
              <p className="text-2xl font-bold">12,480+</p>
              <p className="text-sm text-navy-300">Incidents reported</p>
            </div>
            <div>
              <p className="text-2xl font-bold">94%</p>
              <p className="text-sm text-navy-300">Resolution rate</p>
            </div>
          </div>
        </div>
        <p className="relative text-xs text-navy-400">
          Demonstration project — demo data only.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col justify-center bg-slate-50 px-4 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
          <p className="mt-2 text-sm text-navy-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }
    setSubmitting(true);
    const res = login(email, password);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? 'Login failed.');
      return;
    }
    navigate(email.trim().toLowerCase() === 'admin@strs.demo' ? '/admin/dashboard' : '/user/dashboard');
  };

  const demoLogin = (role: 'user' | 'admin') => {
    setError('');
    const creds =
      role === 'admin'
        ? { email: 'admin@strs.demo', password: 'admin123' }
        : { email: 'user@strs.demo', password: 'user123' };
    const res = login(creds.email, creds.password);
    if (res.ok) {
      navigate(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } else {
      setError(res.error ?? 'Demo login failed.');
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your STRS account to report or manage traffic incidents."
    >
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div>
          <label className="label" htmlFor="email">Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
            <input
              id="email"
              type="email"
              className="input pl-9"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
            <input
              id="password"
              type={showPw ? 'text' : 'password'}
              className="input pl-9 pr-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-navy-400 hover:bg-navy-50"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
          Sign in
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="mt-6 rounded-xl border border-navy-100 bg-white p-4">
        <div className="flex items-center gap-2 text-navy-700">
          <Info size={16} className="text-traffic-500" />
          <p className="text-sm font-semibold">Demo accounts</p>
        </div>
        <p className="mt-1 text-xs text-navy-500">
          Skip signup and explore the platform instantly with a pre-configured role.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button onClick={() => demoLogin('user')} className="btn-secondary w-full justify-start">
            <UserIcon size={15} /> Citizen demo
          </button>
          <button onClick={() => demoLogin('admin')} className="btn-secondary w-full justify-start">
            <ShieldCheck size={15} /> Admin demo
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-navy-500">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-traffic-600 hover:text-traffic-700">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const strength = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'][strength];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Please enter your full name.');
    if (!email.trim()) return setError('Please enter your email.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setError('Please enter a valid email address.');
    if (password.length < 8)
      return setError('Password must be at least 8 characters.');
    if (password !== confirm)
      return setError('Passwords do not match.');
    setSubmitting(true);
    const res = signup(name, email, password);
    setSubmitting(false);
    if (!res.ok) return setError(res.error ?? 'Sign up failed.');
    navigate('/user/dashboard');
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join STRS as a citizen to report traffic incidents in your area."
    >
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <div className="relative">
            <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
            <input id="name" className="input pl-9" placeholder="Jordan Reyes" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
            <input id="email" type="email" className="input pl-9" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
            <input id="password" type={showPw ? 'text' : 'password'} className="input pl-9 pr-10" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-navy-400 hover:bg-navy-50" aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-100">
                <div className="h-full rounded-full transition-all" style={{ width: `${(strength / 4) * 100}%`, backgroundColor: strengthColor }} />
              </div>
              <span className="text-xs font-medium" style={{ color: strengthColor }}>{strengthLabel}</span>
            </div>
          )}
        </div>
        <div>
          <label className="label" htmlFor="confirm">Confirm password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
            <input id="confirm" type={showPw ? 'text' : 'password'} className="input pl-9" placeholder="Re-enter your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
        </div>
        <button type="submit" disabled={submitting} className="btn-accent w-full py-3">
          Create account
          <ArrowRight size={16} />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-traffic-600 hover:text-traffic-700">
          Sign in
        </Link>
      </p>
      <p className="mt-4 rounded-lg bg-navy-50 p-3 text-center text-xs text-navy-400">
        Citizen accounts only. Administrator access is pre-configured for demo purposes.
      </p>
    </AuthShell>
  );
}
