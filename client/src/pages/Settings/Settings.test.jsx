import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Settings from './Settings';
import { AuthContext } from '../../context/AuthContext';

function renderPage({ logout = jest.fn() } = {}) {
  return render(
    <AuthContext.Provider
      value={{
        isAuthenticated: true,
        token: 'jwt-token',
        user: { name: 'Ada Lovelace', email: 'ada@example.com' },
        logout,
      }}
    >
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('Settings', () => {
  it('renders the signed-in user\'s account details', () => {
    renderPage();

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
  });

  it('toggles dark mode', async () => {
    const user = userEvent.setup();
    renderPage();

    const toggle = screen.getByRole('button', { name: /dark mode/i });
    await user.click(toggle);

    expect(screen.getByRole('button', { name: /light mode/i })).toBeInTheDocument();
  });

  it('logs out when the log out button is clicked', async () => {
    const logout = jest.fn();
    const user = userEvent.setup();
    renderPage({ logout });

    await user.click(screen.getByRole('button', { name: /log out/i }));

    expect(logout).toHaveBeenCalled();
  });
});
