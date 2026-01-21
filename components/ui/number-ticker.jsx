'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { useSpring, useTransform, motion, useInView, useMotionValueEvent } from 'framer-motion';
import { cn } from './cn';

const NumberTicker = memo(({
  value,
  direction = 'up',
  delay = 0,
  className,
  decimalPlaces = 0,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const [displayNumber, setDisplayNumber] = useState(direction === 'down' ? value : 0);

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const motionValue = useSpring(direction === 'down' ? value : 0, {
    damping: 50,
    stiffness: 80,
  });

  // Listen to motion value changes and update display
  useMotionValueEvent(motionValue, 'change', (latest) => {
    setDisplayNumber(Math.round(latest));
  });

  useEffect(() => {
    if (isInView) {
      if (prefersReducedMotion) {
        motionValue.set(direction === 'down' ? 0 : value);
      } else {
        const timer = setTimeout(() => {
          motionValue.set(direction === 'down' ? 0 : value);
        }, delay * 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isInView, motionValue, direction, value, delay, prefersReducedMotion]);

  const formattedNumber = Intl.NumberFormat('es-CL', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(displayNumber);

  return (
    <span
      ref={ref}
      className={cn(
        'inline-block tabular-nums',
        className
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {formattedNumber}
    </span>
  );
});

NumberTicker.displayName = 'NumberTicker';

export { NumberTicker };
