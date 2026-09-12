import { render, screen, waitFor } from '@testing-library/react';
import Profile from './Profile';
import { apiFetch } from '../../api/client';
import { AuthContext } from '../../context/AuthContext';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

function renderPage() {
  return render(
    <AuthContext.Provider
      value={{ isAuthenticated: true, token: 'jwt-token', user: {}, logout: jest.fn() }}
    >
      <Profile />
    </AuthContext.Provider>,
  );
}

beforeEach(() => {
  apiFetch.mockReset();
});

describe('Profile', () => {
  it('renders the loaded profile', async () => {
    apiFetch.mockResolvedValueOnce({ user: { name: 'Ada Lovelace', email: 'ada@example.com' } });

    renderPage();

    await waitFor(() => expect(screen.getByText('Ada Lovelace')).toBeInTheDocument());
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
  });

  it('shows an error message when the profile fails to load', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Token expired'));

    renderPage();

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Token expired'));
  });
});
