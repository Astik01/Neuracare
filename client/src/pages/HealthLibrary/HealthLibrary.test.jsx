import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HealthLibrary from './HealthLibrary';

function renderPage() {
  return render(
    <MemoryRouter>
      <HealthLibrary />
    </MemoryRouter>,
  );
}

describe('HealthLibrary', () => {
  it('lists all articles with links to their detail pages', () => {
    renderPage();

    expect(screen.getAllByText('Early Signs of Heart Disease').length).toBeGreaterThan(0);
    const readLinks = screen.getAllByRole('link', { name: /read article/i });
    expect(readLinks.length).toBeGreaterThan(0);
  });

  it('shows a featured article when browsing with no filters', () => {
    renderPage();

    expect(screen.getByText('Featured Article')).toBeInTheDocument();
    expect(screen.getByText('Latest Articles')).toBeInTheDocument();
  });

  it('filters articles by search text', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/search articles/i), 'migraine');

    expect(screen.getByText(/article.*found/i)).toBeInTheDocument();
    expect(screen.getAllByText('Understanding Migraines').length).toBeGreaterThan(0);
    expect(screen.queryByText('Building a Balanced Plate: Nutrition Basics')).not.toBeInTheDocument();
  });

  it('filters articles by category', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Skin' }));

    expect(screen.getAllByText('When to See a Dermatologist').length).toBeGreaterThan(0);
    expect(screen.queryByText('Understanding Migraines')).not.toBeInTheDocument();
  });

  it('shows an empty state with a working Clear Search button', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/search articles/i), 'zzz-no-such-article');

    expect(screen.getByText('No articles found.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear search/i }));

    expect(screen.queryByText('No articles found.')).not.toBeInTheDocument();
    expect(screen.getByText('Featured Article')).toBeInTheDocument();
  });

  it('combines search and category filters', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'General Health' }));
    await user.type(screen.getByLabelText(/search articles/i), 'flu');

    expect(screen.getAllByText('Common Cold vs. Flu: Know the Difference').length).toBeGreaterThan(0);
    expect(screen.queryByText('Everyday Diabetes Management Tips')).not.toBeInTheDocument();
  });
});
