import { act, renderHook } from '@testing-library/react';
import { useDarkMode } from './useDarkMode';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('useDarkMode', () => {
  it('starts disabled with no stored preference', () => {
    const { result } = renderHook(() => useDarkMode());
    const [isDark] = result.current;

    expect(isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles the dark class on <html> and persists the preference', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('neuracare_dark_mode')).toBe('true');
  });

  it('starts enabled when a stored preference says so', () => {
    localStorage.setItem('neuracare_dark_mode', 'true');

    const { result } = renderHook(() => useDarkMode());

    expect(result.current[0]).toBe(true);
  });
});
