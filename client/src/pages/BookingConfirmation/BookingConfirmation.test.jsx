import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BookingConfirmation from './BookingConfirmation';

const BOOKING_STATE = {
  doctor: { id: '1', name: 'Dr. Sarah Johnson', specialty: 'cardiology' },
  date: '2026-03-05',
  time: '09:00 AM',
  consultationType: 'in-person',
  fee: '$150',
};

function renderPage(state) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/booking-confirmation', state }]}>
      <BookingConfirmation />
    </MemoryRouter>,
  );
}

describe('BookingConfirmation', () => {
  it('renders the booking details from navigation state', () => {
    renderPage(BOOKING_STATE);

    expect(screen.getByText('Appointment Confirmed')).toBeInTheDocument();
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('cardiology')).toBeInTheDocument();
    expect(screen.getByText(/09:00 AM/)).toBeInTheDocument();
    expect(screen.getByText('In-person visit')).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();
  });

  it('shows a fallback message when no booking details are present', () => {
    renderPage(undefined);

    expect(screen.getByText(/booking details not found/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add to calendar/i })).not.toBeInTheDocument();
  });

  it('links to My Bookings and Home', () => {
    renderPage(BOOKING_STATE);

    expect(screen.getByRole('link', { name: /view my bookings/i })).toHaveAttribute(
      'href',
      '/my-bookings',
    );
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
  });

  it('triggers an .ics download when Add to Calendar is clicked', async () => {
    const user = userEvent.setup();
    const createObjectURL = jest.fn(() => 'blob:mock-url');
    const revokeObjectURL = jest.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;

    renderPage(BOOKING_STATE);
    await user.click(screen.getByRole('button', { name: /add to calendar/i }));

    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
