import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';

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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Find Doctors</h1>

      <label htmlFor="specialty-filter" className="block text-sm font-medium text-slate-700 mb-1">
        Filter by specialty
      </label>
      <select
        id="specialty-filter"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
        className="mb-8 rounded border border-slate-300 px-3 py-2"
      >
        <option value="">All specialties</option>
        <option value="cardiology">Cardiology</option>
        <option value="dermatology">Dermatology</option>
        <option value="pediatrics">Pediatrics</option>
      </select>

      {status === 'loading' && <p>Loading doctors…</p>}
      {status === 'error' && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      {status === 'success' && doctors.length === 0 && <p>No doctors match that specialty.</p>}

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <li key={doctor._id} className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">{doctor.name}</h2>
            <p className="text-sm text-slate-600">{doctor.specialty}</p>
            <p className="text-sm text-slate-500">{doctor.experience}</p>
            <p className="mt-2 font-medium text-teal-700">{doctor.fee}</p>
            <Link
              to={`/doctors/${doctor._id}`}
              className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline"
            >
              View profile
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
