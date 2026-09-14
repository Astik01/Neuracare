import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import FindDoctors from './FindDoctors';
import { apiFetch } from '../../api/client';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

const DOCTORS = [
  {
    _id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'cardiology',
    specialties: ['Cardiology'],
    rating: 4.9,
    experience: '15 years',
    fee: '$150',
    availability: 'Available Today',
  },
  {
    _id: '2',
    name: 'Dr. James Patel',
    specialty: 'general practice',
    specialties: ['General Practice'],
    rating: 4.6,
    experience: '8 years',
    fee: '$80',
    availability: 'Available Tomorrow',
  },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <FindDoctors />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  apiFetch.mockReset();
});

describe('FindDoctors', () => {
  it('shows skeleton cards while loading', () => {
    apiFetch.mockResolvedValueOnce({ doctors: [] });
    renderPage();

    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders the doctor list once loaded', async () => {
    apiFetch.mockResolvedValueOnce({ count: 2, doctors: DOCTORS });

    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    expect(screen.getByText('Dr. James Patel')).toBeInTheDocument();
  });

  it('filters doctors by search', async () => {
    apiFetch.mockResolvedValueOnce({ doctors: DOCTORS });
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    await user.type(screen.getByLabelText(/search by name/i), 'James');

    expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
    expect(screen.getByText('Dr. James Patel')).toBeInTheDocument();
  });

  it('sorts by fee low to high', async () => {
    apiFetch.mockResolvedValueOnce({ doctors: DOCTORS });
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    await user.selectOptions(screen.getByLabelText(/sort by/i), 'fee');

    const names = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(names).toEqual(['Dr. James Patel', 'Dr. Sarah Johnson']);
  });

  it('shows an empty state with a working clear filters button', async () => {
    apiFetch.mockResolvedValueOnce({ doctors: DOCTORS });
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    await user.type(screen.getByLabelText(/search by name/i), 'zzz-no-match');

    expect(screen.getByText(/no doctors match your current filters/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
  });

  it('shows an error state with a retry button that refetches', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Network down'));
    renderPage();

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Network down'));

    apiFetch.mockResolvedValueOnce({ doctors: DOCTORS });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
  });

  it('opens the mobile filter drawer', async () => {
    apiFetch.mockResolvedValueOnce({ doctors: DOCTORS });
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /^filters$/i }));

    const dialog = screen.getByRole('dialog', { name: /filter doctors/i });
    expect(within(dialog).getByLabelText(/specialty/i)).toBeInTheDocument();
  });

  it('closes the mobile filter drawer on Escape', async () => {
    apiFetch.mockResolvedValueOnce({ doctors: DOCTORS });
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /^filters$/i }));
    expect(screen.getByRole('dialog', { name: /filter doctors/i })).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: /filter doctors/i })).not.toBeInTheDocument();
  });

  it('links each card to view profile and book appointment', async () => {
    apiFetch.mockResolvedValueOnce({ doctors: DOCTORS });
    renderPage();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
    const links = screen.getAllByRole('link', { name: /book appointment/i });
    expect(links[0]).toHaveAttribute('href', '/doctors/1');
  });
});
