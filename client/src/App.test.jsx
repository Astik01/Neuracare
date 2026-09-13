import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App routing', () => {
  it('renders the Neuracare brand and Home page at /', () => {
    renderAt('/');

    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(within(nav).getByRole('link', { name: /neuracare/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/your health/i);
  });

  it('renders the 404 page for an unknown route', () => {
    renderAt('/this-route-does-not-exist');

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('redirects to login when visiting a protected route while logged out', () => {
    renderAt('/my-bookings');

    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
  });
});
