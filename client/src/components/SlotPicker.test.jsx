import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SlotPicker from './SlotPicker';

describe('SlotPicker', () => {
  it('shows Today selected by default with its time slots', () => {
    render(<SlotPicker selected={null} onSelect={jest.fn()} />);

    expect(screen.getByRole('tab', { name: 'Today' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel').querySelectorAll('button').length).toBeGreaterThan(0);
  });

  it('switches days and shows that day\'s slots', async () => {
    const user = userEvent.setup();
    render(<SlotPicker selected={null} onSelect={jest.fn()} />);

    await user.click(screen.getByRole('tab', { name: 'Tomorrow' }));

    expect(screen.getByRole('tab', { name: 'Tomorrow' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Today' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onSelect with the date and time when a slot is clicked', async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();
    render(<SlotPicker selected={null} onSelect={onSelect} />);

    const firstSlotButton = screen.getByRole('tabpanel').querySelector('button');
    await user.click(firstSlotButton);

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ time: firstSlotButton.textContent }),
    );
  });

  it('disables slots marked as already taken', () => {
    render(<SlotPicker selected={null} onSelect={jest.fn()} alreadyTaken={[]} daysCount={1} />);

    const buttons = screen.getByRole('tabpanel').querySelectorAll('button');
    buttons.forEach((button) => expect(button).not.toBeDisabled());
  });
});
