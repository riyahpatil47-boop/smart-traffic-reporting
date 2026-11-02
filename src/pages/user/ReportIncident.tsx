import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  ImageIcon,
  MapPin,
  Send,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { CATEGORIES, SEVERITIES, type IncidentCategory, type Severity } from '@/types';
import { PageHeader } from '@/components/ui';
import { ConfirmDialog } from '@/components/ui/Modal';
import { severityStyles } from '@/lib/utils';
import { Badge } from '@/components/ui';

export function ReportIncident() {
  const { user } = useAuth();
  const { createIncident } = useData();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentCategory | ''>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<Severity | ''>('');
  const [datetime, setDatetime] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const handleImage = (file?: File) => {
    if (!file) return;
    if (file.size > 2_000_000) {
      setError('Image must be under 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setLocation('');
    setSeverity('');
    setDatetime('');
    setImage(undefined);
    setError('');
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title.trim()) return setError('Please give your report a title.');
    if (!category) return setError('Please choose a category.');
    if (!description.trim() || description.trim().length < 10)
      return setError('Please describe the incident in at least 10 characters.');
    if (!location.trim()) return setError('Please enter a location or road name.');
    if (!severity) return setError('Please select a severity level.');
    if (!datetime) return setError('Please choose a date and time.');

    const incident = createIncident({
      title: title.trim(),
      category: category as IncidentCategory,
      description: description.trim(),
      location: location.trim(),
      severity: severity as Severity,
      submittedAt: new Date(datetime).toISOString(),
      image,
    });

    setSuccess(`Report ${incident.id} submitted successfully.`);
    reset();
    setTimeout(() => navigate('/user/reports'), 1400);
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Report an incident"
        description="Tell us what you saw. Your report helps keep the roads safe for everyone."
      />

      {success && (
        <div className="mb-5 flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200 animate-fade-in">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}
      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={submit} className="card space-y-5 p-6">
        <div>
          <label className="label" htmlFor="title">Incident title</label>
          <input id="title" className="input" placeholder="e.g. Collision on Highway 9" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="category">Category</label>
            <select id="category" className="input" value={category} onChange={(e) => setCategory(e.target.value as IncidentCategory)}>
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="severity">Severity</label>
            <div className="flex flex-wrap gap-2">
              {SEVERITIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    severity === s
                      ? 'border-navy-700 bg-navy-800 text-white'
                      : 'border-navy-200 bg-white text-navy-600 hover:bg-navy-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="description">Detailed description</label>
          <textarea
            id="description"
            rows={4}
            className="input resize-y"
            placeholder="Describe what happened, vehicles involved, lane blockages, hazards…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="mt-1 text-xs text-navy-400">{description.length} characters</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="location">Location or road name</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
              <input id="location" className="input pl-9" placeholder="e.g. 5th Avenue & Pine Street" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="datetime">Date and time</label>
            <input id="datetime" type="datetime-local" className="input" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Optional image</label>
          {image ? (
            <div className="relative inline-block">
              <img src={image} alt="Preview" className="max-h-48 rounded-lg border border-navy-200" />
              <button
                type="button"
                onClick={() => setImage(undefined)}
                className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1.5 text-white shadow-md hover:bg-red-700"
                aria-label="Remove image"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-navy-200 bg-slate-50 px-6 py-8 text-center transition-colors hover:border-navy-300 hover:bg-navy-50">
              <Camera size={24} className="text-navy-400" />
              <p className="mt-2 text-sm font-medium text-navy-600">
                Click to upload an image
              </p>
              <p className="mt-1 text-xs text-navy-400">PNG or JPG, up to 2 MB</p>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => handleImage(e.target.files?.[0])}
              />
            </label>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <button type="button" onClick={() => setConfirmClear(true)} className="btn-ghost text-red-600 hover:bg-red-50">
            <Trash2 size={16} /> Clear form
          </button>
          <button type="submit" className="btn-accent px-6 py-3">
            <Send size={16} /> Submit report
          </button>
        </div>
      </form>

      <p className="mt-4 text-xs text-navy-400">
        Reports are submitted as {user?.name}. A unique report ID is generated automatically.
      </p>

      <ConfirmDialog
        open={confirmClear}
        title="Clear the form?"
        message="This will remove everything you have entered so far. This cannot be undone."
        confirmLabel="Clear form"
        danger
        onConfirm={() => {
          reset();
          setConfirmClear(false);
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}
