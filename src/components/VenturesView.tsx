import React, { useState } from 'react';
import { ArrowUpRight, Cpu, Server, Database, X, ExternalLink, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VENTURES } from '../data';
import { Venture } from '../types';
import { businessConfig } from '../config/businessConfig';

interface VenturesViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedVenture: Venture | null;
  setSelectedVenture: (venture: Venture | null) => void;
}

export default function VenturesView({ activeTab, setActiveTab, selectedVenture, setSelectedVenture }: VenturesViewProps) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const categories = ['All', 'Venture Studio', 'E-Commerce & Wellness', 'Marketing & Systems', 'AI Product'];

  const filteredVentures = activeCategoryFilter === 'All'
    ? VENTURES
    : VENTURES.filter(v => v.category === activeCategoryFilter);

  const handleVentureAction = (v: Venture) => {
    if (v.id === 'triu-naturals') {
      setActiveTab('triu');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSelectedVenture(v);
    }
  };

  return (
    <div id="ventures-view" className="pt-24 min-h-screen">
      {/* Editorial Header */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-b border-studio-ash/30">
        <div className="max-w-4xl space-y-6">
          <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest block">
            THE VENTURE ECOSYSTEM
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-studio-dark leading-tight">
            We engineer <span className="italic font-normal text-studio-bronze">substance</span>. <br />
            Our validated creations.
          </h1>
          <p className="font-sans text-lg text-studio-muted font-light leading-relaxed max-w-2xl">
            SALTEDHASH launches internal brands and code-focused systems built to solve high-density commercial challenges. Each brand operates on a modular code repository designed to maximize capital performance.
          </p>
        </div>
      </section>

      {/* Filter Menu */}
      <section className="py-8 max-w-7xl mx-auto px-6 md:px-12 border-b border-studio-ash/30 flex flex-wrap gap-3 items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-studio-muted">
          FILTER ECOSYSTEM DIRECTORY:
        </span>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border rounded-none transition-all duration-300 cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-studio-dark text-studio-light border-studio-dark'
                  : 'bg-transparent text-studio-muted border-studio-ash/60 hover:text-studio-dark hover:border-studio-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Venture Cards Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 border-b border-studio-ash/30">
        {filteredVentures.map((v) => (
          <div
            key={v.id}
            id={`venture-card-${v.id}`}
            className="flex flex-col justify-between border border-studio-ash/60 bg-studio-light hover:shadow-md transition-all duration-500 overflow-hidden"
          >
            <div className="p-8 md:p-10 space-y-8 flex-1">
              {/* Card Title Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-studio-muted block">
                    {v.category}
                  </span>
                  <h2 className="font-serif text-3xl font-light text-studio-dark">
                    {v.name}
                  </h2>
                </div>
                <div
                  className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider border"
                  style={{
                    color: v.accentColor,
                    borderColor: `${v.accentColor}30`,
                    backgroundColor: `${v.accentColor}05`
                  }}
                >
                  {v.status}
                </div>
              </div>

              {/* Tagline & Short Description */}
              <p className="font-serif text-lg italic text-studio-bronze leading-relaxed">
                "{v.tagline}"
              </p>
              <p className="font-sans text-sm text-studio-muted font-light leading-relaxed">
                {v.description}
              </p>

              {/* Core Feature List */}
              <div className="space-y-3 pt-4 border-t border-studio-ash/30">
                <span className="block font-mono text-[9px] uppercase tracking-widest text-studio-dark font-semibold">
                  Architectural Pillars
                </span>
                <ul className="space-y-2 text-xs text-studio-muted font-light">
                  {v.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <Check className="h-3.5 w-3.5 text-studio-bronze mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 bg-studio-cream border-t border-b border-studio-ash/40 divide-x divide-studio-ash/40">
              {v.stats.map((stat, sIdx) => (
                <div key={sIdx} className="p-4 text-center">
                  <span className="block font-serif text-lg font-medium text-studio-dark">
                    {stat.value}
                  </span>
                  <span className="block font-mono text-[8px] uppercase text-studio-muted truncate">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="px-8 py-5 flex justify-between items-center bg-studio-light hover:bg-studio-cream/30 transition-colors duration-300">
              <button
                onClick={() => handleVentureAction(v)}
                className="text-xs font-mono uppercase tracking-widest text-studio-dark hover:text-studio-bronze transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
              >
                {v.id === 'triu-naturals' ? 'Explore Premium Experience' : 'Deconstruct Technical Architecture'}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
              {v.id === 'shri-nandi' && businessConfig.shriNandiPwaUrl && (
                <a
                  href={businessConfig.shriNandiPwaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono uppercase tracking-widest text-studio-bronze hover:text-studio-dark transition-colors duration-200 flex items-center gap-1 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Explore App
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Technical Architecture Deconstructor Modal */}
      <AnimatePresence>
        {selectedVenture && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-studio-dark/85 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-studio-dark text-studio-light border border-studio-card max-w-4xl w-full max-h-[90vh] overflow-y-auto dark-scrollbar"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-studio-card flex justify-between items-start">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-studio-bronze block mb-1">
                    TECHNICAL DECONSTRUCTION // SALTEDHASH BLUEPRINT
                  </span>
                  <h3 className="font-serif text-3xl font-light">
                    {selectedVenture.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedVenture(null)}
                  className="p-1 text-studio-silver hover:text-studio-bronze transition-colors duration-200 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content Panels */}
              <div className="p-6 md:p-8 space-y-8">
                {/* Intro Story */}
                <div className="space-y-3">
                  <span className="block font-mono text-[10px] uppercase text-studio-bronze">
                    STUDIO PURPOSE & FORMULATION
                  </span>
                  <p className="font-sans text-sm text-studio-silver font-light leading-relaxed">
                    {selectedVenture.longDescription}
                  </p>
                </div>

                {/* System Blueprint Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-studio-card">
                  {/* Panel 1: Ingestion */}
                  <div className="border border-studio-card p-5 space-y-3 bg-studio-charcoal">
                    <div className="flex items-center gap-2 text-studio-bronze">
                      <Cpu className="h-4 w-4" />
                      <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                        Ingestion Layer
                      </span>
                    </div>
                    <ul className="text-xs text-studio-silver font-light space-y-1.5 list-disc pl-3">
                      {selectedVenture.id === 'shri-nandi' ? (
                        <>
                          <li>Localized keyword crawlers</li>
                          <li>Dynamic API hookups</li>
                          <li>Event trackers (WS)</li>
                        </>
                      ) : selectedVenture.id === 'krypton-audit' ? (
                        <>
                          <li>CLI pre-commit webhooks</li>
                          <li>GitHub push trigger listeners</li>
                          <li>Incremental AST diff collectors</li>
                        </>
                      ) : (
                        <>
                          <li>Premium Figma design tokens</li>
                          <li>React boilerplate generators</li>
                          <li>Standard ESLint strict engines</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Panel 2: Compute */}
                  <div className="border border-studio-card p-5 space-y-3 bg-studio-charcoal">
                    <div className="flex items-center gap-2 text-studio-bronze">
                      <Server className="h-4 w-4" />
                      <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                        Computation Core
                      </span>
                    </div>
                    <ul className="text-xs text-studio-silver font-light space-y-1.5 list-disc pl-3">
                      {selectedVenture.id === 'shri-nandi' ? (
                        <>
                          <li>Programmatic copy synthesizer</li>
                          <li>Review filter algorithms</li>
                          <li>Scheduled background jobs</li>
                        </>
                      ) : selectedVenture.id === 'krypton-audit' ? (
                        <>
                          <li>Fine-tuned semantic models</li>
                          <li>Drizzle schema checkers</li>
                          <li>Automated PR generators</li>
                        </>
                      ) : (
                        <>
                          <li>Bundled esbuild server runs</li>
                          <li>Secure lazy initialization</li>
                          <li>Stripe billing webhooks</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Panel 3: Storage */}
                  <div className="border border-studio-card p-5 space-y-3 bg-studio-charcoal">
                    <div className="flex items-center gap-2 text-studio-bronze">
                      <Database className="h-4 w-4" />
                      <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                        Storage & Relational DB
                      </span>
                    </div>
                    <ul className="text-xs text-studio-silver font-light space-y-1.5 list-disc pl-3">
                      {selectedVenture.id === 'shri-nandi' ? (
                        <>
                          <li>PostgreSQL (Drizzle ORM)</li>
                          <li>Redis key-value cache rails</li>
                          <li>Indexed query optimizations</li>
                        </>
                      ) : selectedVenture.id === 'krypton-audit' ? (
                        <>
                          <li>Fine-tuning vector databases</li>
                          <li>Encrypted vulnerability logs</li>
                          <li>Temporary AST file caches</li>
                        </>
                      ) : (
                        <>
                          <li>Firestore structured collections</li>
                          <li>Secure Auth session tokens</li>
                          <li>Full transaction logs</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Technical Code Preview */}
                <div className="border border-studio-card bg-studio-charcoal rounded-none">
                  <div className="px-4 py-2 border-b border-studio-card flex justify-between items-center text-[10px] font-mono text-studio-muted">
                    <span>SYSTEM CORE UTILITY</span>
                    <span>TYPESCRIPT / CJS MODULE</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-[11px] font-mono text-emerald-400 leading-relaxed max-h-48 overflow-y-auto">
                    {selectedVenture.id === 'shri-nandi' ? (
`// shri-nandi/local-seo-engine.ts
import { db } from './db/schema';
import { generateProgrammaticLandingPage } from './ai/copywriter';

export async function processLocalVacancies(region: string) {
  const vacancies = await db.select().from('seo_vacancies').where({ region });
  for (const vacancy of vacancies) {
    const landing = await generateProgrammaticLandingPage(vacancy.keyword);
    await db.insert('landing_pages').values({
      keyword: vacancy.keyword,
      slug: \`/\${vacancy.keyword.replace(/\\s+/g, '-')}\`,
      compiledHtml: landing.body
    });
  }
}`
                    ) : selectedVenture.id === 'krypton-audit' ? (
`// krypton/scanner-ast.ts
import { GoogleGenAI } from '@google/genai';
import { parseCodeToAST } from './utils/ast';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function checkSecurityAstDiff(rawCode: string) {
  const ast = parseCodeToAST(rawCode);
  const aiResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ text: \`Review code AST for OWASP vulnerabilities:\\n\${JSON.stringify(ast)}\` }],
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(aiResponse.text);
}`
                    ) : (
`// saltedhash/foundry-bootstrap.ts
import express from 'express';
import { createServer } from 'vite';

export async function initializeFoundryServer() {
  const app = express();
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }
  app.listen(3000, '0.0.0.0');
}`
                    )}
                  </pre>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-6 border-t border-studio-card bg-studio-charcoal flex justify-between items-center">
                <span className="font-mono text-[9px] text-studio-muted">
                  AUTH SYSTEM: SECURED SECURE LAYER 256-BIT
                </span>
                <button
                  onClick={() => {
                    setSelectedVenture(null);
                    setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-studio-bronze hover:bg-studio-accent text-studio-dark text-xs font-mono uppercase tracking-widest transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
                >
                  Discuss Integration Setup
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
