import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop';

export default function DoctorProfile() {
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bookingError, setBookingError] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    let cancelled = false;
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
  }, [id]);

  async function handleBooking(event) {
    event.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/doctors/${id}` } } });
      return;
    }
    setBookingError(null);
    setIsBooking(true);
    try {
      await apiFetch('/bookings', {
        method: 'POST',
        token,
        body: { doctorId: id, date, time },
      });
      sessionStorage.setItem(
        'neuracare_last_booking',
        JSON.stringify({ doctorName: doctor.name, date, time }),
      );
      navigate('/booking-confirmation');
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setIsBooking(false);
    }
  }

  if (status === 'loading') return <p className="px-4 py-12">Loading doctor…</p>;
  if (status === 'error')
    return (
      <p role="alert" className="px-4 py-12 text-red-600">
        {error}
      </p>
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex flex-col gap-5 sm:flex-row">
            <img
              src={doctor.photo || FALLBACK_PHOTO}
              alt=""
              className="h-32 w-32 flex-shrink-0 rounded-2xl object-cover shadow-card"
            />
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {doctor.name}
              </h1>
              <p className="capitalize text-brand-700 dark:text-brand-400">{doctor.specialty}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                {doctor.rating ? (
                  <span className="inline-flex items-center gap-1 text-amber-500">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="m10 1.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L10 1.5Z" />
                    </svg>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {doctor.rating}
                    </span>
                  </span>
                ) : null}
                {doctor.experience && <span>{doctor.experience} experience</span>}
                {doctor.availability && (
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                    {doctor.availability}
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="mt-6 text-slate-700 dark:text-slate-300">{doctor.bio}</p>

          {doctor.fee && (
            <p className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
              Consultation fee: <span className="text-brand-700 dark:text-brand-400">{doctor.fee}</span>
            </p>
          )}
        </div>

        <form
          onSubmit={handleBooking}
          className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800"
          noValidate
        >
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            Book an appointment
          </h2>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Time
            </label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          {bookingError && (
            <p role="alert" className="text-sm text-red-600">
              {bookingError}
            </p>
          )}
          <button
            type="submit"
            disabled={isBooking}
            className="w-full rounded-lg bg-brand-700 px-4 py-2.5 font-medium text-white shadow-soft transition hover:bg-brand-800 disabled:opacity-60"
          >
            {isBooking ? 'Booking…' : 'Book Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
