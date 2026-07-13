import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Mail, ClipboardCheck } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderConfirmationModal({ order, onClose }: OrderConfirmationModalProps) {
  if (!order) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] overflow-y-auto bg-studio-dark/85 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-studio-cream border border-studio-ash max-w-md w-full overflow-hidden text-studio-dark relative shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 pb-0 flex justify-between items-start">
            <div className="h-10 w-10 rounded-full bg-[#4f5c4b]/10 text-[#4f5c4b] flex items-center justify-center border border-[#4f5c4b]/20">
              <Mail className="h-5 w-5" />
            </div>
            <button
              onClick={onClose}
              className="p-1 text-studio-muted hover:text-studio-dark transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-8 pt-6 space-y-8">
            <div className="text-center space-y-3">
              <h3 className="font-serif text-3xl font-light text-studio-dark">
                Order Confirmed
              </h3>
              <p className="font-sans text-sm text-studio-muted leading-relaxed">
                Thank you, {order.customerName}. We've sent a digital receipt to <strong className="text-studio-dark font-medium">{order.customerEmail}</strong>.
              </p>
            </div>

            {/* Simulated Email Body */}
            <div className="bg-white border border-studio-ash/50 p-6 space-y-6 shadow-xs relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-studio-dark via-studio-bronze to-studio-dark" />

              <div className="text-center space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-studio-muted font-semibold">
                  SALTEDHASH STUDIOS
                </span>
                <p className="font-mono text-[10px] text-studio-dark">
                  Order #{order.id}
                </p>
              </div>

              <div className="border-t border-b border-studio-ash/30 py-4 space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-xs font-sans">
                    <div>
                      <strong className="text-studio-dark font-medium">{item.name}</strong>
                      <span className="text-studio-muted block text-[10px]">Qty: {item.qty}</span>
                    </div>
                    <span className="font-mono">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center font-serif text-sm font-bold text-studio-dark">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-studio-dark hover:bg-[#343e31] text-studio-light text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Return to Studio
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
