/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import StudioView from './components/StudioView';
import VenturesView from './components/VenturesView';
import TriuView from './components/TriuView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import CartDrawer from './components/CartDrawer';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import { Venture, CartItem, Order } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { client } from './lib/appwrite';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);

  // Ping Appwrite backend on load to verify the setup
  useEffect(() => {
    try {
      (client as any).ping()
        .then((response: any) => {
          console.log('[Appwrite] Connection verified, ping successful:', response);
        })
        .catch((error: any) => {
          console.warn('[Appwrite] Ping failed, server unreachable or misconfigured:', error);
        });
    } catch (e) {
      console.warn('[Appwrite] SDK client does not support direct ping method:', e);
    }
  }, []);

  // E-Commerce global state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const [notification, setNotification] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => {
    const checkNotifications = () => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('saltedhash_notification_')) {
          try {
            const notif = JSON.parse(localStorage.getItem(key) || '{}');
            if (notif && !notif.read) {
              setNotification(notif);
              break;
            }
          } catch (e) {
            console.error('Failed to parse notification:', e);
          }
        }
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDismissNotification = () => {
    if (notification) {
      const key = `saltedhash_notification_${notification.id}`;
      localStorage.setItem(key, JSON.stringify({ ...notification, read: true }));
      setNotification(null);
    }
  };

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
    console.log('Secure order created:', order);
    setIsCartOpen(false); // Close cart drawer
    setConfirmedOrder(order); // Trigger confirmation modal
  };

  const cartCount = cart.reduce((acc, curr) => acc + curr.qty, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-studio-light text-studio-dark selection:bg-studio-bronze/20 select-text">
      {/* Alert / Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-[#4f5c4b] text-studio-light px-4 py-2 text-center text-xs font-mono flex justify-between items-center z-50 border-b border-studio-ash/20"
          >
            <span className="mx-auto">
              ✓ Order <strong>#{notification.id}</strong> status updated to: <strong className="underline text-studio-bronze">{notification.status}</strong>.
            </span>
            <button
              onClick={handleDismissNotification}
              className="text-[10px] uppercase font-bold hover:text-studio-bronze border border-studio-light/40 px-2 py-0.5 ml-2 cursor-pointer transition-colors"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Simulated Email Receipt Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}
    </div>
  );
}

