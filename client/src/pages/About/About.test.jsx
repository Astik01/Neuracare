import { render, screen } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('renders the heading', () => {
    render(<About />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/transforming healthcare/i);
  });
});
