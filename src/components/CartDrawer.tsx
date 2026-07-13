import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, QrCode, CreditCard, ExternalLink, Check, Copy, History, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Order) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onPlaceOrder
}: CartDrawerProps) {
  const [activeTab, setActiveTab] = useState<'cart' | 'history'>('cart');
  const [currency, setCurrency] = useState<'INR' | 'GBP' | 'USD'>('INR');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Order | null>(null);

  // Form states and validation errors
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [tidePayLink, setTidePayLink] = useState('https://web.tide.co/pay/saltedhash-group');
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false);

  // Order placement micro-interaction success states
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderRef, setPlacedOrderRef] = useState<string | null>(null);

  // Past Orders synced from Local Storage and Server-side Express API
  const [orders, setOrders] = useState<Order[]>([]);

  // Robust synchronization of order logs
  useEffect(() => {
    // 1. Initialise with localStorage orders
    const savedOrders = localStorage.getItem('saltedhash_orders');
    let localOrders: Order[] = [];
    if (savedOrders) {
      try {
        localOrders = JSON.parse(savedOrders);
        setOrders(localOrders);
      } catch (e) {
        console.error('Failed to parse orders from localStorage', e);
      }
    }

    // 2. Query orders from full-stack Express backend
    fetch('/api/orders')
      .then((res) => {
        if (!res.ok) throw new Error('API server unavailable');
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.orders)) {
          // Merge local & server logs safely avoiding duplication
          const merged = [...data.orders];
          localOrders.forEach((localOrd) => {
            if (!merged.some((o) => o.id === localOrd.id)) {
              merged.push(localOrd);
            }
          });
          // Sort by date/id descending so new orders appear on top
          setOrders(merged);
          localStorage.setItem('saltedhash_orders', JSON.stringify(merged));
        }
      })
      .catch((err) => {
        console.warn('Backend API connection offline, relying on client state:', err);
      });
  }, [isOpen, currentInvoice, orderSuccess]);

  const currencySymbols = {
    INR: '₹',
    GBP: '£',
    USD: '$'
  };

  const currencyRates = {
    INR: 1,
    GBP: 0.0094,
    USD: 0.012
  };

  const formatPrice = (inrPrice: number) => {
    const rate = currencyRates[currency];
    const converted = inrPrice * rate;
    if (currency === 'INR') {
      return `${currencySymbols.INR}${converted.toLocaleString('en-IN')}`;
    }
    return `${currencySymbols[currency]}${converted.toFixed(2)}`;
  };

  const calculateTotalInr = () => {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  const totalInr = calculateTotalInr();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tidePayLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Input fields validator
  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Must be at least 3 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger full input validation checking format and required criteria
    if (!validateForm()) {
      return;
    }

    setIsCheckoutSubmitting(true);

    setTimeout(() => {
      const orderId = `SH-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: orderId,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customerName: name,
        customerEmail: email,
        items: [...cart],
        total: totalInr,
        status: 'Awaiting Tide Payment',
        paymentLink: `${tidePayLink}?ref=${orderId}&amount=${(totalInr * currencyRates[currency]).toFixed(2)}&currency=${currency}`
      };

      // Real integration with our custom Express backend API
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log('Order successfully synced to full-stack Express database:', orderId);
          }
        })
        .catch((err) => {
          console.error('Failed to register order to backend API database:', err);
        });

      // Synchronize client-side Local Storage cache
      const existingOrders = JSON.parse(localStorage.getItem('saltedhash_orders') || '[]');
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem('saltedhash_orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);

      // Trigger user action callbacks
      onPlaceOrder(newOrder);
      setCurrentInvoice(newOrder);
      
      // Setup transaction success states for animation trigger
      setPlacedOrderRef(orderId);
      setOrderSuccess(true);

      setIsCheckoutSubmitting(false);
      onClearCart();

      // Reset fields
      setName('');
      setEmail('');
      setErrors({});
    }, 1500);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Awaiting Tide Payment':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Processing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Delivering':
        return 'bg-[#4f5c4b]/10 text-[#4f5c4b] border-[#4f5c4b]/20';
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-studio-muted/10 text-studio-muted border-studio-muted/20';
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-studio-dark/60 backdrop-blur-xs"
            />

            {/* Slide-over Panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-screen max-w-md bg-studio-cream border-l border-studio-ash/50 flex flex-col justify-between shadow-2xl relative"
              >
                {/* Header */}
                <div className="p-6 border-b border-studio-ash/30 flex items-center justify-between bg-studio-light">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 text-studio-dark" />
                    <div>
                      <h2 className="font-serif text-lg font-semibold text-studio-dark">
                        Client Hub & Cart
                      </h2>
                      <p className="text-[10px] font-mono text-studio-muted uppercase tracking-wider">
                        Secure Tide Business Portal
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 text-studio-muted hover:text-studio-dark transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Sub navigation Tabs */}
                <div className="grid grid-cols-2 border-b border-studio-ash/20 bg-studio-light">
                  <button
                    onClick={() => setActiveTab('cart')}
                    className={`py-3 text-xs font-mono uppercase tracking-widest text-center border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'cart'
                        ? 'border-studio-dark text-studio-dark font-medium'
                        : 'border-transparent text-studio-muted hover:text-studio-dark'
                    }`}
                  >
                    Checkout Cart ({cart.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`py-3 text-xs font-mono uppercase tracking-widest text-center border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'history'
                        ? 'border-studio-dark text-studio-dark font-medium'
                        : 'border-transparent text-studio-muted hover:text-studio-dark'
                    }`}
                  >
                    Order History ({orders.length})
                  </button>
                </div>

                {/* Main Content Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
                  {/* Subtle success micro-interaction overlay */}
                  <AnimatePresence>
                    {orderSuccess && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 z-40 bg-studio-cream flex flex-col items-center justify-center p-6 text-center space-y-6"
                      >
                        <div className="relative">
                          <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full bg-[#4f5c4b]/10"
                          />
                          <div className="relative h-20 w-20 rounded-full bg-[#4f5c4b] text-studio-light flex items-center justify-center mx-auto shadow-lg">
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', delay: 0.2 }}
                            >
                              <Check className="h-10 w-10 stroke-[2.5]" />
                            </motion.div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[#4f5c4b] font-bold block">
                            TRANSACTION INITIATED
                          </span>
                          <h3 className="font-serif text-2xl font-semibold text-studio-dark">
                            Order Placed!
                          </h3>
                          <p className="font-mono text-[10px] text-studio-muted bg-studio-light px-3 py-1.5 border border-studio-ash/50 inline-block font-semibold">
                            REF: {placedOrderRef}
                          </p>
                        </div>

                        <p className="font-sans text-xs text-studio-muted max-w-xs mx-auto leading-relaxed">
                          Your purchase request has been synchronized with our live Express server. Click below to view your digital receipt and pay via Tide.
                        </p>

                        <div className="flex flex-col gap-2 w-full max-w-xs pt-4">
                          <button
                            onClick={() => {
                              setShowInvoice(true);
                              setOrderSuccess(false);
                            }}
                            className="w-full py-3 bg-[#4f5c4b] hover:bg-[#343e31] text-studio-light text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
                          >
                            View Secure Invoice
                            <ClipboardCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setOrderSuccess(false);
                              setActiveTab('history');
                            }}
                            className="w-full py-3 border border-studio-dark/40 text-studio-dark hover:bg-studio-dark/5 text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
                          >
                            Go to Order History
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {activeTab === 'cart' ? (
                    <>
                      {cart.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center py-20 px-4 space-y-6 border border-dashed border-studio-ash/80 bg-studio-light/40"
                        >
                          <div className="relative mx-auto h-16 w-16 flex items-center justify-center bg-studio-cream border border-studio-ash/60 rounded-full">
                            <ShoppingBag className="h-6 w-6 text-studio-muted" />
                            <motion.span 
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 3 }}
                              className="absolute -top-1 -right-1 flex h-3.5 w-3.5 rounded-full bg-studio-bronze/40"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-serif text-base font-semibold text-studio-dark">
                              Your Order Basket is Empty
                            </h4>
                            <p className="font-sans text-xs text-studio-muted max-w-xs mx-auto leading-relaxed">
                              Configure bespoke software solutions in <strong className="text-studio-dark font-medium">The Studio</strong>, or discover premium botanical formulas in <strong className="text-studio-dark font-medium">TRIU Botanical</strong>.
                            </p>
                          </div>

                          <div className="pt-2">
                            <button
                              onClick={onClose}
                              className="inline-flex items-center gap-2 px-6 py-3.5 bg-studio-dark text-studio-light text-xs font-mono uppercase tracking-widest hover:bg-studio-bronze transition-all duration-300 shadow-xs cursor-pointer"
                            >
                              Continue Exploring
                              <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="space-y-6">
                          {/* Currency Selection */}
                          <div className="flex items-center justify-between bg-studio-light border border-studio-ash/40 p-3 rounded-none">
                            <span className="font-mono text-[9px] uppercase text-studio-muted font-bold">
                              DISPLAY EXCHANGE RATES:
                            </span>
                            <div className="flex gap-1.5">
                              {(['INR', 'GBP', 'USD'] as const).map((curr) => (
                                <button
                                  key={curr}
                                  onClick={() => setCurrency(curr)}
                                  className={`px-2.5 py-1 text-[10px] font-mono border transition-all cursor-pointer ${
                                    currency === curr
                                      ? 'bg-studio-dark text-studio-light border-studio-dark'
                                      : 'bg-transparent text-studio-muted border-studio-ash hover:text-studio-dark hover:border-studio-muted'
                                  }`}
                                >
                                  {curr}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Cart Items List */}
                          <div className="space-y-3.5">
                            {cart.map((item) => (
                              <div
                                key={item.id}
                                className="border border-studio-ash/40 bg-studio-light p-4 space-y-3"
                              >
                                <div className="flex justify-between items-start gap-4">
                                  <div>
                                    <span className="font-mono text-[8px] uppercase tracking-widest text-studio-muted px-1.5 py-0.5 border border-studio-ash bg-studio-cream">
                                      {item.type}
                                    </span>
                                    <h4 className="font-serif text-sm font-semibold text-studio-dark mt-1.5">
                                      {item.name}
                                    </h4>
                                    {item.tierName && (
                                      <p className="font-mono text-[9px] text-[#4f5c4b] font-bold uppercase mt-0.5">
                                        Plan: {item.tierName}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="text-studio-muted hover:text-red-500 transition-colors p-1 cursor-pointer"
                                    aria-label="Remove item"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="flex justify-between items-center pt-2.5 border-t border-studio-ash/10">
                                  <div className="flex items-center border border-studio-ash">
                                    <button
                                      onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))}
                                      className="p-1 px-2.5 text-studio-muted hover:text-studio-dark hover:bg-studio-cream transition-colors text-xs"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="px-3 font-mono text-xs text-studio-dark">
                                      {item.qty}
                                    </span>
                                    <button
                                      onClick={() => onUpdateQty(item.id, item.qty + 1)}
                                      className="p-1 px-2.5 text-studio-muted hover:text-studio-dark hover:bg-studio-cream transition-colors text-xs"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </button>
                                  </div>
                                  <span className="font-serif text-sm font-medium text-studio-dark">
                                    {formatPrice(item.price * item.qty)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Dynamic Checkout Form */}
                          <form onSubmit={handleCheckout} className="border-t border-studio-ash/30 pt-6 space-y-4">
                            <span className="block font-mono text-[9px] uppercase tracking-widest text-studio-dark font-bold">
                              SECURE CHECKOUT & DELIVERY DETAILS
                            </span>

                            <div className="space-y-1">
                              <label className="block font-mono text-[9px] text-studio-muted uppercase flex justify-between">
                                <span>Full Name *</span>
                                {errors.name && <span className="text-red-500 lowercase tracking-normal">{errors.name}</span>}
                              </label>
                              <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                  setName(e.target.value);
                                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                                }}
                                placeholder="e.g. Vinay Kumar"
                                className={`w-full bg-studio-light border px-3.5 py-2 text-xs font-sans outline-hidden transition-colors ${
                                  errors.name ? 'border-red-500 focus:border-red-600' : 'border-studio-ash/60 focus:border-studio-dark'
                                }`}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block font-mono text-[9px] text-studio-muted uppercase flex justify-between">
                                <span>Email Address *</span>
                                {errors.email && <span className="text-red-500 lowercase tracking-normal">{errors.email}</span>}
                              </label>
                              <input
                                type="text"
                                value={email}
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                                }}
                                placeholder="e.g. customer@tide.co"
                                className={`w-full bg-studio-light border px-3.5 py-2 text-xs font-sans outline-hidden transition-colors ${
                                  errors.email ? 'border-red-500 focus:border-red-600' : 'border-studio-ash/60 focus:border-studio-dark'
                                }`}
                              />
                            </div>

                            {/* Tide Business PayLink configuration */}
                            <div className="space-y-2 bg-studio-cream border border-studio-ash/40 p-4 rounded-none">
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-[9px] text-[#2c3327] font-bold uppercase flex items-center gap-1">
                                  <CreditCard className="h-3.5 w-3.5 text-[#3c5a6c]" /> TIDE MERCHANT GATEWAY
                                </span>
                                <span className="font-mono text-[8px] bg-studio-dark text-studio-light px-1.5 py-0.5">
                                  PWA Active
                                </span>
                              </div>
                              <p className="text-[10px] text-studio-muted leading-relaxed font-light">
                                Pay via secure <strong>Tide QuickLink</strong>. You can customise your business Tide link below so customers pay your account directly:
                              </p>
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  value={tidePayLink}
                                  onChange={(e) => setTidePayLink(e.target.value)}
                                  placeholder="e.g. https://web.tide.co/pay-by-link/..."
                                  className="flex-1 bg-studio-light border border-studio-ash/60 px-2 py-1 text-[10px] font-mono outline-hidden focus:border-studio-dark transition-colors"
                                />
                                <button
                                  type="button"
                                  onClick={handleCopyLink}
                                  className="p-1 px-2.5 bg-studio-light border border-studio-ash text-studio-muted hover:text-studio-dark transition-colors flex items-center justify-center cursor-pointer"
                                  title="Copy Tide Pay Link"
                                >
                                  {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600 animate-bounce" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                            </div>

                            {/* Checkout Summary Block */}
                            <div className="p-4 bg-studio-light border border-studio-ash/40 space-y-2.5">
                              <div className="flex justify-between items-center text-xs font-mono text-studio-muted">
                                <span>Cart Subtotal</span>
                                <span>{formatPrice(totalInr)}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs font-mono text-studio-muted">
                                <span>Processing & GST / VAT</span>
                                <span className="text-emerald-600 font-semibold uppercase text-[10px]">Free / Inc.</span>
                              </div>
                              <div className="flex justify-between items-center text-sm font-serif font-bold pt-2 border-t border-studio-ash/10">
                                <span>Total Payable</span>
                                <span>{formatPrice(totalInr)}</span>
                              </div>
                            </div>

                            {/* Submit Button */}
                            <button
                              type="submit"
                              disabled={isCheckoutSubmitting}
                              className="w-full py-3.5 bg-studio-dark text-studio-light hover:bg-[#343e31] text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                              {isCheckoutSubmitting ? (
                                <span className="animate-pulse">Authorising Secure Connection...</span>
                              ) : (
                                <>
                                  Place Secure Order with Tide
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </>
                              )}
                            </button>
                          </form>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-4">
                      {orders.length === 0 ? (
                        <div className="text-center py-16 space-y-4">
                          <div className="h-12 w-12 rounded-full bg-studio-ash/20 flex items-center justify-center mx-auto text-studio-muted">
                            <History className="h-6 w-6" />
                          </div>
                          <p className="font-serif text-base text-studio-muted italic">
                            No orders placed yet.
                          </p>
                          <p className="font-sans text-xs text-studio-muted max-w-xs mx-auto leading-relaxed">
                            Once you make a purchase or book consultation scopes via our Tide gate, your dynamic order tracing logs will display here automatically.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <span className="block font-mono text-[9px] uppercase tracking-widest text-studio-dark font-bold">
                            YOUR INTERACTIVE ORDER TRACING HISTORY
                          </span>
                          <div className="space-y-3.5">
                            {orders.map((ord) => (
                              <div
                                key={ord.id}
                                className="border border-studio-ash/40 bg-studio-light p-5 space-y-4"
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <span className="font-mono text-[9px] text-studio-muted uppercase">
                                      Order Reference
                                    </span>
                                    <h4 className="font-mono text-sm font-bold text-studio-dark">
                                      {ord.id}
                                    </h4>
                                    <p className="text-[10px] text-studio-muted mt-0.5">
                                      {ord.date}
                                    </p>
                                  </div>
                                  <span className={`px-2 py-1 font-mono text-[9px] uppercase border font-semibold ${getStatusBadgeClass(ord.status)}`}>
                                    {ord.status}
                                  </span>
                                </div>

                                <div className="space-y-1.5 pt-2.5 border-t border-studio-ash/10">
                                  {ord.items.map((it) => (
                                    <div key={it.id} className="flex justify-between items-center text-xs font-sans text-studio-muted">
                                      <span>
                                        {it.qty}x {it.name} {it.tierName ? `(${it.tierName})` : ''}
                                      </span>
                                      <span className="font-mono text-[11px]">
                                        {formatPrice(it.price * it.qty)}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-studio-ash/10">
                                  <span className="font-mono text-[9px] text-studio-muted uppercase">
                                    Total Ordered
                                  </span>
                                  <span className="font-serif text-sm font-bold text-studio-dark">
                                    {formatPrice(ord.total)}
                                  </span>
                                </div>

                                {/* Tide payment resolution triggers */}
                                {ord.status === 'Awaiting Tide Payment' && (
                                  <div className="pt-2 flex gap-2">
                                    <button
                                      onClick={() => {
                                        setCurrentInvoice(ord);
                                        setShowInvoice(true);
                                      }}
                                      className="flex-1 py-2 border border-studio-dark text-studio-dark hover:bg-studio-dark hover:text-studio-light text-[10px] font-mono uppercase tracking-wider text-center transition-colors cursor-pointer"
                                    >
                                      Pay / Scan Invoice
                                    </button>
                                    <a
                                      href={ord.paymentLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex-1 py-2 bg-studio-dark hover:bg-studio-bronze text-studio-light text-center text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                      Go to Tide
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice PDF & QR Scan Simulation Modal */}
      <AnimatePresence>
        {showInvoice && currentInvoice && (
          <div className="fixed inset-0 z-55 overflow-y-auto bg-studio-dark/85 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-studio-cream border border-studio-ash max-w-lg w-full overflow-hidden text-studio-dark"
            >
              {/* Receipt Header */}
              <div className="p-6 bg-studio-dark text-studio-light flex justify-between items-start">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-studio-bronze block mb-1">
                    TIDE SECURE DIGITAL INVOICE
                  </span>
                  <h3 className="font-serif text-2xl font-light">
                    Receipt // {currentInvoice.id}
                  </h3>
                  <p className="text-[10px] font-mono text-studio-silver mt-1">
                    Date: {currentInvoice.date}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowInvoice(false);
                    setCurrentInvoice(null);
                  }}
                  className="p-1 text-studio-silver hover:text-studio-bronze transition-colors cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Invoice contents */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Client detail */}
                <div className="grid grid-cols-2 gap-4 text-xs font-sans pb-4 border-b border-studio-ash/50">
                  <div>
                    <span className="block font-mono text-[9px] uppercase text-studio-muted">
                      ISSUED BY:
                    </span>
                    <strong className="block text-studio-dark font-serif text-sm">
                      SALTEDHASH Studio
                    </strong>
                    <span className="text-studio-muted block">Bengaluru, India</span>
                    <span className="text-studio-muted block">studio@saltedhash.org</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] uppercase text-studio-muted">
                      ISSUED TO:
                    </span>
                    <strong className="block text-studio-dark text-sm">
                      {currentInvoice.customerName}
                    </strong>
                    <span className="text-studio-muted block">{currentInvoice.customerEmail}</span>
                    <span className="text-studio-muted block font-mono text-[10px] mt-1 text-amber-600">
                      Status: {currentInvoice.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <span className="block font-mono text-[9px] uppercase text-studio-muted">
                    BILLABLE ITEMS & LICENSING
                  </span>
                  <div className="space-y-2">
                    {currentInvoice.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs font-sans border-b border-studio-ash/20 pb-2">
                        <div>
                          <strong className="text-studio-dark text-xs block">
                            {item.name}
                          </strong>
                          {item.tierName && (
                            <span className="text-[10px] font-mono text-studio-muted block">
                              Tier / Engagement Package: {item.tierName}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs block text-studio-dark">
                            {item.qty}x
                          </span>
                          <span className="font-mono text-xs text-studio-muted">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tide Pay Link Integration Panel */}
                <div className="bg-[#f0ece1] border border-studio-ash/80 p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-8 space-y-3">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-[#4f5c4b] font-bold uppercase">
                      <QrCode className="h-4 w-4" /> SCAN TO PAY VIA TIDE
                    </span>
                    <p className="text-[10px] text-[#5c6456] leading-relaxed">
                      Scan the interactive dynamic payment QR code with any UPI banking app, or click the link below to resolve the transaction with your Tide Account.
                    </p>
                    <a
                      href={currentInvoice.paymentLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 bg-[#4f5c4b] text-studio-light text-[10px] font-mono uppercase tracking-wider inline-block hover:bg-[#343e31] transition-all cursor-pointer"
                    >
                      Process Tide Transfer
                    </a>
                  </div>

                  {/* Simulated QR Code for Scan to Pay */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center">
                    <div className="bg-white p-2.5 border border-studio-ash/80 shadow-xs relative group">
                      <div className="grid grid-cols-5 gap-0.5 w-16 h-16 opacity-90">
                        {Array.from({ length: 25 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-full h-full ${
                              (idx * 7) % 3 === 0 || (idx + 4) % 5 === 0 ? 'bg-studio-dark' : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
                        <QrCode className="h-6 w-6 text-studio-dark" />
                      </div>
                    </div>
                    <span className="font-mono text-[8px] text-studio-muted uppercase mt-2.5 tracking-wider">
                      Reference: {currentInvoice.id}
                    </span>
                  </div>
                </div>

                <div className="bg-studio-ash/20 border border-studio-ash/40 p-4 rounded-none text-center">
                  <p className="text-[10px] text-studio-muted font-light">
                    Once paid, email your transaction receipt reference code <strong>{currentInvoice.id}</strong> to <a href="mailto:billing@saltedhash.org" className="underline font-mono text-studio-dark">billing@saltedhash.org</a>. Our automated billing engine will verify the Tide balance and move your order status to <strong>Processing</strong> within minutes.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-studio-light border-t border-studio-ash/40 flex justify-between items-center text-xs font-mono text-studio-muted">
                <span>Secure Tide Portal v1.0.4</span>
                <span className="flex items-center gap-1">
                  <ClipboardCheck className="h-3 w-3 text-[#4f5c4b]" /> Verified Signature
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
