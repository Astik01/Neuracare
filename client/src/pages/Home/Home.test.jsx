import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { apiFetch } from '../../api/client';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  apiFetch.mockReset();
});

describe('Home', () => {
  it('renders the headline and both call-to-action links', () => {
    apiFetch.mockResolvedValueOnce({ doctors: [] });
    renderHome();

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    const checkSymptomsLinks = screen.getAllByRole('link', { name: /check symptoms/i });
    expect(checkSymptomsLinks.some((link) => link.getAttribute('href') === '/symptom-checker')).toBe(
      true,
    );
    const findDoctorLinks = screen.getAllByRole('link', { name: /find a doctor/i });
    expect(findDoctorLinks.some((link) => link.getAttribute('href') === '/find-doctors')).toBe(true);
  });

  it('renders the quick actions with functional links', () => {
    apiFetch.mockResolvedValueOnce({ doctors: [] });
    renderHome();

    expect(screen.getByRole('link', { name: /my appointments/i })).toHaveAttribute(
      'href',
      '/my-bookings',
    );
    expect(screen.getByRole('link', { name: /health library/i })).toHaveAttribute(
      'href',
      '/health-library',
    );
  });

  it('renders all four how-it-works steps', () => {
    apiFetch.mockResolvedValueOnce({ doctors: [] });
    renderHome();

    expect(screen.getByText('Describe symptoms')).toBeInTheDocument();
    expect(screen.getByText('Understand symptoms')).toBeInTheDocument();
    expect(screen.getByText('Find specialist')).toBeInTheDocument();
    expect(screen.getByText('Book appointment')).toBeInTheDocument();
  });

  it('does not present any numbers as unlabeled real-world stats', () => {
    apiFetch.mockResolvedValueOnce({ doctors: [] });
    renderHome();

    expect(screen.queryByText('10K+')).not.toBeInTheDocument();
    expect(screen.queryByText('500+')).not.toBeInTheDocument();
  });

  it('shows featured doctors pulled from the API', async () => {
    apiFetch.mockResolvedValueOnce({
      doctors: [{ _id: '1', name: 'Dr. Sarah Johnson', specialty: 'cardiology', fee: '$150' }],
    });
    renderHome();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
  });

  it('shows a health library preview with working links', () => {
    apiFetch.mockResolvedValueOnce({ doctors: [] });
    renderHome();

    const link = screen.getAllByRole('link', { name: /read article/i })[0];
    expect(link).toHaveAttribute('href', expect.stringContaining('/health-library/'));
  });
});
