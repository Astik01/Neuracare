import { render, screen } from '@testing-library/react';
import PrivacyPolicy from './PrivacyPolicy';

describe('PrivacyPolicy', () => {
  it('renders the title and all numbered sections', () => {
    render(<PrivacyPolicy />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Privacy Policy');
    expect(screen.getByText(/1\. Information We Collect/)).toBeInTheDocument();
    expect(screen.getByText(/5\. Data Retention/)).toBeInTheDocument();
  });
});
