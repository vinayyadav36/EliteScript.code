/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import StudioView from './components/StudioView';
import VenturesView from './components/VenturesView';
import TriuView from './components/TriuView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import CartDrawer from './components/CartDrawer';
import { Venture, CartItem, Order } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);

  // E-Commerce global state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Prefill contact form states
  const [prefilledInterest, setPrefilledInterest] = useState<string | null>(null);
  const [prefilledType, setPrefilledType] = useState<'service' | 'preorder' | null>(null);

  const handlePrefillService = (serviceTitle: string) => {
    setPrefilledInterest(serviceTitle);
    setPrefilledType('service');
  };

  const handlePrefillPreorder = (productName: string) => {
    setPrefilledInterest(productName);
    setPrefilledType('preorder');
  };

  const clearPrefills = () => {
    setPrefilledInterest(null);
    setPrefilledType(null);
  };

  // Cart operations
  const handleAddToCart = (newItem: CartItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        return prev.map(item => item.id === newItem.id ? { ...item, qty: item.qty + newItem.qty } : item);
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateCartQty = (id: string, qty: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = (order: Order) => {
    console.log('Secure Tide order created:', order);
  };

  const cartCount = cart.reduce((acc, curr) => acc + curr.qty, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-studio-light text-studio-dark selection:bg-studio-bronze/20 select-text">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
      />

      {/* Main Content Pane with Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'home' && (
              <HomeView
                setActiveTab={setActiveTab}
                onSelectVenture={(v) => {
                  setSelectedVenture(v);
                  setActiveTab('ventures');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
            {activeTab === 'studio' && (
              <StudioView
                setActiveTab={setActiveTab}
                onPrefillService={handlePrefillService}
                onAddToCart={handleAddToCart}
                onCartOpen={() => setIsCartOpen(true)}
              />
            )}
            {activeTab === 'ventures' && (
              <VenturesView
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedVenture={selectedVenture}
                setSelectedVenture={setSelectedVenture}
              />
            )}
            {activeTab === 'triu' && (
              <TriuView
                setActiveTab={setActiveTab}
                onPrefillPreorder={handlePrefillPreorder}
                onAddToCart={handleAddToCart}
                onCartOpen={() => setIsCartOpen(true)}
              />
            )}
            {activeTab === 'about' && (
              <AboutView />
            )}
            {activeTab === 'contact' && (
              <ContactView
                prefilledInterest={prefilledInterest}
                prefilledType={prefilledType}
                clearPrefills={clearPrefills}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Slide-over Checkout Cart & History Tracker */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}

