import { useRef } from 'react';

const MAX_TILT_DEG = 8;

export function useTilt() {
  const ref = useRef(null);

  function handleMouseMove(event) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(1000px) rotateX(${(-y * MAX_TILT_DEG).toFixed(2)}deg) rotateY(${(x * MAX_TILT_DEG).toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  function handleMouseLeave() {
    const node = ref.current;
    if (!node) return;
    node.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }

  return { ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
}
