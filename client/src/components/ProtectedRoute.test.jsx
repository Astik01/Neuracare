import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from '../context/AuthContext';

function renderWithAuth(isAuthenticated) {
  const value = { isAuthenticated, user: null, token: null, login: jest.fn(), logout: jest.fn() };

  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={['/my-bookings']}>
        <Routes>
          <Route path="/login" element={<p>Login page</p>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/my-bookings" element={<p>Bookings page</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('ProtectedRoute', () => {
  it('renders the protected content when authenticated', () => {
    renderWithAuth(true);

    expect(screen.getByText('Bookings page')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    renderWithAuth(false);

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});
