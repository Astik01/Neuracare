import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SymptomResults from './SymptomResults';
import { apiFetch } from '../../api/client';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

const BASE_DOCTORS = {
  doctors: [
    {
      _id: 'doc-1',
      name: 'Dr. Sarah Johnson',
      specialty: 'cardiology',
      specialties: ['Cardiology', 'Internal Medicine'],
      rating: 4.9,
      experience: '15 years',
      fee: '$150',
      availability: 'Available Today',
    },
  ],
};

function renderResults(state) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/symptom-checker/results', state }]}>
      <Routes>
        <Route path="/symptom-checker/results" element={<SymptomResults />} />
        <Route path="/symptom-checker" element={<p>Symptom checker</p>} />
        <Route path="/doctors/:id" element={<p>Doctor profile</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  apiFetch.mockReset();
});

describe('SymptomResults', () => {
  it('redirects back to the symptom checker when there is no result state', () => {
    apiFetch.mockResolvedValueOnce({ doctors: [] });
    renderResults(undefined);

    expect(screen.getByText('Symptom checker')).toBeInTheDocument();
  });

  it('shows possible matches with matching symptoms and the disclaimer', async () => {
    apiFetch.mockResolvedValueOnce(BASE_DOCTORS);
    renderResults({
      results: [{ condition: 'migraine', probability: 82, urgency: 'high', symptoms: ['headache'] }],
      symptoms: ['headache'],
    });

    expect(screen.getByText('migraine')).toBeInTheDocument();
    expect(screen.getByText(/82% match/i)).toBeInTheDocument();
    expect(screen.getByText('headache')).toBeInTheDocument();
    expect(
      screen.getByText(/not a medical diagnosis. consult a qualified healthcare professional/i),
    ).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    expect(screen.getByRole('link', { name: /book appointment/i })).toHaveAttribute(
      'href',
      '/doctors/doc-1',
    );
  });

  it('shows an emergency notice for emergency symptoms', async () => {
    apiFetch.mockResolvedValueOnce({ doctors: [] });
    renderResults({
      results: [{ condition: 'angina', probability: 70, urgency: 'high', symptoms: ['chest pain'] }],
      symptoms: ['chest pain'],
    });

    expect(screen.getByRole('alert')).toHaveTextContent(/seek emergency care/i);
  });

  it('does not show an emergency notice for mild, non-emergency symptoms', () => {
    apiFetch.mockResolvedValueOnce({ doctors: [] });
    renderResults({
      results: [{ condition: 'common cold', probability: 60, urgency: 'low', symptoms: ['cough'] }],
      symptoms: ['cough'],
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
