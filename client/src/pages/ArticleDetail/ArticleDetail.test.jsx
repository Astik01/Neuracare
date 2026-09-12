import { render, screen } from '@testing-library/react';
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

  it('shows a not-found message for an unknown slug', () => {
    renderAt('not-a-real-article');

    expect(screen.getByText(/article not found/i)).toBeInTheDocument();
  });
});
