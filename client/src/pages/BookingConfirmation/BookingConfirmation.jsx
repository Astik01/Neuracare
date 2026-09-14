import { Link, useLocation } from 'react-router-dom';
import { buildAppointmentICS, downloadICS, formatDisplayDate } from '../../utils/scheduling';

const CONSULTATION_TYPE_LABELS = {
  'in-person': 'In-person visit',
  video: 'Video call',
};

export default function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state;

  function handleAddToCalendar() {
    const ics = buildAppointmentICS({
      doctorName: booking.doctor?.name,
      specialty: booking.doctor?.specialty,
      date: booking.date,
      time: booking.time,
    });
    downloadICS(ics);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
        ✓
      </div>
      <h1 className="mt-6 font-display text-2xl font-bold text-slate-900 dark:text-white">
        Appointment Confirmed
      </h1>

      <div className="mb-6 mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-card dark:border-slate-700 dark:bg-slate-800">
        {booking ? (
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-slate-500 dark:text-slate-400">Doctor</dt>
              <dd className="font-display font-semibold text-slate-900 dark:text-white">
                {booking.doctor?.name}
              </dd>
            </div>
            {booking.doctor?.specialty && (
              <div>
                <dt className="text-sm text-slate-500 dark:text-slate-400">Specialty</dt>
                <dd className="capitalize font-medium text-slate-900 dark:text-white">
                  {booking.doctor.specialty}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-slate-500 dark:text-slate-400">Date &amp; Time</dt>
              <dd className="font-medium text-slate-900 dark:text-white">
                {formatDisplayDate(booking.date)} at {booking.time}
              </dd>
            </div>
            {booking.consultationType && (
              <div>
                <dt className="text-sm text-slate-500 dark:text-slate-400">Consultation Type</dt>
                <dd className="font-medium text-slate-900 dark:text-white">
                  {CONSULTATION_TYPE_LABELS[booking.consultationType] || booking.consultationType}
                </dd>
              </div>
            )}
            {booking.fee && (
              <div>
                <dt className="text-sm text-slate-500 dark:text-slate-400">Fee</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{booking.fee}</dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Booking details not found. Check My Bookings for your appointments.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Link
          to="/my-bookings"
          className="rounded-full bg-brand-700 px-6 py-3 font-medium text-white shadow-soft transition hover:bg-brand-800"
        >
          View My Bookings
        </Link>
        {booking && (
          <button
            type="button"
            onClick={handleAddToCalendar}
            className="rounded-full bg-slate-100 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            Add to Calendar
          </button>
        )}
        <Link
          to="/"
          className="rounded-full px-6 py-3 font-medium text-slate-600 transition hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
