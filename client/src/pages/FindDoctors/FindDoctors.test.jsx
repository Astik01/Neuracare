import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FindDoctors from './FindDoctors';
import { apiFetch } from '../../api/client';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

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
  it('renders the doctor list once loaded', async () => {
    apiFetch.mockResolvedValueOnce({
      count: 1,
      doctors: [{ _id: '1', name: 'Dr. Sarah Johnson', specialty: 'cardiology', fee: '$150' }],
    });

    renderPage();

    expect(screen.getByText(/loading doctors/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
  });

  it('shows an empty state when no doctors match', async () => {
    apiFetch.mockResolvedValueOnce({ count: 0, doctors: [] });

    renderPage();

    await waitFor(() =>
      expect(screen.getByText(/no doctors match that specialty/i)).toBeInTheDocument(),
    );
  });

  it('shows an error message when the request fails', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Failed to fetch doctors'));

    renderPage();

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch doctors'));
  });

  it('handles a malformed response without doctors gracefully', async () => {
    apiFetch.mockResolvedValueOnce({});

    renderPage();

    await waitFor(() =>
      expect(screen.getByText(/no doctors match that specialty/i)).toBeInTheDocument(),
    );
  });
});
