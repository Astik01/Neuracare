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
  it('submits the form and shows the exact confirmation message', async () => {
    apiFetch.mockResolvedValueOnce({ contact: {} });
    const user = userEvent.setup();
    render(<Contact />);

    await fillForm(user);
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /send message/i }));
    });

    expect(screen.getByText('Message Sent')).toBeInTheDocument();
    expect(
      screen.getByText(/thanks for contacting neuracare\. we'll get back to you soon\./i),
    ).toBeInTheDocument();
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

  it('shows inline validation errors and does not submit when fields are empty', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your email/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter a subject/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter a message/i)).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText(/name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.type(screen.getByLabelText(/subject/i), 'Question');
    await user.type(screen.getByLabelText(/message/i), 'How do I book an appointment?');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('validates a minimum message length', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText(/name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Question');
    await user.type(screen.getByLabelText(/message/i), 'short');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('clears a field error once the user edits that field again', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/name/i), 'A');
    expect(screen.queryByText(/please enter your name/i)).not.toBeInTheDocument();
  });

  it('shows a loading state while submitting', async () => {
    let resolveFetch;
    apiFetch.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );
    const user = userEvent.setup();
    render(<Contact />);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();

    await act(async () => {
      resolveFetch({ contact: {} });
    });
  });
});
