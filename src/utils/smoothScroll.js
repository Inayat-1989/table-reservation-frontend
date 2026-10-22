let activeAnimation = null;

export function smoothScrollTo(target, offset = 0, duration = 900, onComplete) {
  if (!target) return;

  if (activeAnimation !== null) {
    cancelAnimationFrame(activeAnimation);
    activeAnimation = null;
  }

  const startY = window.scrollY;
  let startTime = null;

  const getTargetY = () =>
    Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);

  const animate = (timestamp) => {
    if (!target.isConnected) {
      activeAnimation = null;
      return;
    }

    if (startTime === null) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const eased =
      progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    // Recalculate because content above the target may have changed height.
    const currentTargetY = getTargetY();
    const nextY = startY + (currentTargetY - startY) * eased;

    window.scrollTo(0, nextY);

    if (progress < 1) {
      activeAnimation = requestAnimationFrame(animate);
    } else {
      // Correct any remaining difference at the end.
      window.scrollTo(0, getTargetY());
      activeAnimation = null;
      onComplete?.();
    }
  };

  activeAnimation = requestAnimationFrame(animate);
}
