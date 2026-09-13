import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MyBookings from './MyBookings';
import { apiFetch } from '../../api/client';
import { AuthContext } from '../../context/AuthContext';

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

beforeEach(() => {
  apiFetch.mockReset();
});

describe('MyBookings', () => {
  it('shows an empty state with no bookings', async () => {
    apiFetch.mockResolvedValueOnce({ count: 0, bookings: [] });

    renderPage();

    await waitFor(() => expect(screen.getByText(/no bookings yet/i)).toBeInTheDocument());
  });

  it('renders bookings and allows cancelling one', async () => {
    apiFetch
      .mockResolvedValueOnce({
        count: 1,
        bookings: [
          {
            _id: 'b1',
            date: '2026-01-01',
            time: '10:00',
            status: 'confirmed',
            doctor: { name: 'Dr. Sarah Johnson' },
          },
        ],
      })
      .mockResolvedValueOnce({ booking: { _id: 'b1', status: 'cancelled' } });
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /cancel/i }));
    });

    expect(screen.getByText(/cancelled/i)).toBeInTheDocument();
    expect(apiFetch).toHaveBeenCalledWith('/bookings/b1', { method: 'DELETE', token: 'jwt-token' });
  });

  it('shows an error message when bookings fail to load', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Failed to fetch bookings'));

    renderPage();

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch bookings'));
  });
});
