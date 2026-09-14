import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import ErrorState from '../../components/ErrorState';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import {
  EXPERIENCE_RANGES,
  FEE_RANGES,
  SORT_OPTIONS,
  filterDoctors,
  sortDoctors,
} from '../../utils/doctorFilters';

const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop';

const EMPTY_FILTERS = { search: '', specialty: '', availability: '', experience: '', fee: '' };

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

function DoctorCardSkeleton() {
  return (
    <li className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-800">
      <div className="h-40 w-full bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 flex items-center justify-between">
          <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </li>
  );
}

function FilterFields({ filters, onChange, specialtyOptions, availabilityOptions, idPrefix }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor={`${idPrefix}specialty-filter`} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Specialty
        </label>
        <select
          id={`${idPrefix}specialty-filter`}
          value={filters.specialty}
          onChange={(e) => onChange({ ...filters, specialty: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="">All specialties</option>
          {specialtyOptions.map((specialty) => (
            <option key={specialty} value={specialty} className="capitalize">
              {specialty}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}availability-filter`} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Availability
        </label>
        <select
          id={`${idPrefix}availability-filter`}
          value={filters.availability}
          onChange={(e) => onChange({ ...filters, availability: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="">Any availability</option>
          {availabilityOptions.map((availability) => (
            <option key={availability} value={availability}>
              {availability}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}experience-filter`} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Experience
        </label>
        <select
          id={`${idPrefix}experience-filter`}
          value={filters.experience}
          onChange={(e) => onChange({ ...filters, experience: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="">Any experience</option>
          {EXPERIENCE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}fee-filter`} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Consultation fee
        </label>
        <select
          id={`${idPrefix}fee-filter`}
          value={filters.fee}
          onChange={(e) => onChange({ ...filters, fee: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="">Any fee</option>
          {FEE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function FindDoctors() {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
    specialty: searchParams.get('specialty') || '',
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEscapeKey(isFilterDrawerOpen, () => setIsFilterDrawerOpen(false));

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);
    apiFetch('/doctors')
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
  }, [retryCount]);

  function loadDoctors() {
    setRetryCount((count) => count + 1);
  }

  const specialtyOptions = useMemo(
    () => [...new Set(doctors.map((d) => d.specialty).filter(Boolean))].sort(),
    [doctors],
  );
  const availabilityOptions = useMemo(
    () => [...new Set(doctors.map((d) => d.availability).filter(Boolean))].sort(),
    [doctors],
  );

  const visibleDoctors = useMemo(
    () => sortDoctors(filterDoctors(doctors, filters), sortBy),
    [doctors, filters, sortBy],
  );

  const activeFilterCount = Object.values(filters).filter(Boolean).length - (filters.search ? 1 : 0);

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Find Doctors</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-slate-900 dark:text-white">
          Find the right specialist for you
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Search, filter, and compare experience, fees, and availability.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="doctor-search" className="sr-only">
              Search by name, specialty, or keyword
            </label>
            <input
              id="doctor-search"
              type="search"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by name, specialty, or keyword"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <div className="flex gap-3">
            <label htmlFor="sort-by" className="sr-only">
              Sort by
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="relative flex-shrink-0 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 lg:hidden"
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 hidden lg:block">
          <FilterFields
            filters={filters}
            onChange={setFilters}
            specialtyOptions={specialtyOptions}
            availabilityOptions={availabilityOptions}
            idPrefix=""
          />
        </div>
      </div>

      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setIsFilterDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter doctors"
            className="relative z-10 max-h-[85vh] w-full animate-fade-up overflow-y-auto rounded-t-2xl bg-white p-5 shadow-glow dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Filters
              </h2>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                aria-label="Close filters"
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <FilterFields
                filters={filters}
                onChange={setFilters}
                specialtyOptions={specialtyOptions}
                availabilityOptions={availabilityOptions}
                idPrefix="mobile-"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              >
                Clear Filters
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-medium text-white shadow-soft hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        {status === 'loading' && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <DoctorCardSkeleton key={index} />
            ))}
          </ul>
        )}

        {status === 'error' && (
          <ErrorState
            message={error || "Something went wrong. We couldn't load this information right now."}
            onRetry={loadDoctors}
          />
        )}

        {status === 'success' && (
          <>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              {visibleDoctors.length} doctor{visibleDoctors.length === 1 ? '' : 's'} found
            </p>

            {visibleDoctors.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
                <p className="text-slate-600 dark:text-slate-300">
                  No doctors match your current filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full bg-brand-700 px-5 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleDoctors.map((doctor) => (
                  <li
                    key={doctor._id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-700 dark:bg-slate-800"
                  >
                    <img
                      src={doctor.photo || FALLBACK_PHOTO}
                      alt={doctor.name}
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
                      <div className="mt-4 flex flex-1 flex-wrap items-end justify-between gap-x-2 gap-y-3">
                        <p className="font-display font-semibold text-slate-900 dark:text-white">
                          {doctor.fee}
                        </p>
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/doctors/${doctor._id}`}
                            className="whitespace-nowrap text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
                          >
                            View Profile
                          </Link>
                          <Link
                            to={`/doctors/${doctor._id}`}
                            className="whitespace-nowrap rounded-lg bg-brand-700 px-3 py-1.5 text-sm font-medium text-white shadow-soft transition hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500"
                          >
                            Book Appointment
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
