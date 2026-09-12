import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import { AuthProvider } from '../context/AuthContext';

function renderLayout() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>Home content</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('Layout', () => {
  it('renders the brand, nav links, and page content', () => {
    renderLayout();

    expect(screen.getByRole('link', { name: /neuracare/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /find doctors/i })).toBeInTheDocument();
    expect(screen.getByText('Home content')).toBeInTheDocument();
  });

  it('shows "Get Started" when logged out', () => {
    renderLayout();

    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
  });
});
