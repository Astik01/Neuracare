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
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Appointment confirmed</h1>
      <div className="rounded-lg bg-white border border-slate-200 p-5 text-left mb-6">
        {booking ? (
          <>
            <p className="font-semibold text-slate-900">{booking.doctorName}</p>
            <p className="text-sm text-slate-600">
              Date: {booking.date} at {booking.time}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-600">
            Booking details not found. Check My Bookings for your appointments.
          </p>
        )}
      </div>
      <p className="text-slate-600 mb-6">A confirmation has been sent to your email.</p>
      <Link
        to="/my-bookings"
        className="inline-block rounded bg-teal-700 px-6 py-3 font-medium text-white hover:bg-teal-800"
      >
        View My Bookings
      </Link>
    </div>
  );
}
