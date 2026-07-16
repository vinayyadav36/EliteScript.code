export interface Venture {
  id: string;
  name: string;
  tagline: string;
  category: 'Venture Studio' | 'E-Commerce & Wellness' | 'Marketing & Systems' | 'Digital Asset' | 'SaaS MVP' | 'AI Product';
  description: string;
  longDescription: string;
  status: 'In Market' | 'Scaling' | 'In Development' | 'Private Beta';
  features: string[];
  stats: { label: string; value: string }[];
  accentColor: string;
  logoText: string;
}

export interface Service {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  details: string[];
  capabilities: string[];
}

export interface ServicePackage {
  tierName: string;
  price: number;
  description: string;
  deliverables: string[];
  tideUrl?: string;
}

export interface ProcessStep {
  phase: string;
  title: string;
  description: string;
  deliverables: string[];
  duration: string;
}

export interface InquiryFormState {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  interestType: 'Venture Partnership' | 'AI Integration' | 'Custom Software' | 'SaaS MVP' | 'TRIU Naturals Preorder' | 'Other';
  projectBrief: string;
  budgetRange: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number; // in INR (can display equivalent GBP/USD)
  qty: number;
  type: 'product' | 'service';
  tierName?: string;
  variantCode?: string;
  variantName?: string;
  itemId: string; // original id of product or service
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'Awaiting Payment' | 'Reference Submitted' | 'Processing' | 'Dispatch Ready' | 'Delivered' | 'Completed';
  paymentLink: string;
  purchaseChannel: 'app' | 'flipkart' | 'meesho' | 'tide';
  paymentChannel?: string;
  paymentReference?: string;
}

