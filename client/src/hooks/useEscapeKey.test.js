import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEscapeKey } from './useEscapeKey';

describe('useEscapeKey', () => {
  it('calls onEscape when Escape is pressed while active', async () => {
    const onEscape = jest.fn();
    const user = userEvent.setup();
    renderHook(() => useEscapeKey(true, onEscape));

    await user.keyboard('{Escape}');

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('does not call onEscape when inactive', async () => {
    const onEscape = jest.fn();
    const user = userEvent.setup();
    renderHook(() => useEscapeKey(false, onEscape));

    await user.keyboard('{Escape}');

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('does not call onEscape for other keys', async () => {
    const onEscape = jest.fn();
    const user = userEvent.setup();
    renderHook(() => useEscapeKey(true, onEscape));

    await user.keyboard('{Enter}');

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('stops listening after unmount', async () => {
    const onEscape = jest.fn();
    const user = userEvent.setup();
    const { unmount } = renderHook(() => useEscapeKey(true, onEscape));

    unmount();
    await user.keyboard('{Escape}');

    expect(onEscape).not.toHaveBeenCalled();
  });
});
