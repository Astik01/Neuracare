import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HelpCentre from './HelpCentre';

describe('HelpCentre', () => {
  it('renders FAQ categories with collapsed answers', () => {
    render(<HelpCentre />);

    expect(screen.getByText('Billing')).toBeInTheDocument();
    expect(screen.getByText('How do I pay for a consultation?')).toBeInTheDocument();
    expect(screen.queryByText(/invoices are sent to your email/i)).not.toBeInTheDocument();
  });

  it('expands an answer on click', async () => {
    const user = userEvent.setup();
    render(<HelpCentre />);

    await user.click(screen.getByText('How do I pay for a consultation?'));

    expect(screen.getByText(/invoices are sent to your email/i)).toBeInTheDocument();
  });

  it('filters questions by search text', async () => {
    const user = userEvent.setup();
    render(<HelpCentre />);

    await user.type(screen.getByLabelText(/search faqs/i), 'prescriptions');

    expect(screen.getByText('Can I get prescriptions online?')).toBeInTheDocument();
    expect(screen.queryByText('How do I reset my password?')).not.toBeInTheDocument();
  });

  it('shows a no-results message when nothing matches', async () => {
    const user = userEvent.setup();
    render(<HelpCentre />);

    await user.type(screen.getByLabelText(/search faqs/i), 'zzz-no-match-zzz');

    expect(screen.getByText(/no faqs match your search/i)).toBeInTheDocument();
  });
});
