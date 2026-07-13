import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

interface EmptyCartStateProps {
  onClose: () => void;
}

export default function EmptyCartState({ onClose }: EmptyCartStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-24 px-6 h-full space-y-8"
    >
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-studio-ash/50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          {/* Abstract geometric basket/vessel */}
          <path d="M20 30 L80 30 L70 80 L30 80 Z" strokeWidth="1" />
          <path d="M40 30 L40 80" strokeWidth="1" />
          <path d="M60 30 L60 80" strokeWidth="1" />

          {/* Handle arcs */}
          <path d="M35 30 C 35 15, 65 15, 65 30" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>

        {/* Animated accent dot */}
        <motion.div
          animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute -top-2 w-2 h-2 rounded-full bg-studio-bronze"
        />
      </div>

      <div className="space-y-3">
        <h4 className="font-serif text-xl font-light text-studio-dark tracking-wide">
          Your Vessel is Empty
        </h4>
        <p className="font-sans text-xs text-studio-muted max-w-xs mx-auto leading-relaxed">
          Configure bespoke software architecture in <strong className="text-studio-dark font-medium">The Studio</strong>, or discover premium botanical formulas in <strong className="text-studio-dark font-medium">TRIU Naturals</strong>.
        </p>
      </div>

      <div className="pt-4">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent border border-studio-dark text-studio-dark text-xs font-mono uppercase tracking-widest hover:bg-studio-dark hover:text-studio-light transition-all duration-300 cursor-pointer"
        >
          Explore Collections
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
