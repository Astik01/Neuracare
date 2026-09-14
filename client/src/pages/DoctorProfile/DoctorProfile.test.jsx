import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DoctorProfile from './DoctorProfile';
import { apiFetch } from '../../api/client';
import { AuthContext } from '../../context/AuthContext';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

const DOCTOR = {
  _id: '1',
  name: 'Dr. Sarah Johnson',
  specialty: 'cardiology',
  bio: 'Cardiologist.',
  fee: '$150',
  rating: 4.9,
  experience: '15 years',
  availability: 'Available Today',
  education: ['MD, Harvard Medical School'],
  languages: ['English', 'Spanish'],
  specializations: ['Preventive Cardiology'],
};

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

async function pickFirstSlot(user) {
  const slotButton = screen.getByRole('tabpanel').querySelector('button');
  await user.click(slotButton);
}

beforeEach(() => {
  apiFetch.mockReset();
});

describe('DoctorProfile', () => {
  it('renders doctor details once loaded, including education/languages/specializations', async () => {
    apiFetch.mockResolvedValueOnce({ doctor: DOCTOR });

    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    expect(screen.getByText('MD, Harvard Medical School')).toBeInTheDocument();
    expect(screen.getByText('English, Spanish')).toBeInTheDocument();
    expect(screen.getByText('Preventive Cardiology')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Dr. Sarah Johnson' })).toBeInTheDocument();
  });

  it('shows an error state with a retry button when the doctor cannot be loaded', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Doctor not found'));

    renderPage();

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Doctor not found'));

    apiFetch.mockResolvedValueOnce({ doctor: DOCTOR });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
  });

  it('walks through slot selection, review, and confirms a booking', async () => {
    apiFetch
      .mockResolvedValueOnce({ doctor: DOCTOR })
      .mockResolvedValueOnce({ booking: { _id: 'b1' } });
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());

    await pickFirstSlot(user);

    expect(screen.getByText(/consultation type/i)).toBeInTheDocument();
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /confirm appointment/i }));
    });

    await waitFor(() => expect(screen.getByText('Booking confirmed')).toBeInTheDocument());
    expect(apiFetch).toHaveBeenLastCalledWith('/bookings', {
      method: 'POST',
      token: 'jwt-token',
      body: expect.objectContaining({ doctorId: '1', consultationType: 'in-person' }),
    });
  });

  it('lets the user change the selected time before confirming', async () => {
    apiFetch.mockResolvedValueOnce({ doctor: DOCTOR });
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());

    await pickFirstSlot(user);
    expect(screen.getByText(/consultation type/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /change time/i }));
    expect(screen.getByRole('tablist', { name: /choose a day/i })).toBeInTheDocument();
  });

  it('shows an inline error and returns to slot picking on a 409 conflict', async () => {
    const conflictError = new Error('This time slot is no longer available. Please choose another.');
    conflictError.status = 409;
    apiFetch.mockResolvedValueOnce({ doctor: DOCTOR }).mockRejectedValueOnce(conflictError);
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());

    await pickFirstSlot(user);
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /confirm appointment/i }));
    });

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(/no longer available/i),
    );
    expect(screen.getByRole('tablist', { name: /choose a day/i })).toBeInTheDocument();
  });

  it('redirects to login when confirming while logged out', async () => {
    apiFetch.mockResolvedValueOnce({ doctor: DOCTOR });
    const user = userEvent.setup();

    renderPage({ isAuthenticated: false, token: null });
    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());

    await pickFirstSlot(user);
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /confirm appointment/i }));
    });

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});
