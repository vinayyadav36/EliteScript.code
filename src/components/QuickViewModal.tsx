import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';

export interface QuickViewData {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  type: 'product' | 'service';
  tierName?: string;
}

interface QuickViewModalProps {
  item: QuickViewData | null;
  onClose: () => void;
  onAddToCart: (item: any) => void;
  onCartOpen: () => void;
}

export default function QuickViewModal({ item, onClose, onAddToCart, onCartOpen }: QuickViewModalProps) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-studio-dark/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-studio-light border border-studio-ash/50 w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 bg-studio-light/80 backdrop-blur-xs text-studio-muted hover:text-studio-dark transition-colors cursor-pointer border border-studio-ash/40"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Abstract visual for product/service */}
          <div className="md:w-2/5 bg-studio-cream border-r border-studio-ash/30 p-8 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4 pointer-events-none">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-12 h-12 border border-studio-dark" />
              ))}
            </div>

            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border border-studio-ash/60 bg-studio-light shadow-xs flex items-center justify-center">
              <span className="font-serif text-4xl md:text-6xl text-studio-muted opacity-20">
                {item.name.charAt(0)}
              </span>
            </div>
          </div>

          <div className="md:w-3/5 p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="inline-block px-2 py-0.5 bg-studio-ash/20 text-[10px] font-mono uppercase tracking-widest text-studio-muted border border-studio-ash/40 mb-3">
                  {item.category}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-light text-studio-dark leading-tight">
                  {item.name}
                </h3>
                {item.tierName && (
                  <p className="font-mono text-[10px] text-studio-bronze mt-2">
                    Tier: {item.tierName}
                  </p>
                )}
              </div>

              <div className="border-t border-studio-ash/30 pt-4">
                <p className="font-sans text-sm text-studio-muted leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="pt-8 mt-auto space-y-4">
              <div className="flex justify-between items-end border-b border-studio-ash/30 pb-3">
                <span className="font-mono text-[10px] text-studio-muted uppercase tracking-widest">
                  Valuation
                </span>
                <span className="font-serif text-2xl font-semibold text-studio-dark">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => {
                  onAddToCart({
                    id: item.type === 'service' ? `${item.id}-${item.tierName}` : item.id,
                    name: item.name,
                    price: item.price,
                    type: item.type,
                    itemId: item.id,
                    qty: 1,
                    tierName: item.tierName
                  });
                  onClose();
                  onCartOpen();
                }}
                className="w-full py-4 bg-studio-dark hover:bg-studio-bronze text-studio-light text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                Add to Vessel
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
