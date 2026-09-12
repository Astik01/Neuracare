import { render, screen } from '@testing-library/react';
import TermsOfService from './TermsOfService';

describe('TermsOfService', () => {
  it('renders the title and all numbered sections', () => {
    render(<TermsOfService />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Terms of Service');
    expect(screen.getByText(/1\. Acceptance/)).toBeInTheDocument();
    expect(screen.getByText(/5\. Limitation of Liability/)).toBeInTheDocument();
  });
});
