import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SymptomChecker from './SymptomChecker';
import { apiFetch } from '../../api/client';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

beforeEach(() => {
  apiFetch.mockReset();
});

describe('SymptomChecker', () => {
  it('adds and removes symptom tags', async () => {
    const user = userEvent.setup();
    render(<SymptomChecker />);

    await user.type(screen.getByLabelText(/add a symptom/i), 'headache');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByText('headache')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove headache/i }));
    expect(screen.queryByText('headache')).not.toBeInTheDocument();
  });

  it('shows a validation message when analyzing with no symptoms', async () => {
    const user = userEvent.setup();
    render(<SymptomChecker />);

    await user.click(screen.getByRole('button', { name: /analyze symptoms/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/add at least one symptom/i);
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('displays ranked results after a successful analysis', async () => {
    apiFetch.mockResolvedValueOnce({
      results: [{ condition: 'migraine', probability: 82, urgency: 'high', symptoms: ['headache'] }],
    });
    const user = userEvent.setup();
    render(<SymptomChecker />);

    await user.type(screen.getByLabelText(/add a symptom/i), 'headache');
    await user.click(screen.getByRole('button', { name: /add/i }));
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /analyze symptoms/i }));
    });

    expect(screen.getByText('migraine')).toBeInTheDocument();
    expect(screen.getByText(/82% match/i)).toBeInTheDocument();
  });

  it('shows an error message when the API call fails', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Something went wrong. Please try again.'));
    const user = userEvent.setup();
    render(<SymptomChecker />);

    await user.type(screen.getByLabelText(/add a symptom/i), 'fever');
    await user.click(screen.getByRole('button', { name: /add/i }));
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /analyze symptoms/i }));
    });

    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
  });
});
