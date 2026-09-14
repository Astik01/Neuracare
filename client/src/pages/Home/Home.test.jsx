import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { apiFetch } from '../../api/client';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

const SAMPLE_ARTICLE = {
  slug: 'heart-disease',
  title: 'Early Signs of Heart Disease',
  excerpt: 'Know the warning symptoms and when to see a cardiologist.',
  category: 'Heart Health',
  image: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=500&h=320&fit=crop',
};

function mockApi({ doctors = [], articles = [] } = {}) {
  apiFetch.mockImplementation((path) => {
    if (path === '/doctors') return Promise.resolve({ doctors });
    if (path === '/articles') return Promise.resolve({ articles });
    return Promise.reject(new Error(`Unexpected path: ${path}`));
  });
}

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
    mockApi();
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
    mockApi();
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
    mockApi();
    renderHome();

    expect(screen.getByText('Describe symptoms')).toBeInTheDocument();
    expect(screen.getByText('Understand symptoms')).toBeInTheDocument();
    expect(screen.getByText('Find specialist')).toBeInTheDocument();
    expect(screen.getByText('Book appointment')).toBeInTheDocument();
  });

  it('does not present any numbers as unlabeled real-world stats', () => {
    mockApi();
    renderHome();

    expect(screen.queryByText('10K+')).not.toBeInTheDocument();
    expect(screen.queryByText('500+')).not.toBeInTheDocument();
  });

  it('shows skeleton placeholders for the preview sections while loading', () => {
    mockApi();
    renderHome();

    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('shows featured doctors pulled from the API', async () => {
    mockApi({
      doctors: [{ _id: '1', name: 'Dr. Sarah Johnson', specialty: 'cardiology', fee: '$150' }],
    });
    renderHome();

    await waitFor(() => expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument());
  });

  it('shows a health library preview pulled from the API with working links', async () => {
    mockApi({ articles: [SAMPLE_ARTICLE] });
    renderHome();

    await waitFor(() =>
      expect(screen.getByText('Early Signs of Heart Disease')).toBeInTheDocument(),
    );
    expect(apiFetch).toHaveBeenCalledWith('/articles');
    const link = screen.getByRole('link', { name: /read article/i });
    expect(link).toHaveAttribute('href', '/health-library/heart-disease');
  });

  it('does not show the health library section when there are no articles', async () => {
    mockApi();
    renderHome();

    await waitFor(() => expect(apiFetch).toHaveBeenCalledWith('/articles'));
    expect(screen.queryByText('Learn something new about your health')).not.toBeInTheDocument();
  });
});
