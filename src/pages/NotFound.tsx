import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <Logo size="lg" />
      <div className="mt-10 grid h-20 w-20 place-items-center rounded-2xl bg-navy-50 text-navy-400">
        <Compass size={36} />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold text-navy-900">Page not found</h1>
      <p className="mt-2 max-w-md text-navy-500">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        <Home size={16} /> Back to home
      </Link>
    </div>
  );
}
