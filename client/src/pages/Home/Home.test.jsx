import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

describe('Home', () => {
  it('renders the headline and both call-to-action links', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /check symptoms/i })).toHaveAttribute(
      'href',
      '/symptom-checker',
    );
    expect(screen.getByRole('link', { name: /find a doctor/i })).toHaveAttribute(
      'href',
      '/find-doctors',
    );
  });
});
