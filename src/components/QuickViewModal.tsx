import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { businessConfig, getProductExternalLinks } from '../config/businessConfig';

export interface QuickViewData {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  type: 'product' | 'service';
  tierName?: string;
  variants?: { name: string; price: number; capacity: number; available: number; batchNum: string }[];
  usage?: string;
  ingredients?: string[];
}

interface QuickViewModalProps {
  item: QuickViewData | null;
  onClose: () => void;
  onAddToCart: (item: any) => void;
  onCartOpen: () => void;
}

export default function QuickViewModal({ item, onClose, onAddToCart, onCartOpen }: QuickViewModalProps) {
  if (!item) return null;

  const [selectedVariantName, setSelectedVariantName] = useState<string>(
    item.variants && item.variants.length > 0 ? item.variants[0].name : ''
  );

  React.useEffect(() => {
    if (item && item.variants && item.variants.length > 0) {
      setSelectedVariantName(item.variants[0].name);
    } else {
      setSelectedVariantName('');
    }
  }, [item]);

  const activeVariant = item.variants?.find(v => v.name === selectedVariantName);
  const activePrice = activeVariant ? activeVariant.price : item.price;
  const variantCode = activeVariant ? activeVariant.name.replace('Pack of ', '') : undefined;

  const productLinks = item.type === 'product'
    ? getProductExternalLinks({ id: item.id, name: item.name }, variantCode)
    : null;

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

              <div className="border-t border-studio-ash/30 pt-4 space-y-4">
                <p className="font-sans text-sm text-studio-muted leading-relaxed font-light">
                  {item.description}
                </p>

                {/* Variant Selector */}
                {item.variants && item.variants.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-studio-ash/10">
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-studio-muted font-semibold">
                      Select Pack Size:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.variants.map((v) => (
                        <button
                          key={v.name}
                          onClick={() => setSelectedVariantName(v.name)}
                          type="button"
                          className={`px-2 py-1 text-[10px] font-mono border transition-all cursor-pointer ${
                            selectedVariantName === v.name
                              ? 'bg-studio-dark border-studio-dark text-studio-light font-semibold'
                              : 'bg-white border-studio-ash/60 text-studio-muted hover:border-studio-dark'
                          }`}
                        >
                          {v.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Usage instructions */}
                {item.usage && (
                  <div className="space-y-1.5 pt-4 border-t border-studio-ash/10">
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-studio-muted font-semibold">
                      Direction of Use:
                    </span>
                    <p className="text-[11px] font-sans text-studio-muted leading-relaxed font-light">
                      {item.usage}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 mt-auto space-y-4">
              <div className="flex justify-between items-end border-b border-studio-ash/30 pb-3">
                <span className="font-mono text-[10px] text-studio-muted uppercase tracking-widest">
                  Valuation
                </span>
                <span className="font-serif text-2xl font-semibold text-studio-dark">
                  ₹{activePrice.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Available On Partner Row (Products Only) */}
              {item.type === 'product' && productLinks && (
                <div className="py-2 border-t border-b border-studio-ash/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-studio-muted font-semibold">
                    Available On:
                  </span>
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Buy in App */}
                    <div className="group flex items-center gap-1 text-[10px] text-studio-muted transition-colors duration-200">
                      <div className="text-studio-muted/40 group-hover:text-studio-dark transition-colors duration-200">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                      </div>
                      <span className="font-mono uppercase tracking-wider">Buy in App</span>
                    </div>

                    {/* Flipkart */}
                    {productLinks.flipkart && (
                      <a
                        href={productLinks.flipkart}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-1 text-[10px] text-studio-muted hover:text-[#1A97F4] transition-colors duration-200"
                      >
                        <div className="text-studio-muted/40 group-hover:text-[#1A97F4] transition-colors duration-200">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M11.97 0C5.357 0 0 5.357 0 11.97c0 6.612 5.357 11.97 11.97 11.97 6.612 0 11.97-5.357 11.97-11.97C23.94 5.357 18.582 0 11.97 0zm6.906 14.86h-2.126l-1.39-3.793h-3.818l1.455 3.793H9.72L6.878 7.378h2.63l1.83 5.093h2.37l-1.782-5.093h2.618l3.332 7.482z"/>
                          </svg>
                        </div>
                        <span className="font-mono uppercase tracking-wider">Flipkart</span>
                      </a>
                    )}

                    {/* Meesho */}
                    {productLinks.meesho && (
                      <a
                        href={productLinks.meesho}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-1 text-[10px] text-studio-muted hover:text-[#E72C61] transition-colors duration-200"
                      >
                        <div className="text-studio-muted/40 group-hover:text-[#E72C61] transition-colors duration-200">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3h2c0 .55.45 1 1 1s1-.45 1-1h2c0 1.66-1.34 3-3 3z"/>
                          </svg>
                        </div>
                        <span className="font-mono uppercase tracking-wider">Meesho</span>
                      </a>
                    )}

                    {/* WhatsApp */}
                    <a
                      href={productLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 text-[10px] text-studio-muted hover:text-[#25D366] transition-colors duration-200"
                    >
                      <div className="text-studio-muted/40 group-hover:text-[#25D366] transition-colors duration-200">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.062 5.337 5.4 0 12.007 0a11.94 11.94 0 0 1 8.484 3.512 11.9 11.9 0 0 1 3.51 8.494c-.005 6.66-5.343 11.997-11.951 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm12.004-20.08a8.04 8.04 0 0 0-5.7 2.361 8.04 8.04 0 0 0-2.361 5.7c.004 2.21 1.137 4.29 2.973 5.485l.48.312-.29 1.059-.347 1.27 1.303-.341 1.09-.285.508.301a7.96 7.96 0 0 0 4.14 1.164c4.42-.004 8.021-3.606 8.025-8.031.002-2.146-.831-4.16-2.348-5.679a8.04 8.04 0 0 0-5.679-2.361zm4.39 10.158c-.24-.12-1.423-.702-1.642-.782-.22-.08-.38-.12-.54.12-.16.24-.62.782-.76.94-.14.16-.28.18-.52.06a7.39 7.39 0 0 1-1.92-1.18c-.85-.757-1.423-1.69-1.59-1.97-.16-.24-.017-.37.104-.49.11-.108.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.195-.476-.39-.413-.54-.42-.14-.007-.3-.007-.46-.007-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2.008 0 1.187.864 2.328.984 2.488.12.16 1.7 2.596 4.12 3.644 1.026.447 1.83.693 2.455.892.628.199 1.198.171 1.65.103.504-.076 1.423-.582 1.622-1.144.2-.562.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
                        </svg>
                      </div>
                      <span className="font-mono uppercase tracking-wider">WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 items-center">
                {/* Buy in App */}
                <button
                  onClick={() => {
                    onAddToCart({
                      id: item.type === 'service' 
                        ? `${item.id}-${item.tierName}` 
                        : (item.variants && item.variants.length > 0
                            ? `${item.id}-${selectedVariantName}` 
                            : item.id),
                      name: item.variants && item.variants.length > 0
                        ? `${item.name} (${selectedVariantName})`
                        : item.name,
                      price: activePrice,
                      type: item.type,
                      itemId: item.id,
                      qty: 1,
                      tierName: item.tierName
                    });
                    onClose();
                    onCartOpen();
                  }}
                  className="flex-grow py-3.5 bg-studio-dark hover:bg-[#343e31] text-studio-light text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  Buy in App
                  <ShoppingBag className="h-4 w-4" />
                </button>

                {/* Flipkart (Products only) */}
                {item.type === 'product' && productLinks?.flipkart && (
                  <a
                    href={productLinks.flipkart}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-4 border border-studio-dark/40 text-studio-dark hover:bg-studio-dark/5 text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Flipkart
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}

                {/* Meesho (Products only) */}
                {item.type === 'product' && productLinks?.meesho && (
                  <a
                    href={productLinks.meesho}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-4 border border-studio-dark/40 text-studio-dark hover:bg-studio-dark/5 text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Meesho
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}

                {/* WhatsApp (Products only) */}
                {item.type === 'product' && productLinks && (
                  <a
                    href={productLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 border border-studio-dark/30 text-studio-dark hover:bg-studio-dark/5 transition-colors flex items-center justify-center cursor-pointer"
                    title="WhatsApp Enquiry"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.062 5.337 5.4 0 12.007 0a11.94 11.94 0 0 1 8.484 3.512 11.9 11.9 0 0 1 3.51 8.494c-.005 6.66-5.343 11.997-11.951 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm12.004-20.08a8.04 8.04 0 0 0-5.7 2.361 8.04 8.04 0 0 0-2.361 5.7c.004 2.21 1.137 4.29 2.973 5.485l.48.312-.29 1.059-.347 1.27 1.303-.341 1.09-.285.508.301a7.96 7.96 0 0 0 4.14 1.164c4.42-.004 8.021-3.606 8.025-8.031.002-2.146-.831-4.16-2.348-5.679a8.04 8.04 0 0 0-5.679-2.361zm4.39 10.158c-.24-.12-1.423-.702-1.642-.782-.22-.08-.38-.12-.54.12-.16.24-.62.782-.76.94-.14.16-.28.18-.52.06a7.39 7.39 0 0 1-1.92-1.18c-.85-.757-1.423-1.69-1.59-1.97-.16-.24-.017-.37.104-.49.11-.108.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.195-.476-.39-.413-.54-.42-.14-.007-.3-.007-.46-.007-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2.008 0 1.187.864 2.328.984 2.488.12.16 1.7 2.596 4.12 3.644 1.026.447 1.83.693 2.455.892.628.199 1.198.171 1.65.103.504-.076 1.423-.582 1.622-1.144.2-.562.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
