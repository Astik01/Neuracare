import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import { AuthContext } from '../context/AuthContext';

function renderLayout({ authValue, initialEntries = ['/'] } = {}) {
  const value = authValue || {
    user: null,
    isAuthenticated: false,
    logout: jest.fn(),
  };

  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>Home content</p>} />
            <Route path="find-doctors" element={<p>Find doctors content</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('Layout', () => {
  it('renders the brand, nav links, and page content', () => {
    renderLayout();

    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(within(nav).getByRole('link', { name: /neuracare/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /find doctors/i })).toBeInTheDocument();
    expect(screen.getByText('Home content')).toBeInTheDocument();
  });

  it('shows "Get Started" when logged out', () => {
    renderLayout();

    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
  });

  it('renders a dark mode toggle and the chat widget launcher', () => {
    renderLayout();

    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open chat/i })).toBeInTheDocument();
  });

  it('marks the active route in the nav', () => {
    renderLayout({ initialEntries: ['/find-doctors'] });

    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    const activeLink = within(nav).getByRole('link', { name: /find doctors/i });
    const homeLink = within(nav).getByRole('link', { name: 'Home' });

    expect(activeLink).toHaveClass('border-brand-600');
    expect(homeLink).not.toHaveClass('border-brand-600');
  });

  describe('when authenticated', () => {
    function authedValue(overrides = {}) {
      return {
        user: { name: 'Ada Lovelace', email: 'ada@example.com' },
        isAuthenticated: true,
        logout: jest.fn(),
        ...overrides,
      };
    }

    it('does not show the user\'s name in the main navbar', () => {
      renderLayout({ authValue: authedValue() });

      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(within(nav).queryByText('Ada Lovelace')).not.toBeInTheDocument();
    });

    it('shows a single "My Bookings" link', () => {
      renderLayout({ authValue: authedValue() });

      expect(screen.getAllByRole('link', { name: /my bookings/i })).toHaveLength(1);
    });

    it('opens the account dropdown with profile, settings, and logout', async () => {
      const user = userEvent.setup();
      renderLayout({ authValue: authedValue() });

      const menuButton = screen.getByRole('button', { name: /account menu/i });
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');

      await user.click(menuButton);

      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      const menu = screen.getByRole('menu', { name: /account/i });
      expect(within(menu).getByText('Ada Lovelace')).toBeInTheDocument();
      expect(within(menu).getByText('ada@example.com')).toBeInTheDocument();
      expect(within(menu).getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
      expect(within(menu).getByRole('menuitem', { name: /settings/i })).toBeInTheDocument();
      expect(within(menu).getByRole('menuitem', { name: /log out/i })).toBeInTheDocument();
    });

    it('closes the account dropdown on escape', async () => {
      const user = userEvent.setup();
      renderLayout({ authValue: authedValue() });

      await user.click(screen.getByRole('button', { name: /account menu/i }));
      expect(screen.getByRole('menu', { name: /account/i })).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('menu', { name: /account/i })).not.toBeInTheDocument();
    });

    it('calls logout when the dropdown logout item is clicked', async () => {
      const logout = jest.fn();
      const user = userEvent.setup();
      renderLayout({ authValue: authedValue({ logout }) });

      await user.click(screen.getByRole('button', { name: /account menu/i }));
      await user.click(screen.getByRole('menuitem', { name: /log out/i }));

      expect(logout).toHaveBeenCalled();
    });

    it('lists all nav items plus account actions in the mobile menu', async () => {
      const user = userEvent.setup();
      renderLayout({ authValue: authedValue() });

      await user.click(screen.getByRole('button', { name: /open menu/i }));

      const mobileNavItems = ['Profile', 'Settings', 'My Bookings'];
      mobileNavItems.forEach((label) => {
        expect(screen.getAllByText(label).length).toBeGreaterThan(0);
      });
      expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    });
  });
});
