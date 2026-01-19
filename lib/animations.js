/**
 * Animation Variants for Framer Motion
 * Centralized animation configurations for consistency
 */

// Basic fade in with upward motion
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

// Staggered container for child animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

// Scale in animation
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

// Slide in from left
export const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

// Slide in from right
export const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
};

// Fade in only (no movement)
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

// Spring transition config
export const springTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 20
};

// Smooth transition config
export const smoothTransition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier
};

// Hover effects
export const hoverLift = {
  y: -8,
  boxShadow: '0 20px 40px rgba(46,106,128,0.15)'
};

export const hoverScale = {
  scale: 1.02
};

// Tap effects
export const tapScale = {
  scale: 0.98
};
