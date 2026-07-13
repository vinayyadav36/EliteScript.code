import React, { useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp, Cpu, Network, Rocket, Layers, Code, ShieldCheck, Terminal, Lightbulb, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES, PROCESS_STEPS } from '../data';
import { Service } from '../types';
import ScrollReveal from './ScrollReveal';

interface StudioViewProps {
  setActiveTab: (tab: string) => void;
  onPrefillService?: (serviceName: string) => void;
  onAddToCart: (item: { id: string; name: string; price: number; type: 'product' | 'service'; itemId: string; qty: number; tierName: string }) => void;
  onCartOpen: () => void;
}

interface ServicePackage {
  tierName: string;
  price: number; // in INR
  description: string;
  deliverables: string[];
}

const SERVICE_PACKAGES: Record<string, ServicePackage[]> = {
  'ai-ml': [
    {
      tierName: 'Strategic Evaluation',
      price: 15000,
      description: 'A 1-on-1 deconstruction of your business workflows to map RAG, local models or automation opportunities.',
      deliverables: ['Custom AI Architecture blueprint', 'ROI & API cost projections', 'Feasibility prototype code']
    },
    {
      tierName: 'Core RAG Pipeline',
      price: 350000,
      description: 'Production-ready Vector database setup with custom retrieval chains grounded securely in your business files.',
      deliverables: ['Semantic search engine codebase', 'Qdrant / PGVector database deployment', 'Secure API proxy layer']
    },
    {
      tierName: 'Autonomous Agent Engine',
      price: 800000,
      description: 'Fully orchestration-grade background agents carrying out complex multi-step data parsing and entity extraction.',
      deliverables: ['Custom fine-tuned agent workflows', 'Error-resilient worker systems', '30-day monitoring warranty']
    }
  ],
  'web-arch': [
    {
      tierName: 'Custom SEO Landing',
      price: 45000,
      description: 'Blazing-fast editorial web asset designed to drive leads, build search credibility, and scale perfectly.',
      deliverables: ['Sub-second speed score', 'High-contrast custom visual structure', 'Tailwind responsive blocks']
    },
    {
      tierName: 'Interactive Platform Core',
      price: 250000,
      description: 'Comprehensive SPA or SSR custom application integrated securely with user auth and structured DB.',
      deliverables: ['TypeScript frontend/backend', 'Custom PostgreSQL / Firestore model', 'Complete REST API blueprint']
    },
    {
      tierName: 'E-Commerce Marketplace',
      price: 650000,
      description: 'Multi-vendor ready, highly responsive storefront integrated with automated Stripe / Tide invoice gateways.',
      deliverables: ['Secure product katalog systems', 'Automated tax and billing hooks', 'Real-time client order portals']
    }
  ],
  'saas-mvp': [
    {
      tierName: 'Prototype & Scoping',
      price: 75000,
      description: 'A rapid 1-week strategic wireframing phase to lock-in database schema and visual user journeys.',
      deliverables: ['Figma click-through blueprint', 'Database entity relationship diagram', 'Interactive technical roadmap']
    },
    {
      tierName: 'Functional SaaS MVP',
      price: 400000,
      description: 'A pristine, fully deployed subscription app in 4 weeks. Perfect for early validation and capital fundraising.',
      deliverables: ['Custom auth & profile panels', 'Stripe Billing / Stripe Webhooks', 'Cloud Run secure live release']
    },
    {
      tierName: 'Premium Multi-Tenant SaaS',
      price: 1000000,
      description: 'Enterprise grade software featuring tenant isolation, customized workspaces, and team permissions management.',
      deliverables: ['Isolated Postgres/Firestore rails', 'Advanced role access (IAM)', 'White-label custom domains']
    }
  ],
  'design-systems': [
    {
      tierName: 'Styleguide & Tokens',
      price: 35000,
      description: 'Standardised design systems containing customized colour palettes, responsive typographic grids, and Figma blocks.',
      deliverables: ['Figma component library', 'CSS variable definitions', 'Logical grid spacing rules']
    },
    {
      tierName: 'Interactive Tailwind Library',
      price: 180000,
      description: 'Pristine, pre-tested React component files styled directly with utility classes and Framer Motion.',
      deliverables: ['Framer Motion micro-animations', 'Clean accessible elements', 'Full Storybook documentation']
    },
    {
      tierName: 'Universal Design System',
      price: 450000,
      description: 'Complete cross-platform UI package engineered for high-density multi-brand platforms.',
      deliverables: ['Monorepo workspace system', 'Semantic styling tokens', 'Web, iOS and Android alignment']
    }
  ],
  'automation-workflow': [
    {
      tierName: 'Zapier & Make Hookups',
      price: 25000,
      description: 'Quick workflow links tying your lead captures, CRMs, and email pipelines with automated filters.',
      deliverables: ['Live visual flow setup', 'Data-transformation scripts', 'Error retry triggers']
    },
    {
      tierName: 'Serverless Backdoor Pipeline',
      price: 220000,
      description: 'Bespoke, high-throughput cloud event routers running on error-persistent message queues.',
      deliverables: ['Serverless broker functions', 'Persistent database logging', 'Live Slack alerting integrations']
    }
  ],
  'security-audit': [
    {
      tierName: 'Vulnerability Analysis',
      price: 20000,
      description: 'An exhaustive code analysis (SAST) detailing dependencies risks, leak spots, and package overrides.',
      deliverables: ['Interactive HTML executive scorecard', 'Identified OWASP risk points', 'Recommended patches report']
    },
    {
      tierName: 'Architecture Hardening',
      price: 150000,
      description: 'Hands-on refactoring of query parameters, state routes, and API authentications to shield system integrity.',
      deliverables: ['SQL-injection safe codebases', 'Encrypted environment layouts', 'Signed structural audit report']
    }
  ]
};

export default function StudioView({ setActiveTab, onPrefillService, onAddToCart, onCartOpen }: StudioViewProps) {
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>('ai-ml');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  // Track selected packages for expanded services
  const [selectedPackages, setSelectedPackages] = useState<Record<string, number>>({});
  const [successNotice, setSuccessNotice] = useState<string | null>(null);


  const categories = ['All', 'Intelligence', 'Engineering', 'Execution', 'Aesthetics', 'Efficiency', 'Security'];

  const filteredServices = activeCategory === 'All' 
    ? SERVICES 
    : SERVICES.filter(s => s.category === activeCategory);

  const toggleService = (id: string) => {
    if (expandedServiceId === id) {
      setExpandedServiceId(null);
    } else {
      setExpandedServiceId(id);
    }
  };

  const handleServiceSelect = (serviceTitle: string) => {
    if (onPrefillService) {
      onPrefillService(serviceTitle);
    }
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="studio-view" className="pt-24 min-h-screen">
      {/* Editorial Hero */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-b border-studio-ash/30">
        <ScrollReveal className="max-w-4xl space-y-6" yOffset={20}>
          <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest block">
            THE CAPABILITY PROFILE
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-studio-dark leading-tight">
            We build high-trust digital assets. <br />
            No marketing <span className="italic font-normal text-studio-bronze">theatrics</span>.
          </h1>
          <p className="font-sans text-lg text-studio-muted font-light leading-relaxed max-w-2xl">
            At SALTEDHASH, we operate as a tactical software partner. We design visual interfaces that communicate authority, write highly-optimized codebases that minimize server latency, and deploy robust architectures that scale natively.
          </p>
        </ScrollReveal>
      </section>

      {/* Services Grid & Interactive Accordions */}
      <section className="py-24 border-b border-studio-ash/30">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column - Category Selectors */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
          <div>
            <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest block mb-2">
              STUDIO SERVICES
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight text-studio-dark">
              Core Capabilities
            </h2>
            <p className="font-sans text-xs text-studio-muted font-light leading-relaxed mt-4">
              Select a filter to restrict capabilities, or click into any specific category detail-card to reveal the deep technical mechanics.
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setExpandedServiceId(null);
                }}
                className={`px-3 py-2 text-left font-mono text-[11px] uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-studio-dark text-studio-light border-l-2 border-studio-bronze pl-4'
                    : 'text-studio-muted hover:text-studio-dark hover:bg-studio-cream/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Service Interactive Accordions */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((srv) => {
              const isExpanded = expandedServiceId === srv.id;
              return (
                <motion.div
                  key={srv.id}
                  id={`service-card-${srv.id}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`border border-studio-ash/60 bg-studio-light transition-all duration-300 ${
                    isExpanded ? 'shadow-xs border-studio-bronze/40' : 'hover:border-studio-ash'
                  }`}
                >
                  {/* Header Trigger */}
                  <button
                    onClick={() => toggleService(srv.id)}
                    className="w-full text-left p-6 md:p-8 flex justify-between items-center cursor-pointer"
                  >
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-studio-bronze block mb-2">
                        {srv.category}
                      </span>
                      <h3 className="font-serif text-xl md:text-2xl font-light text-studio-dark">
                        {srv.title}
                      </h3>
                      <p className="font-sans text-xs text-studio-muted font-light mt-1 max-w-xl">
                        {srv.tagline}
                      </p>
                    </div>
                    <div className="text-studio-muted hover:text-studio-bronze transition-colors duration-200 ml-4">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </button>

                  {/* Body Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-8 md:px-8 md:pb-10 pt-2 border-t border-studio-ash/30 space-y-6">
                          <p className="font-sans text-sm text-studio-muted font-light leading-relaxed">
                            {srv.description}
                          </p>

                          {/* Technical Highlights */}
                          <div className="space-y-3">
                            <span className="block font-mono text-[10px] uppercase tracking-wider text-studio-dark font-semibold">
                              Technical Deliverables
                            </span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-studio-muted font-light">
                              {srv.details.map((dtl, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-2">
                                  <span className="text-studio-bronze font-mono mt-0.5">•</span>
                                  <span>{dtl}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Tech Stack Tags */}
                          <div className="space-y-2">
                            <span className="block font-mono text-[10px] uppercase tracking-wider text-studio-dark font-semibold">
                              Preferred Technical Stack
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {srv.capabilities.map((cap, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="font-mono text-[9px] uppercase px-2.5 py-1 bg-studio-cream border border-studio-ash text-studio-muted"
                                >
                                  {cap}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Service Pricing & E-Commerce Packages Selector */}
                          {SERVICE_PACKAGES[srv.id] && (
                            <div className="border border-studio-ash/50 bg-studio-cream p-5 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <span className="block font-mono text-[9px] uppercase tracking-wider text-studio-dark font-bold">
                                  ENGAGEMENT PLANS & PACKAGES:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {SERVICE_PACKAGES[srv.id].map((pack, pIdx) => {
                                    const selectedIdx = selectedPackages[srv.id] ?? 0;
                                    return (
                                      <button
                                        key={pIdx}
                                        type="button"
                                        onClick={() => setSelectedPackages(prev => ({ ...prev, [srv.id]: pIdx }))}
                                        className={`px-2.5 py-1 text-[10px] font-mono border transition-all cursor-pointer ${
                                          selectedIdx === pIdx
                                            ? 'bg-studio-dark text-studio-light border-studio-dark'
                                            : 'bg-transparent text-studio-muted border-studio-ash hover:text-studio-dark hover:border-studio-muted'
                                        }`}
                                      >
                                        {pack.tierName}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Active Pack Display */}
                              {(() => {
                                const activePackIdx = selectedPackages[srv.id] ?? 0;
                                const activePack = SERVICE_PACKAGES[srv.id][activePackIdx];
                                if (!activePack) return null;

                                return (
                                  <div className="space-y-3.5 pt-2 border-t border-studio-ash/30">
                                    <div className="flex justify-between items-start gap-4 flex-wrap">
                                      <div className="space-y-1 max-w-xs">
                                        <h5 className="font-serif text-sm font-bold text-studio-dark">
                                          {activePack.tierName}
                                        </h5>
                                        <p className="text-xs text-studio-muted font-light leading-relaxed font-sans">
                                          {activePack.description}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <span className="block font-mono text-[8px] text-studio-muted uppercase">VALUE PROPOSAL</span>
                                        <span className="font-serif text-base font-bold text-studio-dark">
                                          ₹{activePack.price.toLocaleString('en-IN')}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Specific Deliverables for the Tier */}
                                    <div className="space-y-1.5 pt-1.5">
                                      <span className="block font-mono text-[8px] uppercase tracking-wider text-studio-muted">
                                        INCLUDED DELIVERABLES:
                                      </span>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {activePack.deliverables.map((deliv, dIdx) => (
                                          <div key={dIdx} className="flex items-center gap-1.5 text-xs text-[#4f5c4b] font-light font-sans">
                                            <span className="text-[10px] font-mono">✓</span>
                                            <span>{deliv}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Cart Success Notice inline */}
                                    <AnimatePresence>
                                      {successNotice === `${srv.id}-${activePack.tierName}` && (
                                        <motion.div
                                          initial={{ opacity: 0, y: -5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -5 }}
                                          className="p-2.5 bg-[#4f5c4b]/15 border border-[#4f5c4b]/30 text-[#4f5c4b] text-[10px] font-mono flex justify-between items-center w-full"
                                        >
                                          <span>✓ Plan added to your order basket.</span>
                                          <button
                                            type="button"
                                            onClick={onCartOpen}
                                            className="underline font-bold hover:text-studio-dark cursor-pointer"
                                          >
                                            View Cart & Checkout
                                          </button>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>

                                    {/* Instant E-Commerce Add Button */}
                                    <div className="pt-2 flex gap-2 flex-wrap">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          onAddToCart({
                                            id: `${srv.id}-${activePack.tierName}`,
                                            name: `${srv.title}`,
                                            price: activePack.price,
                                            type: 'service',
                                            itemId: srv.id,
                                            qty: 1,
                                            tierName: activePack.tierName
                                          });
                                          setSuccessNotice(`${srv.id}-${activePack.tierName}`);
                                          setTimeout(() => setSuccessNotice(null), 4000);
                                        }}
                                        className="flex-1 py-3.5 bg-studio-dark hover:bg-studio-bronze text-studio-light text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                      >
                                        Book Scope / Add to Basket
                                        <ShoppingBag className="h-4 w-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleServiceSelect(srv.title)}
                                        className="px-4 py-3.5 border border-studio-dark/40 text-studio-dark hover:bg-studio-dark/5 text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
                                      >
                                        Discuss Scope
                                      </button>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        </ScrollReveal>
      </section>

      {/* Ideal Clients / Framing Matrix */}
      <section className="py-24 bg-studio-cream border-b border-studio-ash/30">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-16">
            <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest block mb-2">
              IDEAL ENGAGEMENT PROFILES
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight">
              We operate best in precise scenarios.
            </h2>
            <p className="font-sans text-sm text-studio-muted font-light leading-relaxed mt-2">
              We do not try to serve everyone. We align strictly with partners who value technical clarity, strategic substance, and premium aesthetic execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Rocket className="h-5 w-5 text-studio-bronze" />,
                title: 'High-Growth Founders',
                scenario: 'You need to raise funding or sign initial enterprise pilot contracts.',
                delivery: 'We build a high-fidelity SaaS MVP (React, Postgres, Stripe, auth) within 4 to 6 weeks, paired with beautiful branding that signals massive enterprise authority.'
              },
              {
                icon: <Cpu className="h-5 w-5 text-studio-bronze" />,
                title: 'Operation-Heavy Businesses',
                scenario: 'Your operations rely on highly repetitive manual administrative labor.',
                delivery: 'We architect smart AI agent pipelines, custom vector search context indexing (RAG), and serverless API integration bridges to eliminate bottleneck costs.'
              },
              {
                icon: <Layers className="h-5 w-5 text-studio-bronze" />,
                title: 'Specialty Premium Brands',
                scenario: 'You are launching a physical wellness, lifestyle, or micro-finance initiative.',
                delivery: 'We design bespoke editorial storefront experiences, custom micro-batch tracing pipelines, and high-end digital storytelling models (like TRIU Naturals).'
              }
            ].map((cl, idx) => (
              <div key={idx} className="bg-studio-light border border-studio-ash/60 p-8 space-y-4 shadow-2xs">
                <div className="p-2 bg-studio-cream inline-block rounded-xs">
                  {cl.icon}
                </div>
                <h3 className="font-serif text-xl font-medium text-studio-dark">
                  {cl.title}
                </h3>
                <div className="space-y-2">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-studio-muted">
                    The Problem
                  </span>
                  <p className="text-xs text-studio-muted leading-relaxed font-light">
                    {cl.scenario}
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-studio-ash/40">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-studio-bronze">
                    Our Formulation
                  </span>
                  <p className="text-xs text-studio-dark leading-relaxed font-light">
                    {cl.delivery}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Structured 4-Step Process Section */}
      <section className="py-24 border-b border-studio-ash/30">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl mb-16">
          <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest block mb-2">
            DELIVERY ENGINE
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight">
            How SALTEDHASH Operates
          </h2>
          <p className="font-sans text-sm text-studio-muted font-light leading-relaxed mt-2">
            We follow a rigid four-stage framework designed to maximize velocity and guarantee production-ready safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step, idx) => (
            <div key={idx} className="border-t border-studio-dark pt-6 relative space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-studio-bronze font-semibold">
                    {step.phase}
                  </span>
                  <span className="font-mono text-[10px] text-studio-muted uppercase">
                    {step.duration}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-medium text-studio-dark">
                  {step.title}
                </h3>
                <p className="font-sans text-xs text-studio-muted font-light leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-studio-ash/30 space-y-2">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-studio-muted font-semibold">
                  Core Deliverable
                </span>
                <ul className="text-[10px] text-studio-dark font-mono space-y-1">
                  {step.deliverables.slice(0, 2).map((del, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3 text-studio-bronze flex-shrink-0" />
                      <span className="truncate">{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        </ScrollReveal>
      </section>

      {/* Tech Positioning Callout */}
      <section className="py-24">
        <ScrollReveal className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <Terminal className="h-8 w-8 text-studio-bronze mx-auto" />
          <h2 className="font-serif text-3xl font-light text-studio-dark">
            Pristine codebases. Boundless scalability.
          </h2>
          <p className="font-sans text-sm text-studio-muted font-light max-w-xl mx-auto leading-relaxed">
            We do not believe in visual trickery. We write modular typescript, construct clean layout classes, and provide full documentation support. Work with a partner who understands substance.
          </p>
          <button
            onClick={() => {
              setActiveTab('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-studio-dark text-studio-light hover:bg-studio-bronze text-xs font-mono uppercase tracking-widest transition-colors duration-300 inline-block cursor-pointer"
          >
            Book Technical Review
          </button>
        </ScrollReveal>
      </section>
    </div>
  );
}
