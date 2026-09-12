import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">{doctor.name}</h1>
      <p className="text-slate-600">{doctor.specialty}</p>
      <p className="mt-4 text-slate-700">{doctor.bio}</p>
      <p className="mt-2 font-medium text-teal-700">{doctor.fee}</p>

      <form onSubmit={handleBooking} className="mt-8 space-y-4 max-w-sm" noValidate>
        <h2 className="text-lg font-semibold text-slate-900">Book an appointment</h2>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-700">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-slate-700">
            Time
          </label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
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
          className="rounded bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {isBooking ? 'Booking…' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}
