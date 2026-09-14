import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SymptomChecker from './SymptomChecker';
import { apiFetch } from '../../api/client';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

function renderChecker() {
  return render(
    <MemoryRouter initialEntries={['/symptom-checker']}>
      <Routes>
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/symptom-checker/results" element={<p>Results page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function addSymptomAndContinue(user, symptom) {
  await user.type(screen.getByLabelText(/add a symptom/i), symptom);
  await user.click(screen.getByRole('button', { name: /add/i }));
  await user.click(screen.getByRole('button', { name: /continue/i }));
}

beforeEach(() => {
  apiFetch.mockReset();
});

describe('SymptomChecker', () => {
  it('adds and removes symptom tags', async () => {
    const user = userEvent.setup();
    renderChecker();

    await user.type(screen.getByLabelText(/add a symptom/i), 'headache');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByText('headache')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove headache/i }));
    expect(screen.queryByText('headache')).not.toBeInTheDocument();
  });

  it('prevents duplicate symptoms from being added', async () => {
    const user = userEvent.setup();
    renderChecker();

    await user.type(screen.getByLabelText(/add a symptom/i), 'headache');
    await user.click(screen.getByRole('button', { name: /add/i }));
    await user.type(screen.getByLabelText(/add a symptom/i), 'headache');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getAllByText('headache')).toHaveLength(1);
    expect(screen.getByRole('alert')).toHaveTextContent(/already been added/i);
  });

  it('shows a validation message when continuing with no symptoms', async () => {
    const user = userEvent.setup();
    renderChecker();

    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/add at least one symptom/i);
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('walks through the details step before analyzing', async () => {
    const user = userEvent.setup();
    renderChecker();

    await user.type(screen.getByLabelText(/add a symptom/i), 'headache');
    await user.click(screen.getByRole('button', { name: /add/i }));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByText(/how long have you had these symptoms/i)).toBeInTheDocument();
    expect(screen.getByText(/how severe would you say it is/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^back$/i }));
    expect(screen.getByLabelText(/add a symptom/i)).toBeInTheDocument();
  });

  it('shows an analyzing state and navigates to the results page on success', async () => {
    apiFetch.mockResolvedValueOnce({
      results: [{ condition: 'migraine', probability: 82, urgency: 'high', symptoms: ['headache'] }],
    });
    const user = userEvent.setup();
    renderChecker();

    await addSymptomAndContinue(user, 'headache');
    await user.click(screen.getByRole('button', { name: /analyze symptoms/i }));

    expect(screen.getByText(/analyzing your symptoms/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Results page')).toBeInTheDocument(), {
      timeout: 3000,
    });
    expect(apiFetch).toHaveBeenCalledWith('/symptom-check', {
      method: 'POST',
      body: { symptoms: ['headache'] },
    });
  });

  it('shows an error message and returns to details when the API call fails', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Something went wrong. Please try again.'));
    const user = userEvent.setup();
    renderChecker();

    await addSymptomAndContinue(user, 'fever');
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /analyze symptoms/i }));
    });

    await waitFor(
      () => expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i),
      { timeout: 3000 },
    );
    expect(screen.getByRole('button', { name: /analyze symptoms/i })).toBeInTheDocument();
  });
});
