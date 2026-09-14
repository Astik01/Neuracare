import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MyBookings from './MyBookings';
import { apiFetch } from '../../api/client';
import { AuthContext } from '../../context/AuthContext';
import { getTodayISO } from '../../utils/scheduling';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

function renderPage() {
  return render(
    <AuthContext.Provider
      value={{ isAuthenticated: true, token: 'jwt-token', user: {}, logout: jest.fn() }}
    >
      <MemoryRouter>
        <MyBookings />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

const TODAY = getTodayISO();
const FUTURE_DATE = '2099-01-01';
const PAST_DATE = '2020-01-01';

beforeEach(() => {
  apiFetch.mockReset();
});

describe('MyBookings', () => {
  it('shows the empty state with no bookings at all', async () => {
    apiFetch.mockResolvedValueOnce({ count: 0, bookings: [] });

    renderPage();

    await waitFor(() =>
      expect(screen.getByText(/don't have any upcoming appointments/i)).toBeInTheDocument(),
    );
    expect(screen.getByRole('link', { name: /find a doctor/i })).toHaveAttribute(
      'href',
      '/find-doctors',
    );
  });

  it('shows an error state with a retry button', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Failed to fetch bookings'));

    renderPage();

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch bookings'));

    apiFetch.mockResolvedValueOnce({ count: 0, bookings: [] });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() =>
      expect(screen.getByText(/don't have any upcoming appointments/i)).toBeInTheDocument(),
    );
  });

  it('splits bookings into Upcoming, Past, and Cancelled tabs', async () => {
    apiFetch.mockResolvedValueOnce({
      bookings: [
        {
          _id: 'upcoming-1',
          date: FUTURE_DATE,
          time: '09:00 AM',
          status: 'confirmed',
          doctor: { _id: 'd1', name: 'Dr. Sarah Johnson', specialty: 'cardiology' },
        },
        {
          _id: 'past-1',
          date: PAST_DATE,
          time: '09:00 AM',
          status: 'confirmed',
          doctor: { _id: 'd2', name: 'Dr. James Patel', specialty: 'general practice' },
        },
        {
          _id: 'cancelled-1',
          date: FUTURE_DATE,
          time: '11:00 AM',
          status: 'cancelled',
          doctor: { _id: 'd3', name: 'Dr. Grace Kim', specialty: 'orthopedics' },
        },
      ],
    });
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    expect(screen.getByRole('tab', { name: /upcoming \(1\)/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /past \(1\)/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /cancelled \(1\)/i })).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /past/i }));
    expect(screen.getByText('Dr. James Patel')).toBeInTheDocument();
    expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /cancelled/i }));
    expect(screen.getByText('Dr. Grace Kim')).toBeInTheDocument();
  });

  it('shows View Details, Reschedule, and Cancel for upcoming bookings, and Book Again for past', async () => {
    apiFetch.mockResolvedValueOnce({
      bookings: [
        {
          _id: 'upcoming-1',
          date: FUTURE_DATE,
          time: '09:00 AM',
          status: 'confirmed',
          consultationType: 'video',
          doctor: { _id: 'd1', name: 'Dr. Sarah Johnson', specialty: 'cardiology', fee: '$150' },
        },
        {
          _id: 'past-1',
          date: PAST_DATE,
          time: '09:00 AM',
          status: 'confirmed',
          doctor: { _id: 'd2', name: 'Dr. James Patel', specialty: 'general practice' },
        },
      ],
    });
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /reschedule/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /join appointment/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /view details/i }));
    expect(screen.getByText('Video call')).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /past/i }));
    expect(screen.getByRole('link', { name: /book again/i })).toHaveAttribute('href', '/doctors/d2');
  });

  it('cancels a booking after confirming', async () => {
    apiFetch
      .mockResolvedValueOnce({
        bookings: [
          {
            _id: 'b1',
            date: FUTURE_DATE,
            time: '09:00 AM',
            status: 'confirmed',
            doctor: { _id: 'd1', name: 'Dr. Sarah Johnson' },
          },
        ],
      })
      .mockResolvedValueOnce({ booking: { _id: 'b1', status: 'cancelled' } });
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /^cancel$/i }));
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /yes, cancel/i }));
    });

    expect(apiFetch).toHaveBeenCalledWith('/bookings/b1', { method: 'DELETE', token: 'jwt-token' });
    await user.click(screen.getByRole('tab', { name: /cancelled/i }));
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
  });

  it('backs out of cancelling without calling the API', async () => {
    apiFetch.mockResolvedValueOnce({
      bookings: [
        {
          _id: 'b1',
          date: FUTURE_DATE,
          time: '09:00 AM',
          status: 'confirmed',
          doctor: { _id: 'd1', name: 'Dr. Sarah Johnson' },
        },
      ],
    });
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /^cancel$/i }));
    await user.click(screen.getByRole('button', { name: /no, keep it/i }));

    expect(apiFetch).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeInTheDocument();
  });

  it('reschedules a booking to a newly selected slot', async () => {
    apiFetch
      .mockResolvedValueOnce({
        bookings: [
          {
            _id: 'b1',
            date: FUTURE_DATE,
            time: '09:00 AM',
            status: 'confirmed',
            doctor: { _id: 'd1', name: 'Dr. Sarah Johnson' },
          },
        ],
      })
      .mockResolvedValueOnce({
        booking: { _id: 'b1', date: '2099-02-02', time: '11:00 AM', status: 'confirmed' },
      });
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /reschedule/i }));

    const dialog = screen.getByRole('dialog', { name: /reschedule appointment/i });
    const slotButton = within(dialog).getByRole('tabpanel').querySelector('button');
    await user.click(slotButton);

    await act(async () => {
      await user.click(within(dialog).getByRole('button', { name: /confirm new time/i }));
    });

    expect(apiFetch).toHaveBeenLastCalledWith('/bookings/b1/reschedule', {
      method: 'PATCH',
      token: 'jwt-token',
      body: expect.objectContaining({ time: slotButton.textContent }),
    });
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: /reschedule appointment/i })).not.toBeInTheDocument(),
    );
  });

  it('shows an inline error when reschedule conflicts with another booking', async () => {
    apiFetch
      .mockResolvedValueOnce({
        bookings: [
          {
            _id: 'b1',
            date: FUTURE_DATE,
            time: '09:00 AM',
            status: 'confirmed',
            doctor: { _id: 'd1', name: 'Dr. Sarah Johnson' },
          },
        ],
      })
      .mockRejectedValueOnce(new Error('This time slot is no longer available. Please choose another.'));
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /reschedule/i }));

    const dialog = screen.getByRole('dialog', { name: /reschedule appointment/i });
    await user.click(within(dialog).getByRole('tabpanel').querySelector('button'));
    await act(async () => {
      await user.click(within(dialog).getByRole('button', { name: /confirm new time/i }));
    });

    expect(within(dialog).getByRole('alert')).toHaveTextContent(/no longer available/i);
  });
});
