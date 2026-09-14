import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ArticleDetail from './ArticleDetail';
import { apiFetch } from '../../api/client';
import { articles as staticArticles, getArticleBySlug } from '../../data/articles';

jest.mock('../../api/client', () => ({ apiFetch: jest.fn() }));

function renderAt(slug) {
  return render(
    <MemoryRouter initialEntries={[`/health-library/${slug}`]}>
      <Routes>
        <Route path="/health-library/:slug" element={<ArticleDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  apiFetch.mockReset();
});

function mockSuccess(slug) {
  const article = getArticleBySlug(slug);
  apiFetch.mockImplementation((path) => {
    if (path === `/articles/${slug}`) return Promise.resolve({ article });
    if (path === '/articles') return Promise.resolve({ articles: staticArticles });
    return Promise.reject(new Error(`Unexpected path: ${path}`));
  });
}

describe('ArticleDetail', () => {
  it('shows a loading skeleton before data arrives', () => {
    mockSuccess('migraines');
    renderAt('migraines');

    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('fetches and renders the article content for a known slug', async () => {
    mockSuccess('migraines');
    renderAt('migraines');

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Understanding Migraines'),
    );
    expect(screen.getByText(/Dr. Emily Rodriguez/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /find a doctor/i })).toBeInTheDocument();
    expect(apiFetch).toHaveBeenCalledWith('/articles/migraines');
  });

  it('shows category, reading time, hero image, and the disclaimer', async () => {
    mockSuccess('migraines');
    renderAt('migraines');

    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument());
    expect(screen.getAllByText('General Health').length).toBeGreaterThan(0);
    expect(screen.getByText(/min read/i)).toBeInTheDocument();
    expect(document.querySelectorAll('img').length).toBeGreaterThan(0);
    expect(
      screen.getByText(/for general health information only and is not medical advice/i),
    ).toBeInTheDocument();
  });

  it('shows related articles excluding the current one', async () => {
    mockSuccess('cold-vs-flu');
    renderAt('cold-vs-flu');

    await waitFor(() => expect(screen.getByText('Related Articles')).toBeInTheDocument());
    const relatedSection = screen.getByText('Related Articles').closest('div');
    expect(
      within(relatedSection).queryByText('Common Cold vs. Flu: Know the Difference'),
    ).not.toBeInTheDocument();
    expect(within(relatedSection).getAllByRole('link', { name: /read article/i }).length).toBeGreaterThan(0);
  });

  it('shows a not-found message for an unknown slug (404 from the API)', async () => {
    const notFound = new Error('Article not found');
    notFound.status = 404;
    apiFetch.mockRejectedValue(notFound);

    renderAt('not-a-real-article');

    await waitFor(() => expect(screen.getByText(/article not found/i)).toBeInTheDocument());
  });

  it('shows a retryable error state on a non-404 failure', async () => {
    apiFetch.mockRejectedValue(new Error('Network down'));
    renderAt('migraines');

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Network down'));

    mockSuccess('migraines');
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /try again/i }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Understanding Migraines'),
    );
  });
});
