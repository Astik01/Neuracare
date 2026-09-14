import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import ErrorState from '../../components/ErrorState';
import SlotPicker from '../../components/SlotPicker';
import { buildAppointmentDate, formatDisplayDate, getTodayISO } from '../../utils/scheduling';

const TABS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'cancelled', label: 'Cancelled' },
];

const CONSULTATION_TYPE_LABELS = {
  'in-person': 'In-person visit',
  video: 'Video call',
};

const STATUS_STYLES = {
  confirmed: 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  cancelled: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
};

function BookingCardSkeleton() {
  return (
    <li className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-2 h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-4 h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
    </li>
  );
}

function bucketFor(booking, todayISO) {
  if (booking.status === 'cancelled') return 'cancelled';
  return booking.date < todayISO ? 'past' : 'upcoming';
}

function timeValue(booking) {
  return buildAppointmentDate(booking.date, booking.time)?.getTime() ?? 0;
}

export default function MyBookings() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [expandedId, setExpandedId] = useState(null);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [rescheduleBookingId, setRescheduleBookingId] = useState(null);
  const [rescheduleSlot, setRescheduleSlot] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);
    apiFetch('/bookings', { token })
      .then((data) => {
        if (cancelled) return;
        setBookings(data.bookings || []);
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
  }, [token, retryCount]);

  const todayISO = getTodayISO();

  const buckets = useMemo(() => {
    const result = { upcoming: [], past: [], cancelled: [] };
    bookings.forEach((booking) => {
      result[bucketFor(booking, todayISO)].push(booking);
    });
    result.upcoming.sort((a, b) => timeValue(a) - timeValue(b));
    result.past.sort((a, b) => timeValue(b) - timeValue(a));
    result.cancelled.sort((a, b) => timeValue(b) - timeValue(a));
    return result;
  }, [bookings, todayISO]);

  function updateBooking(id, changes) {
    setBookings((current) => current.map((b) => (b._id === id ? { ...b, ...changes } : b)));
  }

  async function handleConfirmCancel(bookingId) {
    setCancelingId(bookingId);
    setCancelError(null);
    try {
      await apiFetch(`/bookings/${bookingId}`, { method: 'DELETE', token });
      updateBooking(bookingId, { status: 'cancelled' });
      setCancelConfirmId(null);
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelingId(null);
    }
  }

  function openReschedule(bookingId) {
    setRescheduleBookingId(bookingId);
    setRescheduleSlot(null);
    setRescheduleError(null);
  }

  function closeReschedule() {
    setRescheduleBookingId(null);
    setRescheduleSlot(null);
    setRescheduleError(null);
  }

  async function handleConfirmReschedule() {
    if (!rescheduleSlot) return;
    setIsRescheduling(true);
    setRescheduleError(null);
    try {
      const data = await apiFetch(`/bookings/${rescheduleBookingId}/reschedule`, {
        method: 'PATCH',
        token,
        body: rescheduleSlot,
      });
      updateBooking(rescheduleBookingId, { date: data.booking.date, time: data.booking.time });
      closeReschedule();
    } catch (err) {
      setRescheduleError(err.message);
    } finally {
      setIsRescheduling(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Bookings</h1>
        <ul className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <BookingCardSkeleton key={index} />
          ))}
        </ul>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Bookings</h1>
        <div className="mt-6">
          <ErrorState message={error} onRetry={() => setRetryCount((count) => count + 1)} />
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Bookings</h1>
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <span className="text-4xl" aria-hidden="true">
            📅
          </span>
          <p className="text-slate-600 dark:text-slate-300">
            You don't have any upcoming appointments.
          </p>
          <Link
            to="/find-doctors"
            className="rounded-full bg-brand-700 px-5 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-800"
          >
            Find a Doctor
          </Link>
        </div>
      </div>
    );
  }

  const activeBookings = buckets[activeTab];
  const reschedulingBooking = bookings.find((b) => b._id === rescheduleBookingId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Bookings</h1>

      <div role="tablist" aria-label="Booking status" className="mt-6 flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
              activeTab === tab.value
                ? 'border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-400'
            }`}
          >
            {tab.label} ({buckets[tab.value].length})
          </button>
        ))}
      </div>

      {activeBookings.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-slate-600 dark:text-slate-300">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming appointments."
              : `No ${activeTab} appointments.`}
          </p>
          {activeTab === 'upcoming' && (
            <Link
              to="/find-doctors"
              className="rounded-full bg-brand-700 px-5 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-800"
            >
              Find a Doctor
            </Link>
          )}
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {activeBookings.map((booking) => {
            const isExpanded = expandedId === booking._id;
            const isConfirmingCancel = cancelConfirmId === booking._id;

            return (
              <li
                key={booking._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display font-semibold text-slate-900 dark:text-white">
                      {booking.doctor?.name}
                    </p>
                    {booking.doctor?.specialty && (
                      <p className="text-sm capitalize text-brand-700 dark:text-brand-400">
                        {booking.doctor.specialty}
                      </p>
                    )}
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDisplayDate(booking.date)} at {booking.time}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      STATUS_STYLES[booking.status] || STATUS_STYLES.confirmed
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {isExpanded && (
                  <dl className="mt-4 space-y-1.5 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-900">
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500 dark:text-slate-400">Consultation type</dt>
                      <dd className="text-slate-900 dark:text-white">
                        {CONSULTATION_TYPE_LABELS[booking.consultationType] || 'In-person visit'}
                      </dd>
                    </div>
                    {booking.doctor?.fee && (
                      <div className="flex justify-between gap-2">
                        <dt className="text-slate-500 dark:text-slate-400">Fee</dt>
                        <dd className="text-slate-900 dark:text-white">{booking.doctor.fee}</dd>
                      </div>
                    )}
                    {booking.reason && (
                      <div className="flex justify-between gap-2">
                        <dt className="text-slate-500 dark:text-slate-400">Reason</dt>
                        <dd className="text-slate-900 dark:text-white">{booking.reason}</dd>
                      </div>
                    )}
                  </dl>
                )}

                {isConfirmingCancel ? (
                  <div className="mt-4 rounded-xl bg-red-50 p-3 dark:bg-red-900/20">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Are you sure you want to cancel this appointment?
                    </p>
                    {cancelError && (
                      <p role="alert" className="mt-1 text-sm text-red-700 dark:text-red-300">
                        {cancelError}
                      </p>
                    )}
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleConfirmCancel(booking._id)}
                        disabled={cancelingId === booking._id}
                        className="rounded-lg bg-red-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-800 disabled:opacity-60"
                      >
                        {cancelingId === booking._id ? 'Cancelling…' : 'Yes, cancel'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCancelConfirmId(null)}
                        className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
                      >
                        No, keep it
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : booking._id)}
                      className="text-slate-600 hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
                    >
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </button>
                    {activeTab === 'upcoming' && (
                      <>
                        <button
                          type="button"
                          onClick={() => openReschedule(booking._id)}
                          className="text-brand-700 hover:underline dark:text-brand-400"
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCancelConfirmId(booking._id);
                            setCancelError(null);
                          }}
                          className="text-red-600 hover:underline dark:text-red-400"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {activeTab === 'past' && booking.doctor?._id && (
                      <Link
                        to={`/doctors/${booking.doctor._id}`}
                        className="text-brand-700 hover:underline dark:text-brand-400"
                      >
                        Book Again
                      </Link>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {reschedulingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/50" onClick={closeReschedule} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Reschedule appointment"
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-glow dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Reschedule with {reschedulingBooking.doctor?.name}
              </h2>
              <button
                type="button"
                onClick={closeReschedule}
                aria-label="Close"
                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <SlotPicker selected={rescheduleSlot} onSelect={setRescheduleSlot} />
            </div>

            {rescheduleError && (
              <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
                {rescheduleError}
              </p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={closeReschedule}
                className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                disabled={!rescheduleSlot || isRescheduling}
                className="flex-1 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-brand-800 disabled:opacity-60"
              >
                {isRescheduling ? 'Saving…' : 'Confirm New Time'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
