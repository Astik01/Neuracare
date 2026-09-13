import { Link } from 'react-router-dom';

function readLastBooking() {
  try {
    const raw = sessionStorage.getItem('neuracare_last_booking');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function BookingConfirmation() {
  const booking = readLastBooking();

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl dark:bg-brand-900/40">
        ✅
      </div>
      <h1 className="mt-6 font-display text-2xl font-bold text-slate-900 dark:text-white">
        Appointment confirmed
      </h1>
      <div className="mb-6 mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-card dark:border-slate-700 dark:bg-slate-800">
        {booking ? (
          <>
            <p className="font-display font-semibold text-slate-900 dark:text-white">
              {booking.doctorName}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Date: {booking.date} at {booking.time}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Booking details not found. Check My Bookings for your appointments.
          </p>
        )}
      </div>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        A confirmation has been sent to your email.
      </p>
      <Link
        to="/my-bookings"
        className="inline-block rounded-full bg-brand-700 px-6 py-3 font-medium text-white shadow-soft transition hover:bg-brand-800"
      >
        View My Bookings
      </Link>
    </div>
  );
}
