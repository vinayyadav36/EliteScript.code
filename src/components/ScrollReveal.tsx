import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  id?: string;
}

/**
 * A highly polished, scroll-triggered fade-and-lift transition container.
 * Uses custom cubic-bezier easing [0.16, 1, 0.3, 1] (Ultra-premium, fast start with long deceleration)
 * to maintain SALTEDHASH's calm, engineering-driven, and futuristic brand feeling.
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  yOffset = 30,
  duration = 0.8,
  id
}: ScrollRevealProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px 0px -100px 0px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
