import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HealthLibrary from './HealthLibrary';
import { apiFetch } from '../../api/client';
import { articles as staticArticles } from '../../data/articles';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

function renderPage() {
  return render(
    <MemoryRouter>
      <HealthLibrary />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  apiFetch.mockReset();
});

async function renderLoaded() {
  apiFetch.mockResolvedValueOnce({ articles: staticArticles });
  renderPage();
  await waitFor(() => expect(screen.getByText('Featured Article')).toBeInTheDocument());
}

describe('HealthLibrary', () => {
  it('shows skeleton cards while loading', () => {
    apiFetch.mockResolvedValueOnce({ articles: staticArticles });
    renderPage();

    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('fetches articles from the API and lists them with links to their detail pages', async () => {
    await renderLoaded();

    expect(apiFetch).toHaveBeenCalledWith('/articles');
    expect(screen.getAllByText('Early Signs of Heart Disease').length).toBeGreaterThan(0);
    const readLinks = screen.getAllByRole('link', { name: /read article/i });
    expect(readLinks.length).toBeGreaterThan(0);
  });

  it('shows a featured article when browsing with no filters', async () => {
    await renderLoaded();

    expect(screen.getByText('Featured Article')).toBeInTheDocument();
    expect(screen.getByText('Latest Articles')).toBeInTheDocument();
  });

  it('filters articles by search text', async () => {
    const user = userEvent.setup();
    await renderLoaded();

    await user.type(screen.getByLabelText(/search articles/i), 'migraine');

    expect(screen.getByText(/article.*found/i)).toBeInTheDocument();
    expect(screen.getAllByText('Understanding Migraines').length).toBeGreaterThan(0);
    expect(screen.queryByText('Building a Balanced Plate: Nutrition Basics')).not.toBeInTheDocument();
  });

  it('filters articles by category', async () => {
    const user = userEvent.setup();
    await renderLoaded();

    await user.click(screen.getByRole('button', { name: 'Skin' }));

    expect(screen.getAllByText('When to See a Dermatologist').length).toBeGreaterThan(0);
    expect(screen.queryByText('Understanding Migraines')).not.toBeInTheDocument();
  });

  it('shows an empty state with a working Clear Search button', async () => {
    const user = userEvent.setup();
    await renderLoaded();

    await user.type(screen.getByLabelText(/search articles/i), 'zzz-no-such-article');

    expect(screen.getByText('No articles found.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear search/i }));

    expect(screen.queryByText('No articles found.')).not.toBeInTheDocument();
    expect(screen.getByText('Featured Article')).toBeInTheDocument();
  });

  it('shows an error state with a retry button that refetches', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Network down'));
    renderPage();

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Network down'));

    apiFetch.mockResolvedValueOnce({ articles: staticArticles });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() => expect(screen.getByText('Featured Article')).toBeInTheDocument());
  });
});
