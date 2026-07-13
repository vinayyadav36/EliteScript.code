import React, { useState } from 'react';
import { ArrowUpRight, Check, Send, ShieldAlert, Cpu } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="studio-footer" className="bg-studio-dark text-studio-ash border-t border-studio-charcoal pt-20 pb-12 relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-studio-bronze/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-studio-card">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-serif text-2xl font-bold tracking-wider text-studio-light">
                  SALTED<span className="text-studio-silver font-light font-sans">HASH</span>
                </span>
                <div className="h-1.5 w-1.5 rounded-full bg-studio-silver" />
              </div>
              <p className="text-sm text-studio-silver font-light leading-relaxed max-w-sm mb-6">
                A logic-led, problem-first, high-trust digital venture studio and product foundry. We design, architect, and engineer serious digital structures.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="max-w-sm">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-studio-muted mb-3">
                STUDIO DISPATCHES & PERSPECTIVES
              </span>
              <form onSubmit={handleSubscribe} className="flex border-b border-studio-muted/30 focus-within:border-studio-silver transition-colors duration-300 pb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Insert your enterprise email"
                  required
                  className="bg-transparent text-xs text-studio-light focus:outline-hidden w-full placeholder-studio-muted font-sans"
                />
                <button
                  type="submit"
                  className="text-studio-silver hover:text-studio-light transition-colors duration-200 ml-2"
                  aria-label="Subscribe"
                >
                  {subscribed ? <Check className="h-4 w-4 text-emerald-500 animate-bounce" /> : <Send className="h-4 w-4" />}
                </button>
              </form>
              {subscribed && (
                <p className="text-[10px] text-emerald-400 font-mono mt-2">
                  System logged: Subscription acknowledged.
                </p>
              )}
            </div>
          </div>

          {/* Directory Column */}
          <div className="lg:col-span-3">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-studio-muted mb-6">
              STUDIO DIRECTORY
            </span>
            <ul className="space-y-3">
              {[
                { id: 'home', label: 'Index & Home' },
                { id: 'studio', label: 'Capabilities & Process' },
                { id: 'ventures', label: 'Venture Portfolio' },
                { id: 'triu', label: 'TRIU Botanical Brand' },
                { id: 'about', label: 'Core Philosophy' },
                { id: 'contact', label: 'Contact & Inquiries' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNav(link.id)}
                    className="text-xs text-studio-silver hover:text-studio-light transition-colors duration-200 flex items-center gap-1 group cursor-pointer"
                  >
                    {link.label}
                    <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Ventures Column */}
          <div className="lg:col-span-2">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-studio-muted mb-6">
              BAKED VENTURES
            </span>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNav('triu')}
                  className="text-xs text-studio-silver hover:text-studio-light transition-colors duration-200 block text-left"
                >
                  TRIU Naturals
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('ventures')}
                  className="text-xs text-studio-silver hover:text-studio-light transition-colors duration-200 block text-left"
                >
                  Shri Nandi Marketing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('ventures')}
                  className="text-xs text-studio-silver hover:text-studio-light transition-colors duration-200 block text-left"
                >
                  Krypton Code Audit
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('studio')}
                  className="text-xs text-studio-silver hover:text-studio-light transition-colors duration-200 block text-left"
                >
                  SALTEDHASH Lab
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Coordinates Column */}
          <div className="lg:col-span-2">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-studio-muted mb-6">
              COORDINATES
            </span>
            <p className="text-xs text-studio-silver font-light leading-relaxed mb-4">
              SALTEDHASH HQ<br />
              Bengaluru, KA<br />
              India
            </p>
            <p className="text-xs text-studio-silver font-mono hover:text-studio-light transition-colors duration-200">
              <a href="mailto:studio@saltedhash.org">studio@saltedhash.org</a>
            </p>
            <p className="text-xs text-studio-muted font-mono mt-1">
              +91 (080) 4920-HASH
            </p>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[11px] text-studio-muted font-mono">
            <span>&copy; {new Date().getFullYear()} SALTEDHASH. All rights reserved.</span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3 text-studio-silver" /> 2026 Epoch Engine
            </span>
          </div>

          <div className="flex gap-6 text-[11px] text-studio-muted font-mono">
            <a href="#privacy" className="hover:text-studio-light transition-colors duration-200">PRIVACY PROTOCOL</a>
            <a href="#terms" className="hover:text-studio-light transition-colors duration-200">TERMS OF UTILITY</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
