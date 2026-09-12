import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DoctorProfile from './DoctorProfile';
import { apiFetch } from '../../api/client';
import { AuthContext } from '../../context/AuthContext';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

function renderPage(authValue) {
  return render(
    <AuthContext.Provider
      value={{ isAuthenticated: true, token: 'jwt-token', user: {}, logout: jest.fn(), ...authValue }}
    >
      <MemoryRouter initialEntries={['/doctors/1']}>
        <Routes>
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/booking-confirmation" element={<p>Booking confirmed</p>} />
          <Route path="/login" element={<p>Login page</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

beforeEach(() => {
  apiFetch.mockReset();
});

describe('DoctorProfile', () => {
  it('renders doctor details once loaded', async () => {
    apiFetch.mockResolvedValueOnce({
      doctor: { name: 'Dr. Sarah Johnson', specialty: 'cardiology', bio: 'Cardiologist.', fee: '$150' },
    });

    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
  });

  it('shows an error message when the doctor cannot be loaded', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Doctor not found'));

    renderPage();

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Doctor not found'));
  });

  it('books an appointment and redirects to the confirmation page', async () => {
    apiFetch
      .mockResolvedValueOnce({ doctor: { name: 'Dr. Sarah Johnson', specialty: 'cardiology' } })
      .mockResolvedValueOnce({ booking: { _id: 'b1' } });
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());

    await user.type(screen.getByLabelText(/date/i), '2026-01-01');
    await user.type(screen.getByLabelText(/time/i), '10:00');
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /book now/i }));
    });

    await waitFor(() => expect(screen.getByText('Booking confirmed')).toBeInTheDocument());
  });

  it('redirects to login when booking while logged out', async () => {
    apiFetch.mockResolvedValueOnce({ doctor: { name: 'Dr. Sarah Johnson', specialty: 'cardiology' } });
    const user = userEvent.setup();

    renderPage({ isAuthenticated: false, token: null });
    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());

    await user.type(screen.getByLabelText(/date/i), '2026-01-01');
    await user.type(screen.getByLabelText(/time/i), '10:00');
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /book now/i }));
    });

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});
