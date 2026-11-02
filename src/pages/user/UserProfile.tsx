import { useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Save, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { PageHeader } from '@/components/ui';
import { ConfirmDialog } from '@/components/ui/Modal';
import { useNavigate } from 'react-router-dom';

export function UserProfile() {
  const { user, updateUser, logout } = useAuth();
  const { resetData } = useData();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const save = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    if (!name.trim()) return setError('Name cannot be empty.');
    updateUser({ name: name.trim(), phone: phone.trim(), address: address.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetData();
    setConfirmReset(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="My profile" description="Manage your personal information." />

      <div className="card mb-6 flex items-center gap-4 p-6">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-navy-800 text-xl font-bold text-white">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-bold text-navy-900">{user?.name}</p>
          <p className="text-sm text-navy-500">{user?.email}</p>
          <span className="mt-1 inline-block rounded-full bg-navy-100 px-2 py-0.5 text-xs font-semibold text-navy-600">
            Citizen account
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-200 animate-fade-in">
          <CheckCircle2 size={16} /> Profile updated successfully.
        </div>
      )}

      <form onSubmit={save} className="card space-y-5 p-6">
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input bg-slate-100" value={user?.email ?? ''} disabled />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone number</label>
          <input id="phone" className="input" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="address">Address</label>
          <input id="address" className="input" placeholder="Your street or area" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="border-t border-slate-100 pt-5">
          <button type="submit" className="btn-primary">
            <Save size={16} /> Save changes
          </button>
        </div>
      </form>

      <div className="mt-8 rounded-xl border border-red-200 bg-red-50/50 p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-red-700">
          <Trash2 size={16} /> Danger zone
        </h3>
        <p className="mt-2 text-sm text-red-600">
          Reset all demo data (users, reports, notifications) back to its original
          sample state. You will be logged out.
        </p>
        <button onClick={() => setConfirmReset(true)} className="btn-danger mt-4">
          <Trash2 size={16} /> Reset demo data
        </button>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all demo data?"
        message="This restores the original sample users, incidents and notifications, and erases any changes you made. You will be logged out."
        confirmLabel="Reset everything"
        danger
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
