import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';
import { apiFetch } from '../../api/client';
import { AuthContext } from '../../context/AuthContext';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

const PROFILE = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '+1 555 010 1234',
  notificationsEnabled: true,
};

function renderPage({ logout = jest.fn() } = {}) {
  return render(
    <AuthContext.Provider value={{ isAuthenticated: true, token: 'jwt-token', user: {}, logout }}>
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

beforeEach(() => {
  apiFetch.mockReset();
});

describe('Profile', () => {
  it('renders the loaded profile across sections', async () => {
    apiFetch.mockResolvedValueOnce({ user: PROFILE });

    renderPage();

    await waitFor(() => expect(screen.getAllByText('Ada Lovelace').length).toBeGreaterThan(0));
    expect(screen.getByText('Profile Information')).toBeInTheDocument();
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByText('Account Actions')).toBeInTheDocument();
    expect(screen.getByLabelText(/^name$/i)).toHaveValue('Ada Lovelace');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('+1 555 010 1234');
  });

  it('shows an error message with retry when the profile fails to load', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Token expired'));

    renderPage();

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Token expired'));

    apiFetch.mockResolvedValueOnce({ user: PROFILE });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() => expect(screen.getAllByText('Ada Lovelace').length).toBeGreaterThan(0));
  });

  it('updates name and phone', async () => {
    apiFetch
      .mockResolvedValueOnce({ user: PROFILE })
      .mockResolvedValueOnce({ user: { ...PROFILE, name: 'Ada K. Lovelace' } });
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(screen.getByLabelText(/^name$/i)).toHaveValue('Ada Lovelace'));

    await user.clear(screen.getByLabelText(/^name$/i));
    await user.type(screen.getByLabelText(/^name$/i), 'Ada K. Lovelace');
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /save changes/i }));
    });

    expect(apiFetch).toHaveBeenLastCalledWith('/users/me', {
      method: 'PATCH',
      token: 'jwt-token',
      body: { name: 'Ada K. Lovelace', phone: '+1 555 010 1234' },
    });
    expect(screen.getByText('Profile updated.')).toBeInTheDocument();
  });

  it('shows a validation error when name is cleared', async () => {
    apiFetch.mockResolvedValueOnce({ user: PROFILE });
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(screen.getByLabelText(/^name$/i)).toHaveValue('Ada Lovelace'));

    await user.clear(screen.getByLabelText(/^name$/i));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(apiFetch).toHaveBeenCalledTimes(1);
  });

  it('validates the password form before submitting', async () => {
    apiFetch.mockResolvedValueOnce({ user: PROFILE });
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(screen.getByLabelText(/^name$/i)).toHaveValue('Ada Lovelace'));

    await user.type(screen.getByLabelText(/current password/i), 'oldpassword123');
    await user.type(screen.getByLabelText(/^new password$/i), 'short');
    await user.type(screen.getByLabelText(/confirm new password/i), 'different');
    await user.click(screen.getByRole('button', { name: /update password/i }));

    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(apiFetch).toHaveBeenCalledTimes(1);
  });

  it('changes the password successfully', async () => {
    apiFetch
      .mockResolvedValueOnce({ user: PROFILE })
      .mockResolvedValueOnce({ message: 'Password updated successfully' });
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(screen.getByLabelText(/^name$/i)).toHaveValue('Ada Lovelace'));

    await user.type(screen.getByLabelText(/current password/i), 'oldpassword123');
    await user.type(screen.getByLabelText(/^new password$/i), 'newpassword123');
    await user.type(screen.getByLabelText(/confirm new password/i), 'newpassword123');
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /update password/i }));
    });

    expect(apiFetch).toHaveBeenLastCalledWith('/users/me/password', {
      method: 'PATCH',
      token: 'jwt-token',
      body: { currentPassword: 'oldpassword123', newPassword: 'newpassword123' },
    });
    expect(screen.getByText('Password updated.')).toBeInTheDocument();
  });

  it('saves the notification preference', async () => {
    apiFetch
      .mockResolvedValueOnce({ user: PROFILE })
      .mockResolvedValueOnce({ user: { ...PROFILE, notificationsEnabled: false } });
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(screen.getByLabelText(/^name$/i)).toHaveValue('Ada Lovelace'));

    await user.click(screen.getByLabelText(/email me about my appointments/i));
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /save preference/i }));
    });

    expect(apiFetch).toHaveBeenLastCalledWith('/users/me', {
      method: 'PATCH',
      token: 'jwt-token',
      body: { notificationsEnabled: false },
    });
    expect(screen.getByText('Preference saved.')).toBeInTheDocument();
  });

  it('toggles dark mode from the appearance section', async () => {
    apiFetch.mockResolvedValueOnce({ user: PROFILE });
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(screen.getByLabelText(/^name$/i)).toHaveValue('Ada Lovelace'));

    await user.click(screen.getByRole('button', { name: /dark mode/i }));
    expect(screen.getByRole('button', { name: /light mode/i })).toBeInTheDocument();
  });

  it('logs out from account actions', async () => {
    apiFetch.mockResolvedValueOnce({ user: PROFILE });
    const logout = jest.fn();
    const user = userEvent.setup();

    renderPage({ logout });
    await waitFor(() => expect(screen.getByLabelText(/^name$/i)).toHaveValue('Ada Lovelace'));

    await user.click(screen.getByRole('button', { name: /log out/i }));

    expect(logout).toHaveBeenCalled();
  });
});
