import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import { apiFetch } from '../api/client';

jest.mock('../api/client', () => ({ apiFetch: jest.fn() }));

function AuthProbe() {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <p data-testid="status">{isAuthenticated ? `logged-in:${user?.email}` : 'logged-out'}</p>
      <button onClick={() => login('ada@example.com', 'password123')}>Log in</button>
      <button onClick={logout}>Log out</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  apiFetch.mockReset();
});

describe('AuthContext', () => {
  it('starts logged out with no stored auth', () => {
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    expect(screen.getByTestId('status')).toHaveTextContent('logged-out');
  });

  it('logs in, persists to localStorage, and exposes the user', async () => {
    apiFetch.mockResolvedValueOnce({
      token: 'jwt-token',
      user: { id: '1', name: 'Ada', email: 'ada@example.com' },
    });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await act(async () => {
      await user.click(screen.getByText('Log in'));
    });

    expect(screen.getByTestId('status')).toHaveTextContent('logged-in:ada@example.com');
    expect(JSON.parse(localStorage.getItem('neuracare_auth')).token).toBe('jwt-token');
  });

  it('logs out and clears localStorage', async () => {
    apiFetch.mockResolvedValueOnce({
      token: 'jwt-token',
      user: { id: '1', name: 'Ada', email: 'ada@example.com' },
    });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await act(async () => {
      await user.click(screen.getByText('Log in'));
    });
    await act(async () => {
      await user.click(screen.getByText('Log out'));
    });

    expect(screen.getByTestId('status')).toHaveTextContent('logged-out');
    expect(localStorage.getItem('neuracare_auth')).toBeNull();
  });
});
