import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Signup from './Signup';
import { AuthContext } from '../../context/AuthContext';

function renderSignup(signup) {
  const value = { signup, isAuthenticated: false, user: null, token: null, logout: jest.fn() };
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('Signup', () => {
  it('submits name, email and password to signup()', async () => {
    const signup = jest.fn().mockResolvedValue({ id: '1' });
    const user = userEvent.setup();
    renderSignup(signup);

    await user.type(screen.getByLabelText(/name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /sign up/i }));
    });

    expect(signup).toHaveBeenCalledWith('Ada Lovelace', 'ada@example.com', 'password123');
  });

  it('shows an error message when signup fails (e.g. duplicate email)', async () => {
    const signup = jest.fn().mockRejectedValue(new Error('Email already registered'));
    const user = userEvent.setup();
    renderSignup(signup);

    await user.type(screen.getByLabelText(/name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /sign up/i }));
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Email already registered');
  });
});
