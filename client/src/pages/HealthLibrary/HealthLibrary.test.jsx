import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HealthLibrary from './HealthLibrary';

describe('HealthLibrary', () => {
  it('lists all articles with links to their detail pages', () => {
    render(
      <MemoryRouter>
        <HealthLibrary />
      </MemoryRouter>,
    );

    expect(screen.getByText('Early Signs of Heart Disease')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /read article/i })).toHaveLength(3);
    expect(screen.getAllByRole('link', { name: /read article/i })[0]).toHaveAttribute(
      'href',
      '/health-library/heart-disease',
    );
  });
});
