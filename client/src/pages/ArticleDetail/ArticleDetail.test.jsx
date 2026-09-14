import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ArticleDetail from './ArticleDetail';

function renderAt(slug) {
  return render(
    <MemoryRouter initialEntries={[`/health-library/${slug}`]}>
      <Routes>
        <Route path="/health-library/:slug" element={<ArticleDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ArticleDetail', () => {
  it('renders the article content for a known slug', () => {
    renderAt('migraines');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Understanding Migraines');
    expect(screen.getByText(/Dr. Emily Rodriguez/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /find a doctor/i })).toBeInTheDocument();
  });

  it('shows category, reading time, hero image, and the disclaimer', () => {
    renderAt('migraines');

    expect(screen.getAllByText('General Health').length).toBeGreaterThan(0);
    expect(screen.getByText(/min read/i)).toBeInTheDocument();
    expect(document.querySelectorAll('img').length).toBeGreaterThan(0);
    expect(
      screen.getByText(/for general health information only and is not medical advice/i),
    ).toBeInTheDocument();
  });

  it('shows related articles excluding the current one', () => {
    renderAt('cold-vs-flu');

    const relatedSection = screen.getByText('Related Articles').closest('div');
    expect(within(relatedSection).queryByText('Common Cold vs. Flu: Know the Difference')).not.toBeInTheDocument();
    expect(within(relatedSection).getAllByRole('link', { name: /read article/i }).length).toBeGreaterThan(0);
  });

  it('shows a not-found message for an unknown slug', () => {
    renderAt('not-a-real-article');

    expect(screen.getByText(/article not found/i)).toBeInTheDocument();
  });
});
