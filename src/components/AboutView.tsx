import React from 'react';
import { Terminal, Shield, Compass, Award } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

export default function AboutView() {
  return (
    <div id="about-view" className="pt-24 min-h-screen">
      {/* Editorial Header */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-b border-studio-ash/30">
        <div className="max-w-4xl space-y-6">
          <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest block">
            OUR ESSENCE & PHILOSOPHY
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-studio-dark leading-tight">
            Built on logic. <br />
            Driven by structural <span className="italic font-normal text-studio-bronze">clarity</span>.
          </h1>
          <p className="font-sans text-lg text-studio-muted font-light leading-relaxed max-w-2xl">
            SALTEDHASH was established as an antidote to the bloated agency model and the speculative hysteria of modern technology. We believe serious digital ventures are built on pristine code, deep strategic rigor, and beautiful typographic craft.
          </p>
        </div>
      </section>

      {/* The Founder Mindset & Vision */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-b border-studio-ash/30">
        <div className="lg:col-span-5">
          <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest block mb-2">
            THE FOUNDING DIALECTIC
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight text-studio-dark">
            Why SALTEDHASH Exists
          </h2>
          <div className="font-sans text-sm text-studio-muted font-light leading-relaxed space-y-4 mt-6">
            <p>
              Most technology agencies operate on billable-hour volume, leading to misaligned incentives and bloated, over-engineered codebases. Most marketing companies focus entirely on surface-level visual noise, sacrificing functional durability.
            </p>
            <p>
              We established SALTEDHASH to combine these separate disciplines under one roof: elite, mathematical systems engineering, combined with high-end, elegant editorial design.
            </p>
            <p>
              We act as technical venture co-founders. We restrict our ongoing project roster to maintain immense attention to detail, treating each line of code as a critical block of a long-term enterprise foundation.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 bg-studio-cream border border-studio-ash/60 p-8 md:p-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-studio-dark flex items-center justify-center text-studio-light font-serif italic text-lg font-semibold border border-studio-bronze">
              S
            </div>
            <div>
              <span className="block font-serif text-lg font-semibold text-studio-dark">SALTEDHASH Principles</span>
              <span className="block font-mono text-[9px] uppercase tracking-wider text-studio-bronze">Active Codified System</span>
            </div>
          </div>

          <blockquote className="font-serif text-xl md:text-2xl italic text-studio-dark leading-relaxed font-light">
            "We do not decorate screens. We construct serious functional pipelines. Every border, typography scale, API schema, and database index is designed to project premium authority and absolute long-term durability."
          </blockquote>

          <div className="pt-4 border-t border-studio-ash/60 flex justify-between text-xs font-mono text-studio-muted">
            <div>
              <span className="block uppercase tracking-wider font-semibold text-studio-dark">{businessConfig.founderName}</span>
              <span className="block">{businessConfig.founderRole}</span>
            </div>
            <div className="text-right">
              <span className="block uppercase tracking-wider font-semibold text-studio-dark">{businessConfig.addressSecondary}</span>
              <span className="block">Venture Operations HQ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Core Philosophy Pillars */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 border-b border-studio-ash/30">
        <div className="max-w-2xl mb-16">
          <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest block mb-2">
            GUIDING PROTOCOLS
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight">
            How We Synthesize Logic & Art
          </h2>
          <p className="font-sans text-sm text-studio-muted font-light leading-relaxed mt-2">
            These four axioms guide every project, script, and brand we build inside the studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: <Terminal className="h-5 w-5 text-studio-bronze" />,
              title: 'Pragmatic Systems Design',
              desc: 'We start by stripping away feature bloat. We define the core operational challenge, then structure the thin, clean, high-performance database schemas and APIs required to resolve it natively.'
            },
            {
              icon: <Shield className="h-5 w-5 text-studio-bronze" />,
              title: 'Uncompromising Code Craft',
              desc: 'We write modular TypeScript, Go, and Rust. Every repository contains precise types, minimal external dependencies, and complete code commentary. We construct things to last past our generation.'
            },
            {
              icon: <Compass className="h-5 w-5 text-studio-bronze" />,
              title: 'Editorial Visual Discipline',
              desc: 'We design with grid discipline, large editorial serif display typography, and restrained colors. Your user interface signals luxury-tech status and establishes absolute trust instantly.'
            },
            {
              icon: <Award className="h-5 w-5 text-studio-bronze" />,
              title: 'Radical Code Sovereignty',
              desc: 'We hate vendor lock-in. We build on open cloud standards and hand over completely pristine, well-structured repositories with zero licensing restrictions. You hold the master keys to your kingdom.'
            }
          ].map((pil, idx) => (
            <div key={idx} className="p-8 border border-studio-ash/60 bg-studio-light space-y-4 hover:border-studio-bronze/40 transition-colors duration-300">
              <div className="p-2 bg-studio-cream inline-block rounded-xs">
                {pil.icon}
              </div>
              <h3 className="font-serif text-xl font-medium text-studio-dark">
                {pil.title}
              </h3>
              <p className="font-sans text-xs md:text-sm text-studio-muted font-light leading-relaxed">
                {pil.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center space-y-6">
        <h2 className="font-serif text-3xl font-light text-studio-dark">
          Are you ready to build a lasting digital asset?
        </h2>
        <p className="font-sans text-sm text-studio-muted font-light max-w-md mx-auto leading-relaxed">
          Let’s discuss your operational friction, custom product goals, or venture partnerships. We are ready to write the code.
        </p>
        <button
          onClick={() => {
            const contactTab = document.getElementById('nav-item-contact');
            if (contactTab) contactTab.click();
          }}
          className="px-6 py-3.5 bg-studio-dark text-studio-light hover:bg-studio-bronze text-xs font-mono uppercase tracking-widest transition-colors duration-300 inline-block cursor-pointer"
        >
          Initiate Partnership Inquiry
        </button>
      </section>
    </div>
  );
}
