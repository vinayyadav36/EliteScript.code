import React from 'react';
import { ArrowUpRight, Cpu, Layers, Sparkles, Code2, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { businessConfig } from '../config/businessConfig';
import { VENTURES, SERVICES } from '../data';
import { Venture } from '../types';
import ScrollReveal from './ScrollReveal';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  onSelectVenture: (venture: Venture) => void;
}

export default function HomeView({ setActiveTab, onSelectVenture }: HomeViewProps) {
  // Stagger animation helpers
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div id="home-view" className="relative pt-24">
      {/* Editorial Grid Gridlines (Background Decorative) */}
      <div className="absolute inset-0 z-0 flex justify-between max-w-7xl mx-auto px-6 md:px-12 pointer-events-none opacity-[0.03]">
        <div className="w-px h-full bg-studio-dark" />
        <div className="w-px h-full bg-studio-dark hidden sm:block" />
        <div className="w-px h-full bg-studio-dark hidden md:block" />
        <div className="w-px h-full bg-studio-dark hidden lg:block" />
        <div className="w-px h-full bg-studio-dark" />
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12 py-16 max-w-7xl mx-auto z-10 border-b border-studio-ash/30">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Label Tag */}
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest bg-studio-cream border border-studio-ash/50 px-3 py-1 font-medium">
              Venture Studio & Product Foundry
            </span>
            <div className="h-1 w-8 bg-studio-bronze/30" />
          </motion.div>

          {/* Positioning Statement */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-studio-dark max-w-5xl leading-[1.05]"
          >
            We architect systems. <br />
            We construct <span className="italic font-normal text-studio-bronze">ventures</span>.
          </motion.h1>

          {/* Brand Explanation */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-lg sm:text-xl text-studio-muted font-light max-w-2xl leading-relaxed"
          >
            {businessConfig.name} is a logic-led product lab combining severe engineering discipline, commercial strategy, and modern typography to build high-trust digital platforms and consumer ventures.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-4">
            <button
              id="hero-cta-studio"
              onClick={() => {
                setActiveTab('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 bg-studio-dark text-studio-light text-xs font-mono uppercase tracking-widest transition-all duration-300 hover:bg-studio-bronze flex items-center gap-2 group cursor-pointer"
            >
              Explore the Studio
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              id="hero-cta-ventures"
              onClick={() => {
                setActiveTab('ventures');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 border border-studio-dark/25 text-studio-dark text-xs font-mono uppercase tracking-widest transition-all duration-300 hover:border-studio-dark hover:bg-studio-cream/30 flex items-center gap-2 cursor-pointer"
            >
              View Venture Portfolio
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>

        {/* Dynamic Micro-Stats Rail */}
        <div className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 border-t border-studio-ash/60 pt-6 flex flex-wrap justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-studio-bronze">01</span>
            <span className="text-xs uppercase font-mono tracking-wider text-studio-muted">AI & Software Lab</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-studio-bronze">02</span>
            <span className="text-xs uppercase font-mono tracking-wider text-studio-muted">Durable Ventures Shipped</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-studio-bronze">03</span>
            <span className="text-xs uppercase font-mono tracking-wider text-studio-muted">No Agency Bloat</span>
          </div>
        </div>
      </section>

      {/* Flagship Venture Showcase Section */}
      <section id="venture-showcase" className="py-24 bg-studio-cream border-b border-studio-ash/30">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest block mb-2">
                SELECTED VENTURE RELEASES
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight">
                Our Active Product Portfolio
              </h2>
            </div>
            <button
              id="showcase-view-all"
              onClick={() => {
                setActiveTab('ventures');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-mono uppercase tracking-widest text-studio-muted hover:text-studio-dark transition-colors duration-200 flex items-center gap-1 cursor-pointer group"
            >
              View Ecosystem Directory
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VENTURES.slice(0, 2).map((venture) => (
              <div
                key={venture.id}
                id={`venture-preview-card-${venture.id}`}
                className="bg-studio-light border border-studio-ash/50 group overflow-hidden transition-all duration-500 hover:shadow-md flex flex-col justify-between"
              >
                <div className="p-8 md:p-10 border-b border-studio-ash/30">
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-xs text-studio-muted uppercase tracking-wider">
                      {venture.category}
                    </span>
                    <span
                      className="px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider border rounded-xs"
                      style={{
                        borderColor: `${venture.accentColor}30`,
                        color: venture.accentColor,
                        backgroundColor: `${venture.accentColor}05`
                      }}
                    >
                      {venture.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl md:text-4xl font-light text-studio-dark mb-4">
                    {venture.name}
                  </h3>
                  <p className="font-sans text-sm text-studio-muted leading-relaxed font-light mb-6">
                    {venture.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {venture.stats.slice(0, 2).map((stat, sIdx) => (
                      <div key={sIdx} className="border-l border-studio-ash/80 pl-3">
                        <span className="block font-serif text-xl font-medium text-studio-dark">
                          {stat.value}
                        </span>
                        <span className="block font-mono text-[10px] uppercase text-studio-muted">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-8 py-5 bg-studio-cream/50 group-hover:bg-studio-cream transition-colors duration-300 flex justify-between items-center">
                  <button
                    onClick={() => {
                      if (venture.id === 'triu-naturals') {
                        setActiveTab('triu');
                      } else {
                        onSelectVenture(venture);
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-mono uppercase tracking-widest text-studio-dark group-hover:text-studio-bronze transition-colors duration-200 cursor-pointer"
                  >
                    {venture.id === 'triu-naturals' ? 'Explore Brand Experience' : 'Deconstruct Technical Architecture'}
                  </button>
                  <ArrowUpRight className="h-4 w-4 text-studio-muted group-hover:text-studio-bronze transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Quick Capabilities Overview */}
      <section id="capabilities-intro" className="py-24 border-b border-studio-ash/30">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest block mb-2">
              STUDIO COMPETENCY
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight mb-6">
              Engineering Serious Digital Infrastructure
            </h2>
            <p className="font-sans text-sm md:text-base text-studio-muted font-light leading-relaxed mb-8">
              We skip the visual embellishments to deliver robust functional realities. Our studio helps brands launch clean software, custom AI microservices, and fast marketing automation, built with precision and logic.
            </p>
            <button
              id="capabilities-cta"
              onClick={() => {
                setActiveTab('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 border border-studio-dark text-studio-dark hover:bg-studio-dark hover:text-studio-light text-xs font-mono uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              Learn our Approach
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {SERVICES.slice(0, 4).map((srv) => (
              <div key={srv.id} className="p-6 border border-studio-ash/40 bg-studio-light hover:border-studio-bronze/40 transition-colors duration-300">
                <span className="font-mono text-[10px] text-studio-bronze uppercase tracking-widest block mb-4">
                  {srv.category}
                </span>
                <h3 className="font-serif text-lg font-medium text-studio-dark mb-2">
                  {srv.title}
                </h3>
                <p className="font-sans text-xs text-studio-muted font-light leading-relaxed mb-4">
                  {srv.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {srv.capabilities.slice(0, 2).map((cap, cIdx) => (
                    <span key={cIdx} className="font-mono text-[9px] px-2 py-0.5 bg-studio-cream text-studio-muted">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>

      {/* Short Philosophy Section */}
      <section id="philosophy-intro" className="py-24 bg-studio-dark text-studio-ash overflow-hidden relative border-b border-studio-charcoal">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-studio-bronze/5 blur-3xl pointer-events-none" />
        
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest block mb-2">
              WHY {businessConfig.name}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-studio-light tracking-tight">
              An intense alignment with structure, substance, and high trust.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Problem-First Logic',
                desc: 'We ignore the technical fads. We identify core operational or commercial friction first, then write clean, highly optimized code to dissolve it completely.'
              },
              {
                num: '02',
                title: 'Absolute Craft Discipline',
                desc: 'A high-trust product is built on a thousand micro-decisions executed with severe care. We choose specific margins, fast database schemas, and pristine layouts.'
              },
              {
                num: '03',
                title: 'No Technical Lock-In',
                desc: 'You own your repositories, cloud setups, and design system variables. We deliver scalable code designed for straightforward handoff to internal engineering teams.'
              }
            ].map((phi) => (
              <div key={phi.num} className="border-t border-studio-card pt-8 relative">
                <span className="font-mono text-5xl font-extralight text-studio-bronze/20 absolute -top-3 right-0">
                  {phi.num}
                </span>
                <h3 className="font-serif text-lg font-medium text-studio-light mb-3">
                  {phi.title}
                </h3>
                <p className="font-sans text-xs text-studio-silver font-light leading-relaxed">
                  {phi.desc}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Premium Bottom Call-to-Action Section */}
      <section id="bottom-cta" className="py-32 relative z-10">
        <ScrollReveal className="max-w-3xl mx-auto px-6 md:px-12 text-center space-y-8">
          <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest bg-studio-cream border border-studio-ash px-3 py-1 inline-block">
            PARTNERSHIP INQUIRIES
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight">
            Ready to build a digital platform with substance?
          </h2>
          <p className="font-sans text-sm md:text-base text-studio-muted font-light max-w-xl mx-auto leading-relaxed">
            Whether you are a venture founder looking to prototype a high-fidelity SaaS MVP, or a business seeking serious AI automation workflows, we are ready to write the code.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <button
              id="bottom-cta-initiate"
              onClick={() => {
                setActiveTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 bg-studio-dark text-studio-light hover:bg-studio-bronze transition-colors duration-300 text-xs font-mono uppercase tracking-widest flex items-center gap-2 cursor-pointer"
            >
              Initiate Project Inquiry
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
