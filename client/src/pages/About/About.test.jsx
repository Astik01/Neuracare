import { render, screen } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('renders the heading and founding stats', () => {
    render(<About />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/transforming healthcare/i);
    expect(screen.getByText('2019')).toBeInTheDocument();
    expect(screen.getByText('500+')).toBeInTheDocument();
  });
});
