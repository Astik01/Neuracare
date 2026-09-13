import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const STATUS_STYLES = {
  confirmed: 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  cancelled: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
};

export default function MyBookings() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
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
  }, [token]);

  async function handleCancel(bookingId) {
    try {
      await apiFetch(`/bookings/${bookingId}`, { method: 'DELETE', token });
      setBookings((current) =>
        current.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b)),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  if (status === 'loading') return <p className="px-4 py-12">Loading your bookings…</p>;
  if (status === 'error')
    return (
      <p role="alert" className="px-4 py-12 text-red-600 dark:text-red-400">
        {error}
      </p>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <span className="text-4xl" aria-hidden="true">
            📅
          </span>
          <p className="text-slate-600 dark:text-slate-300">You have no bookings yet.</p>
          <Link
            to="/find-doctors"
            className="rounded-full bg-brand-700 px-5 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-800"
          >
            Find a doctor
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-800"
            >
              <div>
                <p className="font-display font-semibold text-slate-900 dark:text-white">
                  {booking.doctor?.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {booking.date} at {booking.time}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    STATUS_STYLES[booking.status] || STATUS_STYLES.confirmed
                  }`}
                >
                  {booking.status}
                </span>
                {booking.status === 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => handleCancel(booking._id)}
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
