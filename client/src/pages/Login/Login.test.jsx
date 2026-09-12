import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { AuthContext } from '../../context/AuthContext';

function renderLogin(login) {
  const value = { login, isAuthenticated: false, user: null, token: null, logout: jest.fn() };
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('Login', () => {
  it('submits the entered credentials to login()', async () => {
    const login = jest.fn().mockResolvedValue({ id: '1', email: 'ada@example.com' });
    const user = userEvent.setup();
    renderLogin(login);

    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /log in/i }));
    });

    expect(login).toHaveBeenCalledWith('ada@example.com', 'password123');
  });

  it('shows an error message when login fails', async () => {
    const login = jest.fn().mockRejectedValue(new Error('Invalid email or password'));
    const user = userEvent.setup();
    renderLogin(login);

    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong-password');
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /log in/i }));
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password');
  });
});
