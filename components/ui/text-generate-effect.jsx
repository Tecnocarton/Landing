'use client';

import { memo, useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from './cn';

const TextGenerateEffect = memo(({
  words,
  className,
  filter = true,
  duration = 0.5,
  staggerDelay = 0.08,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const wordsArray = words.split(' ');

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const renderWords = () => {
    return (
      <span ref={ref}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              initial={{
                opacity: prefersReducedMotion ? 1 : 0,
                filter: prefersReducedMotion || !filter ? 'blur(0px)' : 'blur(10px)',
              }}
              animate={hasAnimated ? {
                opacity: 1,
                filter: 'blur(0px)',
              } : {
                opacity: prefersReducedMotion ? 1 : 0,
                filter: prefersReducedMotion || !filter ? 'blur(0px)' : 'blur(10px)',
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : duration,
                delay: prefersReducedMotion ? 0 : idx * staggerDelay,
                ease: 'easeOut',
              }}
              style={{
                display: 'inline-block',
                marginRight: '0.25em',
              }}
            >
              {word}
            </motion.span>
          );
        })}
      </span>
    );
  };

  return (
    <span className={cn(className)}>
      {renderWords()}
    </span>
  );
});

TextGenerateEffect.displayName = 'TextGenerateEffect';

export { TextGenerateEffect };
