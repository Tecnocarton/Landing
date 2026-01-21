'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from './cn';

const FlipWords = memo(({
  words,
  duration = 3000,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const startAnimation = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    setIsAnimating(true);
  }, [words.length]);

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation]);

  // For screen readers - render all words
  const allWordsForA11y = words.join(', ');

  return (
    <span className={cn('relative inline-block', className)}>
      {/* Hidden text for screen readers */}
      <span
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {allWordsForA11y}
      </span>

      <AnimatePresence
        mode="wait"
        onExitComplete={() => setIsAnimating(false)}
      >
        <motion.span
          key={words[currentIndex]}
          initial={prefersReducedMotion ? { opacity: 1 } : {
            opacity: 0,
            y: 10,
            rotateX: 90,
            filter: 'blur(8px)',
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
          }}
          exit={prefersReducedMotion ? { opacity: 0 } : {
            opacity: 0,
            y: -10,
            rotateX: -90,
            filter: 'blur(8px)',
          }}
          transition={{
            duration: prefersReducedMotion ? 0.1 : 0.4,
            ease: 'easeInOut',
          }}
          style={{
            display: 'inline-block',
            color: 'var(--color-accent, #E67635)',
          }}
          aria-hidden="true"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

FlipWords.displayName = 'FlipWords';

export { FlipWords };
