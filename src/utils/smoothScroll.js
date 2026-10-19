let activeAnimation = null;

export function smoothScrollTo(target, offset = 0, duration = 900) {
  if (!target) return;

  // Cancel an animation that is already running.
  if (activeAnimation !== null) {
    cancelAnimationFrame(activeAnimation);
    activeAnimation = null;
  }

  const startY = window.scrollY;
  const targetY = Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - offset,
  );

  const distance = targetY - startY;

  if (Math.abs(distance) < 2) return;

  let startTime = null;

  const animate = (timestamp) => {
    if (startTime === null) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-in-out cubic curve.
    const eased =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      activeAnimation = requestAnimationFrame(animate);
    } else {
      activeAnimation = null;
    }
  };

  activeAnimation = requestAnimationFrame(animate);
}
