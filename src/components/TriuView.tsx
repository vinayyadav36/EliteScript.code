import React, { useState } from 'react';
import { ArrowUpRight, HelpCircle, Leaf, ShieldCheck, ShoppingBag, Droplets, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TriuViewProps {
  setActiveTab: (tab: string) => void;
  onPrefillPreorder?: (productName: string) => void;
  onAddToCart: (item: { id: string; name: string; price: number; type: 'product' | 'service'; itemId: string; qty: number }) => void;
  onCartOpen: () => void;
}

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  ingredients: string[];
  volume: string;
  batchNum: string;
  capacity: number;
  available: number;
  status: 'In Sourcing' | 'Brewing' | 'Ready to Fill' | 'Allocated';
  keyNotes: string;
  price: number;
}

export default function TriuView({ setActiveTab, onPrefillPreorder, onAddToCart, onCartOpen }: TriuViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>('triu-k');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  
  const TRIU_PRODUCTS: Product[] = [
    {
      id: 'triu-k',
      name: 'Kumkumadi Radiance Elixir',
      tagline: 'Kashmir Saffron & Red Sandalwood Concentrate',
      description: 'A luxurious night oil crafted with pristine hand-harvested Pampore Saffron filaments infused in cold-pressed black sesame oil. Prepared in traditional copper vessels under precise temperature control over 72 hours.',
      ingredients: ['Kashmir Saffron (Kumkuma)', 'Red Sandalwood', 'Licorice Root Extracts', 'Pure Cold-Pressed Black Sesame Oil', 'Wild Lotus Blossom Stigmas'],
      volume: '15 mL e',
      batchNum: 'TRIU-094',
      capacity: 100,
      available: 14,
      status: 'Ready to Fill',
      keyNotes: 'Repairs cell damage, evening texture tone naturally.',
      price: 2499
    },
    {
      id: 'triu-n',
      name: 'Neem & Tea Tree Clarifying Serum',
      tagline: 'Single-Source Wild Neem Leaf Extract',
      description: 'An clarifying antiseptic oil-concentrate built to soothe inflammation and restore deep dermal balance. Cold-pressed neem seeds harvested from rural drylands are combined with active therapeutic-grade tea tree essences.',
      ingredients: ['Wild Dryland Neem Seed Oil', 'Organic Tea Tree Essence', 'Gotu Kola (Centella Asiatica)', 'Pure Jojoba Seed Carrier', 'Vitamin E Alpha-Tocopherol'],
      volume: '30 mL e',
      batchNum: 'TRIU-095',
      capacity: 120,
      available: 43,
      status: 'Brewing',
      keyNotes: 'Destroys acne-causing bacteria, reducing redness immediately.',
      price: 1299
    },
    {
      id: 'triu-b',
      name: 'Bhringraj Scalp Revitalizer',
      tagline: 'Organic False-Daisy Oil & Rosemary infusion',
      description: 'An ancient Ayurvedic recipe for dense, strong hair. Real Bhringraj leaves are cold-processed inside wild coconut oil, slowly simmered with fresh amla and rosemary leaves to lock in natural restorative enzymes.',
      ingredients: ['Bhringraj Leaf Extract', 'Amla Fruit Concentrate', 'Rosemary Essential Oil', 'Single-Source Cold-Pressed Virgin Coconut Oil', 'Motha Herb Root'],
      volume: '100 mL e',
      batchNum: 'TRIU-096',
      capacity: 80,
      available: 8,
      status: 'Allocated',
      keyNotes: 'Stimulates micro-circulation in hair follicles, preventing hair loss.',
      price: 1899
    }
  ];

  const handleReservation = (prodName: string) => {
    if (onPrefillPreorder) {
      onPrefillPreorder(prodName);
    }
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeProduct = TRIU_PRODUCTS.find(p => p.id === selectedProduct) || TRIU_PRODUCTS[0];

  return (
    <div id="triu-view" className="pt-24 min-h-screen bg-[#f5f4ef] text-[#2c3327]">
      {/* Editorial Theme Style Injected (Override default layout momentarily) */}
      <div className="absolute inset-0 z-0 bg-[#fbfbfa] opacity-40 pointer-events-none" />

      {/* Luxury Botanical Header */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10 border-b border-[#e1dfd5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#eae8dd] border border-[#d6d4c5] text-xs font-mono uppercase tracking-widest text-[#4f5c4b]">
              <Leaf className="h-3 w-3" /> TRIU Naturals // SALTEDHASH Venture
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#232a1e] leading-[1.08]">
              Pure botanical formulations, <br />
              brewed <span className="italic font-normal text-[#4f5c4b]">on-order</span>.
            </h1>
            <p className="font-sans text-sm md:text-base text-[#5c6456] font-light leading-relaxed max-w-xl">
              TRIU Naturals is a study in raw botanical care, stripped of the synthetic buffers, chemical preservatives, and corporate dilutions of standard beauty products. We source organic active ingredients directly from small agricultural communities and prepare limited micro-batches of high-potency Ayurvedic serums.
            </p>
          </div>

          <div className="lg:col-span-5 border border-[#d6d4c5] bg-[#eae8dd]/40 p-8 space-y-6">
            <span className="block font-mono text-[9px] uppercase tracking-widest text-[#4f5c4b] font-semibold">
              // CRAFT INTEGRITY REPORT
            </span>
            <div className="space-y-4 text-xs text-[#5c6456] font-light">
              <div className="flex justify-between border-b border-[#d6d4c5] pb-2">
                <span>Active Synthetic Chemicals</span>
                <span className="font-mono text-xs text-[#232a1e] font-semibold">0.00%</span>
              </div>
              <div className="flex justify-between border-b border-[#d6d4c5] pb-2">
                <span>Organic Cold-Pressed Oils</span>
                <span className="font-mono text-xs text-[#232a1e] font-semibold">100.00%</span>
              </div>
              <div className="flex justify-between border-b border-[#d6d4c5] pb-2">
                <span>Micro-batch Serialization</span>
                <span className="font-mono text-xs text-[#232a1e]">Fully Traceable</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Vessel Sterilization Protocol</span>
                <span className="font-mono text-xs text-[#232a1e]">Pure Copper / Hot Air</span>
              </div>
            </div>
            <div className="p-3.5 bg-[#4f5c4b]/5 border-l-2 border-[#4f5c4b] text-[11px] leading-relaxed text-[#4f5c4b] font-mono">
              "We preserve nature's enzymatic patterns. Heating over 45°C is strictly forbidden in our compounding."
            </div>
          </div>
        </div>
      </section>

      {/* Batch Analytics & Botanical Tracer Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12 border-b border-[#e1dfd5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left - Select Product Stories */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#4f5c4b] block mb-2">
                COLLECTION DIRECTORY
              </span>
              <h2 className="font-serif text-3xl font-light text-[#232a1e]">
                Artisanal Compounding
              </h2>
            </div>

            <div className="space-y-3 pt-4">
              {TRIU_PRODUCTS.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod.id)}
                  className={`w-full text-left p-5 border transition-all duration-300 cursor-pointer ${
                    selectedProduct === prod.id
                      ? 'bg-[#eae8dd] border-[#4f5c4b] shadow-2xs'
                      : 'bg-transparent border-[#e1dfd5] hover:border-[#4f5c4b]/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-serif text-base font-semibold text-[#232a1e] max-w-[70%]">
                      {prod.name}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono text-[9px] text-[#4f5c4b] bg-[#eae8dd] px-2 py-0.5 border border-[#d6d4c5]">
                        {prod.volume}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#4f5c4b]">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-[#5c6456] line-clamp-1">
                    {prod.tagline}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right - Selected Product Interactive Gallery */}
          <div className="lg:col-span-8 bg-[#eae8dd]/30 border border-[#d6d4c5] p-8 md:p-10 space-y-8 relative">
            <div className="absolute right-6 top-6 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#4f5c4b]" />
              <span className="font-mono text-[10px] text-[#4f5c4b] uppercase font-semibold">
                Batch Run Status: {activeProduct.status}
              </span>
            </div>

            <div className="space-y-4">
              <span className="font-mono text-xs text-[#4f5c4b] uppercase tracking-wider block">
                FORMULATION SERIAL {activeProduct.batchNum}
              </span>
              <h3 className="font-serif text-3xl md:text-4xl font-light text-[#232a1e]">
                {activeProduct.name}
              </h3>
              <p className="font-sans text-[#5c6456] text-sm md:text-base font-light leading-relaxed">
                {activeProduct.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-[#d6d4c5]">
              {/* Ingredients List */}
              <div className="space-y-3">
                <span className="block font-mono text-[9px] uppercase tracking-widest text-[#4f5c4b] font-semibold">
                  Declared Active Botanicals
                </span>
                <ul className="text-xs text-[#5c6456] space-y-2">
                  {activeProduct.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Droplets className="h-3 w-3 text-[#4f5c4b] flex-shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limited Batch Allocation Tracker */}
              <div className="space-y-4 bg-[#eae8dd]/60 p-6 border border-[#d6d4c5] flex flex-col justify-between">
                <div>
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-[#4f5c4b] font-semibold mb-2">
                    Micro-Batch Availability
                  </span>
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-serif text-3xl font-light text-[#232a1e]">
                      {activeProduct.available} <span className="text-xs font-mono text-[#5c6456]">of {activeProduct.capacity} left</span>
                    </span>
                    <span className="font-mono text-xs text-[#d48c00] animate-pulse">
                      High Demand
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-[#d6d4c5] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#4f5c4b] h-full transition-all duration-1000"
                      style={{ width: `${(activeProduct.available / activeProduct.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#d6d4c5]/60 text-[11px] leading-normal text-[#5c6456] italic">
                  * Note: Each container is wax-sealed and stamped with the master herbalist signature before transport.
                </div>
              </div>
            </div>

            {/* Success Notification Banner */}
            <AnimatePresence>
              {successNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-[#4f5c4b]/10 border border-[#4f5c4b]/30 text-[#4f5c4b] text-xs font-mono flex justify-between items-center"
                >
                  <span>✓ {successNotice} has been added to your checkout basket.</span>
                  <button
                    onClick={onCartOpen}
                    className="underline hover:text-[#343e31] font-bold cursor-pointer"
                  >
                    View Cart / Checkout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Bar */}
            <div className="pt-6 border-t border-[#d6d4c5] flex flex-wrap gap-4 justify-between items-center">
              <div>
                <span className="block font-mono text-[9px] text-[#5c6456]">FORMULATION VALUATION:</span>
                <span className="font-mono text-base font-bold text-[#232a1e]">
                  ₹{activeProduct.price.toLocaleString('en-IN')} <span className="text-[10px] font-light text-[#5c6456]">(incl. taxes)</span>
                </span>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    onAddToCart({
                      id: activeProduct.id,
                      name: activeProduct.name,
                      price: activeProduct.price,
                      type: 'product',
                      itemId: activeProduct.id,
                      qty: 1
                    });
                    setSuccessNotice(activeProduct.name);
                    setTimeout(() => setSuccessNotice(null), 4000);
                  }}
                  className="px-5 py-3 bg-[#4f5c4b] hover:bg-[#343e31] text-studio-light text-xs font-mono uppercase tracking-widest transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  Add to Basket
                  <ShoppingBag className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleReservation(activeProduct.name)}
                  className="px-4 py-3 border border-[#4f5c4b]/40 text-[#4f5c4b] hover:bg-[#4f5c4b]/5 text-xs font-mono uppercase tracking-widest transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  Custom Formulation
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Philosophy of Pure Raw Materials */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: 'Ayurvedic Alchemy',
              desc: 'We follow ancient Sanskrit text specifications (Ashtanga Hridaya) to map raw ingredients, boiling parameters, and moon phases for maximum bio-availability.'
            },
            {
              title: 'Single-Source Wild Sourcing',
              desc: 'No commercial warehouses. Our saffron, lotus blossom, neem, and sesame seed oils are sourced from ethical regional cultivators who care for the soil.'
            },
            {
              title: 'Freshly Compound on Order',
              desc: 'We compound only after a formal pre-order reservation is made and validated, ensuring the product delivered is active and freshly bottled.'
            }
          ].map((item, idx) => (
            <div key={idx} className="space-y-4 p-4 border-l border-[#d6d4c5]">
              <h3 className="font-serif text-xl font-medium text-[#232a1e]">
                {item.title}
              </h3>
              <p className="font-sans text-xs text-[#5c6456] leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
