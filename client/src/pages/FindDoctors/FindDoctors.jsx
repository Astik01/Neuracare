import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';

const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop';

function StarRating({ rating = 0 }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-amber-500" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="m10 1.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L10 1.5Z" />
      </svg>
      <span className="font-medium text-slate-700 dark:text-slate-200">{rating || '—'}</span>
    </span>
  );
}

export default function FindDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialty, setSpecialty] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);

    const query = specialty ? `?specialty=${encodeURIComponent(specialty)}` : '';
    apiFetch(`/doctors${query}`)
      .then((data) => {
        if (cancelled) return;
        setDoctors(data.doctors || []);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [specialty]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Find Doctors</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-slate-900 dark:text-white">
          Find the right specialist for you
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Filter by specialty to compare experience, fees, and availability.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <div>
          <label
            htmlFor="specialty-filter"
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Filter by specialty
          </label>
          <select
            id="specialty-filter"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="">All specialties</option>
            <option value="cardiology">Cardiology</option>
            <option value="dermatology">Dermatology</option>
            <option value="pediatrics">Pediatrics</option>
          </select>
        </div>
        {status === 'success' && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {doctors.length} doctor{doctors.length === 1 ? '' : 's'} found
          </p>
        )}
      </div>

      <div className="mt-8">
        {status === 'loading' && <p className="text-slate-600 dark:text-slate-300">Loading doctors…</p>}
        {status === 'error' && (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        )}
        {status === 'success' && doctors.length === 0 && (
          <p className="text-slate-600 dark:text-slate-300">No doctors match that specialty.</p>
        )}

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <li
              key={doctor._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-700 dark:bg-slate-800"
            >
              <img
                src={doctor.photo || FALLBACK_PHOTO}
                alt=""
                className="h-40 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                    {doctor.name}
                  </h2>
                  <StarRating rating={doctor.rating} />
                </div>
                <p className="text-sm capitalize text-brand-700 dark:text-brand-400">
                  {doctor.specialty}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{doctor.experience}</p>
                {doctor.availability && (
                  <span className="mt-3 inline-flex w-fit items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                    {doctor.availability}
                  </span>
                )}
                <div className="mt-4 flex flex-1 items-end justify-between">
                  <p className="font-display font-semibold text-slate-900 dark:text-white">
                    {doctor.fee}
                  </p>
                  <Link
                    to={`/doctors/${doctor._id}`}
                    className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
                  >
                    View profile →
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
