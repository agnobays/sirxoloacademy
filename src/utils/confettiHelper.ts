import confetti from "canvas-confetti";

/**
 * Fires a high-energy full-screen celebration with twin cannons and top fireworks
 */
export function triggerFullScreenConfetti() {
  if (typeof window === "undefined") return;

  const vibrantColors = [
    "#4F46E5", // Indigo
    "#10B981", // Emerald
    "#F59E0B", // Amber Gold
    "#F43F5E", // Rose Pink
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#E11D48", // Crimson
    "#FACC15", // Bright Yellow
  ];

  // 1. Left cannon firing up and across
  confetti({
    particleCount: 100,
    angle: 60,
    spread: 75,
    origin: { x: 0, y: 0.65 },
    colors: vibrantColors,
    startVelocity: 55,
  });

  // 2. Right cannon firing up and across
  confetti({
    particleCount: 100,
    angle: 120,
    spread: 75,
    origin: { x: 1, y: 0.65 },
    colors: vibrantColors,
    startVelocity: 55,
  });

  // 3. Center burst raining down like fireworks
  setTimeout(() => {
    confetti({
      particleCount: 140,
      spread: 120,
      origin: { x: 0.5, y: 0.35 },
      colors: vibrantColors,
      startVelocity: 45,
      gravity: 0.8,
    });
  }, 160);

  // 4. Secondary shimmer burst
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 90,
      spread: 90,
      origin: { x: 0.5, y: 0.55 },
      colors: vibrantColors,
    });
  }, 320);
}
