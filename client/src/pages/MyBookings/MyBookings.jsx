import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

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
      <p role="alert" className="px-4 py-12 text-red-600">
        {error}
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking._id} className="rounded border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-900">{booking.doctor?.name}</p>
              <p className="text-sm text-slate-600">
                {booking.date} at {booking.time} · {booking.status}
              </p>
              {booking.status === 'confirmed' && (
                <button
                  type="button"
                  onClick={() => handleCancel(booking._id)}
                  className="mt-2 text-sm font-medium text-red-600 hover:underline"
                >
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
