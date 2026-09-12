import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookingConfirmation from './BookingConfirmation';

function renderPage() {
  return render(
    <MemoryRouter>
      <BookingConfirmation />
    </MemoryRouter>,
  );
}

describe('BookingConfirmation', () => {
  afterEach(() => sessionStorage.clear());

  it('renders the booking details when present in sessionStorage', () => {
    sessionStorage.setItem(
      'neuracare_last_booking',
      JSON.stringify({ doctorName: 'Dr. Sarah Johnson', date: '2026-01-01', time: '10:00' }),
    );

    renderPage();

    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText(/2026-01-01 at 10:00/)).toBeInTheDocument();
  });

  it('shows a fallback message when no booking details are stored', () => {
    renderPage();

    expect(screen.getByText(/booking details not found/i)).toBeInTheDocument();
  });

  it('links to My Bookings', () => {
    renderPage();

    expect(screen.getByRole('link', { name: /view my bookings/i })).toHaveAttribute(
      'href',
      '/my-bookings',
    );
  });
});
