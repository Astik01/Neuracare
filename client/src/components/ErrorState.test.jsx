import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorState from './ErrorState';

describe('ErrorState', () => {
  it('renders the default message', () => {
    render(<ErrorState />);
    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
  });

  it('renders a custom message', () => {
    render(<ErrorState message="Custom failure message" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Custom failure message');
  });

  it('calls onRetry when Try Again is clicked', async () => {
    const onRetry = jest.fn();
    const user = userEvent.setup();
    render(<ErrorState onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(onRetry).toHaveBeenCalled();
  });

  it('does not render a retry button when onRetry is not provided', () => {
    render(<ErrorState />);
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });
});
