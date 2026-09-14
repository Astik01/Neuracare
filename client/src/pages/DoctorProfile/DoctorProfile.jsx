import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import ErrorState from '../../components/ErrorState';
import SlotPicker from '../../components/SlotPicker';
import { formatDisplayDate } from '../../utils/scheduling';

const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop';

const CONSULTATION_TYPES = [
  { value: 'in-person', label: 'In-person visit' },
  { value: 'video', label: 'Video call' },
];

function StarRating({ rating = 0 }) {
  return (
    <span className="inline-flex items-center gap-1 text-amber-500" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="m10 1.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L10 1.5Z" />
      </svg>
      <span className="font-medium text-slate-700 dark:text-slate-200">{rating || '—'}</span>
    </span>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="h-32 w-32 flex-shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1 space-y-3">
          <div className="h-6 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
      <div className="mt-8 h-24 rounded-2xl bg-slate-200 dark:bg-slate-700" />
      <div className="mt-6 h-48 rounded-2xl bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export default function DoctorProfile() {
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [consultationType, setConsultationType] = useState('in-person');
  const [bookingError, setBookingError] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);
    apiFetch(`/doctors/${id}`)
      .then((data) => {
        if (cancelled) return;
        setDoctor(data.doctor);
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
  }, [id, retryCount]);

  function handleSelectSlot(slot) {
    setSelectedSlot(slot);
    setIsReviewing(true);
    setBookingError(null);
  }

  function handleChangeTime() {
    setIsReviewing(false);
    setBookingError(null);
  }

  async function handleConfirm() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/doctors/${id}` } } });
      return;
    }
    if (!selectedSlot) return;

    setBookingError(null);
    setIsBooking(true);
    try {
      await apiFetch('/bookings', {
        method: 'POST',
        token,
        body: {
          doctorId: id,
          date: selectedSlot.date,
          time: selectedSlot.time,
          consultationType,
        },
      });
      navigate('/booking-confirmation', {
        state: {
          doctor: { id, name: doctor.name, specialty: doctor.specialty },
          date: selectedSlot.date,
          time: selectedSlot.time,
          consultationType,
          fee: doctor.fee,
        },
      });
    } catch (err) {
      setBookingError(err.message);
      if (err.status === 409) {
        setIsReviewing(false);
        setSelectedSlot(null);
      }
    } finally {
      setIsBooking(false);
    }
  }

  if (status === 'loading') return <ProfileSkeleton />;
  if (status === 'error') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <ErrorState message={error} onRetry={() => setRetryCount((count) => count + 1)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex flex-col gap-5 sm:flex-row">
            <img
              src={doctor.photo || FALLBACK_PHOTO}
              alt={doctor.name}
              className="h-32 w-32 flex-shrink-0 rounded-2xl object-cover shadow-card"
            />
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {doctor.name}
              </h1>
              <p className="capitalize text-brand-700 dark:text-brand-400">{doctor.specialty}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <StarRating rating={doctor.rating} />
                {doctor.experience && <span>{doctor.experience} experience</span>}
                {doctor.availability && (
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                    {doctor.availability}
                  </span>
                )}
              </div>
            </div>
          </div>

          {doctor.bio && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">About</h2>
              <p className="mt-2 text-slate-700 dark:text-slate-300">{doctor.bio}</p>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {doctor.education?.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Education
                </h3>
                <ul className="mt-1.5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {doctor.education.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {doctor.languages?.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Languages
                </h3>
                <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300">
                  {doctor.languages.join(', ')}
                </p>
              </div>
            )}

            {doctor.specializations?.length > 0 && (
              <div className="sm:col-span-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Specializations
                </h3>
                <ul className="mt-1.5 flex flex-wrap gap-2">
                  {doctor.specializations.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {doctor.fee && (
            <p className="mt-6 font-display text-lg font-semibold text-slate-900 dark:text-white">
              Consultation fee: <span className="text-brand-700 dark:text-brand-400">{doctor.fee}</span>
            </p>
          )}
        </div>

        <div className="h-fit min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            Book an appointment
          </h2>

          {bookingError && !isReviewing && (
            <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
              {bookingError}
            </p>
          )}

          {!isReviewing ? (
            <div className="mt-4">
              <SlotPicker selected={selectedSlot} onSelect={handleSelectSlot} />
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-900">
                <p className="font-medium text-slate-900 dark:text-white">{doctor.name}</p>
                <p className="capitalize text-slate-500 dark:text-slate-400">{doctor.specialty}</p>
                <p className="mt-2 text-slate-700 dark:text-slate-300">
                  {formatDisplayDate(selectedSlot.date)} at {selectedSlot.time}
                </p>
                {doctor.fee && (
                  <p className="mt-1 text-slate-700 dark:text-slate-300">Fee: {doctor.fee}</p>
                )}
                <button
                  type="button"
                  onClick={handleChangeTime}
                  className="mt-2 text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
                >
                  Change time
                </button>
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Consultation type
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CONSULTATION_TYPES.map((option) => {
                    const isSelected = consultationType === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                          isSelected
                            ? 'border-brand-700 bg-brand-700 text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="consultationType"
                          value={option.value}
                          checked={isSelected}
                          onChange={() => setConsultationType(option.value)}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {bookingError && (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                  {bookingError}
                </p>
              )}

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isBooking}
                className="w-full rounded-lg bg-brand-700 px-4 py-2.5 font-medium text-white shadow-soft transition hover:bg-brand-800 disabled:opacity-60 dark:bg-brand-600 dark:hover:bg-brand-500"
              >
                {isBooking ? 'Confirming your appointment…' : 'Confirm Appointment'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
