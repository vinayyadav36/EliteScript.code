import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Leaf, ShoppingBag, Droplets, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import QuickViewModal, { QuickViewData } from './QuickViewModal';
import { fetchActiveProducts } from '../lib/appwrite';
import { businessConfig, getProductExternalLinks } from '../config/businessConfig';

import { CartItem } from '../types';

interface TriuViewProps {
  setActiveTab: (tab: string) => void;
  onPrefillPreorder?: (productName: string) => void;
  onAddToCart: (item: CartItem) => void;
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
  category?: string;
  usage?: string;
  variants?: { name: string; price: number; capacity: number; available: number; batchNum: string }[];
}

export default function TriuView({ setActiveTab, onPrefillPreorder, onAddToCart, onCartOpen }: TriuViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>('triu-k');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [quickViewItem, setQuickViewItem] = useState<QuickViewData | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVariantName, setSelectedVariantName] = useState<string>('');

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
      price: 2499,
      category: 'Botanical Elixirs',
      usage: 'Apply 3-4 drops on clean face at night. Gently massage in upward circular motions until fully absorbed. Leave overnight.'
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
      price: 1299,
      category: 'Botanical Elixirs',
      usage: 'Apply 2-3 drops locally to affected areas twice daily after cleansing. Avoid contact with eyes.'
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
      price: 1899,
      category: 'Botanical Elixirs',
      usage: 'Massage warm oil into scalp and hair. Leave for at least 1 hour or overnight before washing off with a mild natural cleanser.'
    },
    {
      id: 'triu-d',
      name: 'Organic Cow Dung Cakes',
      tagline: 'Sun-dried sacred fuel for rituals & air purification',
      description: 'Handcrafted cow dung cakes sourced from grass-fed indigenous cows (A2) in Rewari, HR. Traditionally sun-dried and wax-sealed to preserve combustion enzymes. Ideal for Havan, Agnihotra, and natural air purification.',
      ingredients: ['100% Pure Cow Dung (A2)', 'Sun-dried natural straw binder', 'Neem leaves infusion (natural pest repellent)', 'Ghee (traces from traditional molding process)'],
      volume: 'Pack Variant e',
      batchNum: 'TRIU-DNG',
      capacity: 500,
      available: 342,
      status: 'Ready to Fill',
      keyNotes: 'Burns with zero toxic residue, cleansing space and repelling pests.',
      price: 29,
      category: 'Sacred Dung Cakes',
      usage: 'Place cake in Agnihotra vessel or ritual fire hearth. Ignite using camphor or ghee-soaked wick. Ensure proper ventilation.',
      variants: [
        { name: 'Pack of 1', price: 29, capacity: 500, available: 342, batchNum: 'TRIU-D01' },
        { name: 'Pack of 2', price: 49, capacity: 250, available: 184, batchNum: 'TRIU-D02' },
        { name: 'Pack of 5', price: 99, capacity: 200, available: 121, batchNum: 'TRIU-D05' },
        { name: 'Pack of 15', price: 249, capacity: 150, available: 93, batchNum: 'TRIU-D15' },
        { name: 'Pack of 45', price: 599, capacity: 100, available: 64, batchNum: 'TRIU-D45' },
        { name: 'Pack of 60', price: 749, capacity: 80, available: 52, batchNum: 'TRIU-D60' },
        { name: 'Pack of 75', price: 899, capacity: 60, available: 41, batchNum: 'TRIU-D75' },
        { name: 'Pack of 90', price: 999, capacity: 50, available: 29, batchNum: 'TRIU-D90' },
        { name: 'Pack of 105', price: 1149, capacity: 40, available: 22, batchNum: 'TRIU-D105' }
      ]
    }
  ];

  const [products, setProducts] = useState<Product[]>(TRIU_PRODUCTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const appwriteProducts = await fetchActiveProducts();
        if (appwriteProducts && appwriteProducts.length > 0) {
          const mapped: Product[] = appwriteProducts.map((doc: any) => {
            const name = doc.name || 'Unnamed Botanical Formulation';
            const tagline = doc.category || doc.brand_code || 'Premium Botanical Care';
            const description = doc.description || 'Raw Ayurvedic compounding with direct agricultural sourcing.';
            
            let ingredients = ['100% Organic Extracts'];
            if (Array.isArray(doc.tags) && doc.tags.length > 0) {
              const filteredTags = doc.tags.filter((t: any) => typeof t === 'string' && t.trim() !== '');
              if (filteredTags.length > 0) {
                ingredients = filteredTags;
              }
            }

            const slug = doc.slug || doc.$id || 'triu-custom';
            const price = typeof doc.price === 'number' ? doc.price : 1999;
            
            const staticMatch = TRIU_PRODUCTS.find(p => p.id === doc.$id || p.name.toLowerCase() === name.toLowerCase());
            const category = doc.category || staticMatch?.category || 'Botanical Elixirs';
            const usage = doc.usage || staticMatch?.usage || 'Use as directed by herbalist.';
            const variants = doc.variants || staticMatch?.variants;

            return {
              id: doc.$id,
              name,
              tagline,
              description,
              ingredients,
              volume: doc.volume || staticMatch?.volume || '15 mL e',
              batchNum: `TRIU-${slug.substring(0, 3).toUpperCase()}`,
              capacity: doc.capacity || staticMatch?.capacity || 100,
              available: doc.available || staticMatch?.available || Math.floor(10 + Math.random() * 40),
              status: (doc.status as any) || staticMatch?.status || 'Ready to Fill',
              keyNotes: doc.keyNotes || staticMatch?.keyNotes || 'Formulated under cold-press structural standards.',
              price,
              category,
              usage,
              variants
            };
          });

          // Ensure Dung Cakes static product is appended even if appwrite results don't contain it,
          // so the user's products upgrade is always visible and stable.
          const finalProducts = [...mapped];
          const staticDungCake = TRIU_PRODUCTS.find(p => p.id === 'triu-d');
          if (staticDungCake && !finalProducts.some(p => p.id === 'triu-d')) {
            finalProducts.push(staticDungCake);
          }

          setProducts(finalProducts);
          
          // Align selection if current is missing from new set
          if (!finalProducts.some(p => p.id === selectedProduct)) {
            setSelectedProduct(finalProducts[0]?.id || null);
          }
        }
      } catch (err) {
        console.error('Failed to resolve Appwrite products, running static assets offline:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Reset variant selection on active product change
  useEffect(() => {
    const nextProd = products.find(p => p.id === selectedProduct) || products[0];
    if (nextProd && nextProd.variants && nextProd.variants.length > 0) {
      setSelectedVariantName(nextProd.variants[0].name);
    } else {
      setSelectedVariantName('');
    }
  }, [selectedProduct, products]);

  const handleReservation = (prodName: string) => {
    if (onPrefillPreorder) {
      onPrefillPreorder(prodName);
    }
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeProduct = products.find(p => p.id === selectedProduct) || products[0];

  if (!activeProduct) {
    return null;
  }

  const activeVariant = activeProduct.variants?.find(v => v.name === selectedVariantName);

  const activePrice = activeVariant ? activeVariant.price : (activeProduct.price || 0);
  const activeAvailable = activeVariant ? activeVariant.available : (activeProduct.available || 0);
  const activeCapacity = activeVariant ? activeVariant.capacity : (activeProduct.capacity || 1);
  const activeBatchNum = activeVariant ? activeVariant.batchNum : (activeProduct.batchNum || 'TRIU-X');

  const variantCode = activeVariant ? activeVariant.name.replace('Pack of ', '') : undefined;
  const productLinks = getProductExternalLinks(activeProduct, variantCode);

  return (
    <div id="triu-view" className="pt-24 min-h-screen bg-[#f5f4ef] text-[#2c3327]">
      {/* Editorial Theme Style Injected (Override default layout momentarily) */}
      <div className="absolute inset-0 z-0 bg-[#fbfbfa] opacity-40 pointer-events-none" />

      {/* Luxury Botanical Header */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10 border-b border-[#e1dfd5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#eae8dd] border border-[#d6d4c5] text-xs font-mono uppercase tracking-widest text-[#4f5c4b]">
              <Leaf className="h-3 w-3" /> TRIU Naturals // {businessConfig.name} Venture
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
              {/* CRAFT INTEGRITY REPORT */}
              CRAFT INTEGRITY REPORT
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

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap border-b border-[#d6d4c5] pb-2 gap-3 text-[10px] font-mono">
              {['All', 'Botanical Elixirs', 'Sacred Dung Cakes'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    const filtered = products.filter(p => cat === 'All' || p.category === cat);
                    if (filtered.length > 0 && !filtered.some(p => p.id === selectedProduct)) {
                      setSelectedProduct(filtered[0].id);
                    }
                  }}
                  className={`pb-1 border-b-2 transition-all cursor-pointer ${
                    selectedCategory === cat 
                      ? 'border-[#4f5c4b] text-[#4f5c4b] font-bold' 
                      : 'border-transparent text-[#5c6456] hover:text-[#232a1e]'
                  }`}
                >
                  {cat === 'All' ? 'ALL' : cat.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-4">
              {products
                .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
                .map((prod) => (
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
                          {prod.variants && prod.variants.length > 0 ? 'Variants' : prod.volume}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#4f5c4b]">
                          ₹{prod.variants && prod.variants.length > 0 
                            ? `${prod.variants[0].price}+` 
                            : prod.price.toLocaleString('en-IN')}
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
                FORMULATION SERIAL {activeBatchNum}
              </span>
              <h3 className="font-serif text-3xl md:text-4xl font-light text-[#232a1e]">
                {activeProduct.name}
              </h3>
              <p className="font-sans text-[#5c6456] text-sm md:text-base font-light leading-relaxed">
                {activeProduct.description}
              </p>
            </div>

            {/* Variant Selector (if product has variants) */}
            {activeProduct.variants && activeProduct.variants.length > 0 && (
              <div className="p-5 bg-[#eae8dd]/40 border border-[#d6d4c5] space-y-3">
                <span className="block font-mono text-[9px] uppercase tracking-widest text-[#4f5c4b] font-semibold">
                  SELECT VARIANT PACK SIZE:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeProduct.variants.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => setSelectedVariantName(v.name)}
                      className={`px-3 py-1.5 text-xs font-mono border transition-all cursor-pointer ${
                        selectedVariantName === v.name
                          ? 'bg-[#4f5c4b] border-[#4f5c4b] text-studio-light font-bold'
                          : 'bg-white border-[#d6d4c5] text-[#5c6456] hover:border-[#4f5c4b]'
                      }`}
                    >
                      {v.name} (₹{v.price})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Instructions */}
            {activeProduct.usage && (
              <div className="pt-4 border-t border-[#d6d4c5] space-y-2">
                <span className="block font-mono text-[9px] uppercase tracking-widest text-[#4f5c4b] font-semibold">
                  FORMULATION BLUEPRINT / DIRECTION OF USE:
                </span>
                <p className="text-xs text-[#5c6456] leading-relaxed font-sans font-light">
                  {activeProduct.usage}
                </p>
              </div>
            )}

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
                      {activeAvailable} <span className="text-xs font-mono text-[#5c6456]">of {activeCapacity} left</span>
                    </span>
                    <span className="font-mono text-xs text-[#d48c00] animate-pulse">
                      High Demand
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-[#d6d4c5] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#4f5c4b] h-full transition-all duration-1000"
                      style={{ width: `${(activeAvailable / activeCapacity) * 100}%` }}
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

            {/* Available On Partner Showcase */}
            {activeProduct && (
              <div className="pt-4 border-t border-[#d6d4c5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#5c6456] font-semibold">
                  Available On:
                </span>
                <div className="flex flex-wrap items-center gap-6">
                  {/* Buy in App */}
                  <div className="group flex items-center gap-1.5 text-xs text-[#5c6456] transition-colors duration-200">
                    <div className="text-[#5c6456]/40 group-hover:text-[#4f5c4b] transition-colors duration-200">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider">Buy in App</span>
                  </div>

                  {/* Flipkart */}
                  {productLinks.flipkart && (
                    <a
                      href={productLinks.flipkart}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 text-xs text-[#5c6456] hover:text-[#1A97F4] transition-colors duration-200"
                    >
                      <div className="text-[#5c6456]/40 group-hover:text-[#1A97F4] transition-colors duration-200">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M11.97 0C5.357 0 0 5.357 0 11.97c0 6.612 5.357 11.97 11.97 11.97 6.612 0 11.97-5.357 11.97-11.97C23.94 5.357 18.582 0 11.97 0zm6.906 14.86h-2.126l-1.39-3.793h-3.818l1.455 3.793H9.72L6.878 7.378h2.63l1.83 5.093h2.37l-1.782-5.093h2.618l3.332 7.482z"/>
                        </svg>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider">Flipkart</span>
                    </a>
                  )}

                  {/* Meesho */}
                  {productLinks.meesho && (
                    <a
                      href={productLinks.meesho}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 text-xs text-[#5c6456] hover:text-[#E72C61] transition-colors duration-200"
                    >
                      <div className="text-[#5c6456]/40 group-hover:text-[#E72C61] transition-colors duration-200">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3h2c0 .55.45 1 1 1s1-.45 1-1h2c0 1.66-1.34 3-3 3z"/>
                        </svg>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider">Meesho</span>
                    </a>
                  )}

                  {/* Tide */}
                  {productLinks.tideUrl && (
                    <a
                      href={productLinks.tideUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 text-xs text-[#5c6456] hover:text-[#4f5c4b] transition-colors duration-200"
                    >
                      <div className="text-[#5c6456]/40 group-hover:text-[#4f5c4b] transition-colors duration-200">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[9px] uppercase tracking-wider">
                          {productLinks.tideIsFallback ? 'View on Tide Store' : 'Buy on Tide'}
                        </span>
                        {productLinks.tideIsFallback && (
                          <span className="text-[8px] text-[#5c6456]/70 leading-none">General store — search for this product</span>
                        )}
                      </div>
                    </a>
                  )}

                  {/* WhatsApp */}
                  <a
                    href={productLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 text-xs text-[#5c6456] hover:text-[#25D366] transition-colors duration-200"
                  >
                    <div className="text-[#5c6456]/40 group-hover:text-[#25D366] transition-colors duration-200">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.062 5.337 5.4 0 12.007 0a11.94 11.94 0 0 1 8.484 3.512 11.9 11.9 0 0 1 3.51 8.494c-.005 6.66-5.343 11.997-11.951 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm12.004-20.08a8.04 8.04 0 0 0-5.7 2.361 8.04 8.04 0 0 0-2.361 5.7c.004 2.21 1.137 4.29 2.973 5.485l.48.312-.29 1.059-.347 1.27 1.303-.341 1.09-.285.508.301a7.96 7.96 0 0 0 4.14 1.164c4.42-.004 8.021-3.606 8.025-8.031.002-2.146-.831-4.16-2.348-5.679a8.04 8.04 0 0 0-5.679-2.361zm4.39 10.158c-.24-.12-1.423-.702-1.642-.782-.22-.08-.38-.12-.54.12-.16.24-.62.782-.76.94-.14.16-.28.18-.52.06a7.39 7.39 0 0 1-1.92-1.18c-.85-.757-1.423-1.69-1.59-1.97-.16-.24-.017-.37.104-.49.11-.108.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.195-.476-.39-.413-.54-.42-.14-.007-.3-.007-.46-.007-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2.008 0 1.187.864 2.328.984 2.488.12.16 1.7 2.596 4.12 3.644 1.026.447 1.83.693 2.455.892.628.199 1.198.171 1.65.103.504-.076 1.423-.582 1.622-1.144.2-.562.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
                      </svg>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider">WhatsApp</span>
                  </a>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-6 border-t border-[#d6d4c5] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="block font-mono text-[9px] text-[#5c6456]">FORMULATION VALUATION:</span>
                <span className="font-mono text-base font-bold text-[#232a1e]">
                  ₹{activePrice.toLocaleString('en-IN')} <span className="text-[10px] font-light text-[#5c6456]">(incl. taxes)</span>
                </span>
                {/* Lightweight text-only trust badge */}
                <span className="block text-[9px] text-[#76746f] mt-1 font-sans">
                  Available on App, {productLinks.flipkart ? 'Flipkart, ' : ''}{productLinks.meesho ? 'Meesho, ' : ''}{productLinks.tideUrl ? 'Tide & ' : ''}WhatsApp
                </span>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {/* Buy in App */}
                <button
                  onClick={() => {
                    onAddToCart({
                      id: activeProduct.variants && activeProduct.variants.length > 0 
                        ? `${activeProduct.id}-${selectedVariantName}` 
                        : activeProduct.id,
                      name: activeProduct.variants && activeProduct.variants.length > 0 
                        ? `${activeProduct.name} (${selectedVariantName})` 
                        : activeProduct.name,
                      price: activePrice,
                      type: 'product',
                      itemId: activeProduct.id,
                      qty: 1,
                      variantCode: variantCode,
                      variantName: selectedVariantName || undefined
                    });
                    setSuccessNotice(activeProduct.variants && activeProduct.variants.length > 0
                      ? `${activeProduct.name} (${selectedVariantName})`
                      : activeProduct.name
                    );
                    setTimeout(() => setSuccessNotice(null), 5000);
                  }}
                  className="px-5 py-3.5 bg-[#4f5c4b] hover:bg-[#343e31] text-studio-light text-xs font-mono uppercase tracking-widest transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  Buy in App
                  <ShoppingBag className="h-4 w-4" />
                </button>

                {/* Specs / Quick View */}
                <button
                  onClick={() => {
                    setQuickViewItem({
                      id: activeProduct.id,
                      name: activeProduct.name,
                      category: activeProduct.category || 'Botanical Elixirs',
                      price: activePrice,
                      description: activeProduct.description,
                      type: 'product',
                      variants: activeProduct.variants,
                      usage: activeProduct.usage,
                      ingredients: activeProduct.ingredients
                    });
                  }}
                  className="px-4 py-3.5 border border-[#4f5c4b]/40 text-[#4f5c4b] hover:bg-[#4f5c4b]/5 text-xs font-mono uppercase tracking-widest transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  Specs
                  <Sparkles className="h-3.5 w-3.5" />
                </button>

                {/* Flipkart */}
                {productLinks.flipkart && (
                  <a
                    href={productLinks.flipkart}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3.5 border border-[#4f5c4b]/45 text-[#4f5c4b] hover:bg-[#4f5c4b]/5 text-xs font-mono uppercase tracking-widest transition-colors duration-300 flex items-center gap-1 cursor-pointer"
                  >
                    Flipkart
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}

                {/* Meesho */}
                {productLinks.meesho && (
                  <a
                    href={productLinks.meesho}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3.5 border border-[#4f5c4b]/45 text-[#4f5c4b] hover:bg-[#4f5c4b]/5 text-xs font-mono uppercase tracking-widest transition-colors duration-300 flex items-center gap-1 cursor-pointer"
                  >
                    Meesho
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}

                {/* WhatsApp */}
                <a
                  href={productLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 border border-[#4f5c4b]/30 text-[#4f5c4b] hover:bg-[#4f5c4b]/5 transition-colors duration-300 flex items-center justify-center cursor-pointer"
                  title="WhatsApp Enquiry"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.062 5.337 5.4 0 12.007 0a11.94 11.94 0 0 1 8.484 3.512 11.9 11.9 0 0 1 3.51 8.494c-.005 6.66-5.343 11.997-11.951 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm12.004-20.08a8.04 8.04 0 0 0-5.7 2.361 8.04 8.04 0 0 0-2.361 5.7c.004 2.21 1.137 4.29 2.973 5.485l.48.312-.29 1.059-.347 1.27 1.303-.341 1.09-.285.508.301a7.96 7.96 0 0 0 4.14 1.164c4.42-.004 8.021-3.606 8.025-8.031.002-2.146-.831-4.16-2.348-5.679a8.04 8.04 0 0 0-5.679-2.361zm4.39 10.158c-.24-.12-1.423-.702-1.642-.782-.22-.08-.38-.12-.54.12-.16.24-.62.782-.76.94-.14.16-.28.18-.52.06a7.39 7.39 0 0 1-1.92-1.18c-.85-.757-1.423-1.69-1.59-1.97-.16-.24-.017-.37.104-.49.11-.108.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.195-.476-.39-.413-.54-.42-.14-.007-.3-.007-.46-.007-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2.008 0 1.187.864 2.328.984 2.488.12.16 1.7 2.596 4.12 3.644 1.026.447 1.83.693 2.455.892.628.199 1.198.171 1.65.103.504-.076 1.423-.582 1.622-1.144.2-.562.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
                  </svg>
                </a>

                {/* Custom Formulation */}
                <button
                  onClick={() => handleReservation(activeProduct.name)}
                  className="px-4 py-3.5 border border-[#4f5c4b]/40 text-[#4f5c4b] hover:bg-[#4f5c4b]/5 text-xs font-mono uppercase tracking-widest transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
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

      <QuickViewModal
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onAddToCart={onAddToCart}
        onCartOpen={onCartOpen}
      />
    </div>
  );
}
