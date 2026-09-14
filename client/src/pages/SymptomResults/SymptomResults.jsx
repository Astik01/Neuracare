import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { getConditionInfo, isEmergencyCase } from '../../data/conditionInfo';

const URGENCY_STYLES = {
  high: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  low: 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
};

const FALLBACK_DOCTOR_PHOTO =
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

function findRecommendedDoctor(doctors, specialtyKeywords) {
  if (!doctors.length) return null;
  const match = doctors.find((doctor) => {
    const haystack = [doctor.specialty, ...(doctor.specialties || [])]
      .filter(Boolean)
      .map((value) => value.toLowerCase());
    return specialtyKeywords.some((keyword) => haystack.some((value) => value.includes(keyword)));
  });
  if (match) return match;
  return [...doctors].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
}

export default function SymptomResults() {
  const location = useLocation();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    let cancelled = false;
    apiFetch('/doctors')
      .then((data) => {
        if (cancelled) return;
        setDoctors(data.doctors || []);
      })
      .catch(() => {
        if (cancelled) return;
        setDoctors([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const state = location.state;
  if (!state?.results) {
    return <Navigate to="/symptom-checker" replace />;
  }

  const { results, symptoms = [] } = state;
  const emergency = isEmergencyCase({ symptoms, results });
  const topResult = results[0];
  const recommendedDoctor = topResult
    ? findRecommendedDoctor(doctors, getConditionInfo(topResult.condition).specialtyKeywords)
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Symptom Checker</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">
        Your results
      </h1>

      {emergency && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/30"
        >
          <p className="font-display font-semibold text-red-800 dark:text-red-200">
            Seek emergency care right away
          </p>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            Some of the symptoms you described (like chest pain or difficulty breathing) can
            indicate a medical emergency. Please contact your local emergency services or go to
            the nearest emergency room instead of relying on this tool.
          </p>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
        This tool provides educational information and is not a medical diagnosis. Consult a
        qualified healthcare professional for medical concerns.
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold text-slate-900 dark:text-white">
        Possible matches
      </h2>
      <ul className="mt-4 space-y-4">
        {results.map((result) => {
          const conditionInfo = getConditionInfo(result.condition);
          return (
            <li
              key={result.condition}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display font-semibold capitalize text-slate-900 dark:text-white">
                  {result.condition}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {result.probability}% match
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      URGENCY_STYLES[result.urgency] || URGENCY_STYLES.low
                    }`}
                  >
                    {result.urgency} urgency
                  </span>
                </div>
              </div>

              {result.symptoms?.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {result.symptoms.map((symptom) => (
                    <li
                      key={symptom}
                      className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300"
                    >
                      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400">
                        <path
                          d="m4 10 4 4 8-8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {symptom}
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{conditionInfo.info}</p>

              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  What you can do
                </p>
                <ul className="mt-1.5 list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  {conditionInfo.steps.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>

      {recommendedDoctor && (
        <>
          <h2 className="mt-10 font-display text-lg font-semibold text-slate-900 dark:text-white">
            Recommended specialist
          </h2>
          <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center">
            <img
              src={recommendedDoctor.photo || FALLBACK_DOCTOR_PHOTO}
              alt=""
              className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display font-semibold text-slate-900 dark:text-white">
                  {recommendedDoctor.name}
                </p>
                <StarRating rating={recommendedDoctor.rating} />
              </div>
              <p className="text-sm capitalize text-brand-700 dark:text-brand-400">
                {recommendedDoctor.specialty}
              </p>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                {recommendedDoctor.experience && <span>{recommendedDoctor.experience} experience</span>}
                {recommendedDoctor.availability && <span>{recommendedDoctor.availability}</span>}
                {recommendedDoctor.fee && <span>{recommendedDoctor.fee}</span>}
              </div>
            </div>
            <div className="flex flex-shrink-0 gap-2">
              <Link
                to={`/doctors/${recommendedDoctor._id}`}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                View Profile
              </Link>
              <Link
                to={`/doctors/${recommendedDoctor._id}`}
                className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </>
      )}

      <div className="mt-10">
        <Link
          to="/symptom-checker"
          className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
        >
          ← Check different symptoms
        </Link>
      </div>
    </div>
  );
}
