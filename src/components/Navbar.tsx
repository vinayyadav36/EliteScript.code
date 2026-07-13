import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onContactPrefill?: (interest: any) => void;
  cartCount: number;
  onCartToggle: () => void;
}

export default function Navbar({ activeTab, setActiveTab, onContactPrefill, cartCount, onCartToggle }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'studio', label: 'The Studio' },
    { id: 'ventures', label: 'Ventures' },
    { id: 'triu', label: 'TRIU Botanical' },
    { id: 'about', label: 'Our Philosophy' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-studio-light/85 backdrop-blur-md border-b border-studio-ash/30 py-3 shadow-xs'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <button
            id="nav-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group cursor-pointer text-left"
          >
            <span className="font-serif text-xl md:text-2xl font-semibold tracking-wider transition-colors duration-300 group-hover:text-studio-bronze">
              SALTED<span className="text-studio-bronze font-light font-sans">HASH</span>
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-studio-bronze animate-pulse" />
          </button>

          {/* Desktop Nav */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative text-xs font-mono uppercase tracking-widest py-1 transition-colors duration-300 hover:text-studio-dark cursor-pointer ${
                    isActive ? 'text-studio-dark font-medium' : 'text-studio-muted'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-studio-bronze"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA & Cart Section */}
          <div className="flex items-center gap-4">
            {/* Shopping Cart Trigger */}
            <button
              id="navbar-cart-trigger"
              onClick={onCartToggle}
              className="relative p-2 text-studio-dark hover:text-studio-bronze transition-colors duration-300 cursor-pointer flex items-center justify-center"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="h-5 w-5 stroke-1.5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-studio-bronze text-studio-light font-mono text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-xs"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <div className="hidden lg:flex items-center gap-4">
              <button
                id="nav-cta-contact"
                onClick={() => handleNavClick('contact')}
                className={`flex items-center gap-1 px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-none border border-studio-dark transition-all duration-300 hover:bg-studio-dark hover:text-studio-light cursor-pointer ${
                  activeTab === 'contact' ? 'bg-studio-dark text-studio-light' : 'bg-transparent text-studio-dark'
                }`}
              >
                Initiate Inquiry
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-studio-dark hover:text-studio-bronze transition-colors duration-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden bg-studio-cream pt-24 pb-8 px-6 md:px-12 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-6 mt-8">
              {navItems.map((item, index) => {
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    id={`mobile-nav-item-${item.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavClick(item.id)}
                    className="text-left py-2"
                  >
                    <span className="font-mono text-xs text-studio-muted mr-3">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <span
                      className={`font-serif text-2xl md:text-3xl tracking-wide ${
                        isActive ? 'text-studio-bronze italic font-semibold' : 'text-studio-dark font-light'
                      }`}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}

              <motion.button
                id="mobile-nav-item-contact"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                onClick={() => handleNavClick('contact')}
                className="text-left py-2 flex items-center gap-2"
              >
                <span className="font-mono text-xs text-studio-muted mr-3">06</span>
                <span
                  className={`font-serif text-2xl md:text-3xl tracking-wide ${
                    activeTab === 'contact' ? 'text-studio-bronze italic font-semibold' : 'text-studio-dark font-light'
                  }`}
                >
                  Initiate Inquiry
                </span>
                <ArrowUpRight className="h-5 w-5 text-studio-bronze" />
              </motion.button>
            </div>

            <div className="border-t border-studio-ash/60 pt-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-studio-muted mb-2">
                SALTEDHASH Product Lab
              </p>
              <p className="text-xs text-studio-muted font-light leading-relaxed">
                A logic-led, problem-first, high-trust venture studio and product engineering foundry.
              </p>
              <div className="flex items-center gap-1 mt-4 text-[10px] font-mono text-studio-muted">
                <ShieldCheck className="h-3 w-3 text-studio-bronze" /> Secure Encrypted Infrastructure
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
