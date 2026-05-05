'use client'

import { motion, useReducedMotion } from 'framer-motion';

const ORBS = [
  {
    id: 'o1',
    color: 'rgba(100,190,230,0.45)',
    width: 500,
    height: 500,
    top: '-20%',
    left: '-6%',
    blur: 90,
    animY: ['0px', '35px', '-20px', '0px'],
    animX: ['0px', '25px', '-15px', '0px'],
    duration: 13,
  },
  {
    id: 'o2',
    color: 'rgba(230,118,53,0.40)',
    width: 380,
    height: 380,
    top: '15%',
    left: '78%',
    blur: 80,
    animY: ['0px', '-30px', '18px', '0px'],
    animX: ['0px', '-22px', '12px', '0px'],
    duration: 16,
  },
  {
    id: 'o3',
    color: 'rgba(210,235,245,0.22)',
    width: 650,
    height: 280,
    top: '-10%',
    left: '25%',
    blur: 120,
    animY: ['0px', '15px', '0px'],
    animX: ['0px', '20px', '0px'],
    duration: 20,
  },
];

function Orb({ orb }) {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ y: orb.animY, x: orb.animX }}
      transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        top: orb.top,
        left: orb.left,
        width: orb.width,
        height: orb.height,
        borderRadius: '50%',
        background: orb.color,
        filter: `blur(${orb.blur}px)`,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    />
  );
}

export function SectionBeams() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {!reduceMotion && ORBS.map((o) => <Orb key={o.id} orb={o} />)}
    </div>
  );
}
