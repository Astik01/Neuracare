import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from './Contact';
import { apiFetch } from '../../api/client';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

beforeEach(() => {
  apiFetch.mockReset();
});

async function fillForm(user) {
  await user.type(screen.getByLabelText(/name/i), 'Ada Lovelace');
  await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
  await user.type(screen.getByLabelText(/subject/i), 'Question');
  await user.type(screen.getByLabelText(/message/i), 'How do I book an appointment?');
}

describe('Contact', () => {
  it('submits the form and shows a confirmation message', async () => {
    apiFetch.mockResolvedValueOnce({ contact: {} });
    const user = userEvent.setup();
    render(<Contact />);

    await fillForm(user);
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /send message/i }));
    });

    expect(screen.getByText(/message sent/i)).toBeInTheDocument();
  });

  it('shows an error message when submission fails', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Invalid email format'));
    const user = userEvent.setup();
    render(<Contact />);

    await fillForm(user);
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /send message/i }));
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email format');
  });
});
