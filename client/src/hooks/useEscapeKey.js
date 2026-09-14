import { useEffect } from 'react';

export function useEscapeKey(isActive, onEscape) {
  useEffect(() => {
    if (!isActive) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onEscape();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onEscape]);
}
