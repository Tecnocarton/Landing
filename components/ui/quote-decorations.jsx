'use client'

import { useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

const SHAPES = [
  { id: 's1', type: 'box',      top: '8%',  left: '6%',  size: 90,  depth: 0.4,  rotate: [-12, 18], color: 'rgba(255,255,255,0.10)', mobileHide: false },
  { id: 's2', type: 'triangle', top: '18%', left: '85%', size: 70,  depth: 0.7,  rotate: [25, -20], color: 'rgba(230,118,53,0.22)',  mobileHide: false },
  { id: 's3', type: 'box',      top: '70%', left: '4%',  size: 110, depth: 0.55, rotate: [10, -15], color: 'rgba(255,255,255,0.08)', mobileHide: true  },
  { id: 's4', type: 'circle',   top: '55%', left: '90%', size: 60,  depth: 0.85, rotate: [0, 0],    color: 'rgba(242,149,89,0.25)',  mobileHide: false },
  { id: 's5', type: 'lines',    top: '38%', left: '48%', size: 140, depth: 0.3,  rotate: [-8, 8],   color: 'rgba(255,255,255,0.07)', mobileHide: true  },
  { id: 's6', type: 'triangle', top: '85%', left: '68%', size: 50,  depth: 0.9,  rotate: [-30, 15], color: 'rgba(255,255,255,0.12)', mobileHide: true  },
  { id: 's7', type: 'box',      top: '40%', left: '92%', size: 50,  depth: 0.65, rotate: [15, -10], color: 'rgba(230,118,53,0.18)',  mobileHide: true  },
];

function ShapeSvg({ type, color }) {
  switch (type) {
    case 'box':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
          <path
            d="M20 30 L50 15 L80 30 L80 75 L50 90 L20 75 Z"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
          <path d="M20 30 L50 45 L80 30" stroke={color} strokeWidth="2" fill="none" />
          <path d="M50 45 L50 90" stroke={color} strokeWidth="2" fill="none" />
        </svg>
      );
    case 'triangle':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
          <polygon points="50,10 90,85 10,85" stroke={color} strokeWidth="2.5" fill="none" />
        </svg>
      );
    case 'circle':
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
          <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="2.5" fill="none" />
          <circle cx="50" cy="50" r="22" stroke={color} strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 'lines':
      return (
        <svg viewBox="0 0 140 140" width="100%" height="100%" fill="none">
          {[15, 35, 55, 75, 95, 115].map((y) => (
            <path
              key={y}
              d={`M5 ${y} Q35 ${y - 8} 70 ${y} T135 ${y}`}
              stroke={color}
              strokeWidth="1.5"
              fill="none"
            />
          ))}
        </svg>
      );
    default:
      return null;
  }
}

function Shape({ shape, scrollY, mouseX, mouseY }) {
  const yScroll = useTransform(scrollY, [0, 1], [shape.depth * 90, shape.depth * -90]);
  const yMouse = useTransform(mouseY, [-1, 1], [-15 * shape.depth, 15 * shape.depth]);
  const y = useTransform([yScroll, yMouse], ([a, b]) => a + b);
  const rotate = useTransform(scrollY, [0, 1], shape.rotate);
  const x = useTransform(mouseX, [-1, 1], [-25 * shape.depth, 25 * shape.depth]);

  return (
    <motion.div
      data-mobile-hide={shape.mobileHide ? 'true' : undefined}
      style={{
        position: 'absolute',
        top: shape.top,
        left: shape.left,
        width: shape.size,
        height: shape.size,
        x,
        y,
        rotate,
        willChange: 'transform',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <ShapeSvg type={shape.type} color={shape.color} />
    </motion.div>
  );
}

export function QuoteSectionDecorations({ sectionRef }) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (reduceMotion) return;
    const node = sectionRef?.current;
    if (!node) return;

    const handleMouseMove = (e) => {
      const rect = node.getBoundingClientRect();
      mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [sectionRef, reduceMotion, mouseX, mouseY]);

  if (reduceMotion) return null;

  return (
    <div className="quote-decoration-layer" aria-hidden="true">
      {SHAPES.map((s) => (
        <Shape
          key={s.id}
          shape={s}
          scrollY={scrollYProgress}
          mouseX={smoothX}
          mouseY={smoothY}
        />
      ))}
    </div>
  );
}
