import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowUpRight, AlertCircle, RefreshCw, Cpu, Mail, Building } from 'lucide-react';
import { InquiryFormState } from '../types';
import { submitContactLead, isAppwriteConfigured } from '../lib/appwrite';
import { businessConfig } from '../config/businessConfig';

interface ContactViewProps {
  prefilledInterest: string | null;
  prefilledType: 'service' | 'preorder' | null;
  clearPrefills: () => void;
}

export default function ContactView({ prefilledInterest, prefilledType, clearPrefills }: ContactViewProps) {
  const [formData, setFormData] = useState<InquiryFormState>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    interestType: 'Custom Software',
    projectBrief: '',
    budgetRange: '$25,000 – $50,000'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [txnHash, setTxnHash] = useState('');
  const [submissionTarget, setSubmissionTarget] = useState<'appwrite' | 'fallback' | null>(null);

  // Handle prefilling
  useEffect(() => {
    if (prefilledInterest) {
      let interestType: InquiryFormState['interestType'] = 'Custom Software';
      let briefText = '';

      if (prefilledType === 'service') {
        if (prefilledInterest.includes('AI')) interestType = 'AI Integration';
        else if (prefilledInterest.includes('SaaS')) interestType = 'SaaS MVP';
        else interestType = 'Custom Software';

        briefText = `I would like to schedule a technical consultation regarding your service: "${prefilledInterest}". Please reach out to discuss feasibility, timeline, and architectural requirements.`;
      } else if (prefilledType === 'preorder') {
        interestType = 'TRIU Naturals Preorder';
        briefText = `I would like to reserve a micro-batch bottle allocation for: "${prefilledInterest}". Please notify me once the batch is compound and ready for billing.`;
      }

      setFormData(prev => ({
        ...prev,
        interestType,
        projectBrief: briefText,
        budgetRange: prefilledType === 'preorder' ? 'Not Applicable' : '$25,000 – $50,000'
      }));
    }
  }, [prefilledInterest, prefilledType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateMockHash = () => {
    const chars = '0123456789abcdef';
    let hash = 'sh_';
    for (let i = 0; i < 40; i++) {
      hash += chars[Math.floor(Math.random() * 16)];
    }
    return hash;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isAppwriteConfigured()) {
        const response = await submitContactLead({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          message: formData.projectBrief,
          productInterest: prefilledInterest || undefined,
          source: 'website'
        });

        if (response) {
          setTxnHash(response.$id);
          setSubmissionTarget('appwrite');
          setSubmitted(true);
          clearPrefills();
          setIsSubmitting(false);
          return;
        }
      }
    } catch (error) {
      console.error('[Contact] Error submitting lead to Appwrite:', error);
    }

    // Fallback: local execution block
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionTarget('fallback');
      setTxnHash(generateMockHash());
      setSubmitted(true);
      clearPrefills();
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      interestType: 'Custom Software',
      projectBrief: '',
      budgetRange: '$25,000 – $50,000'
    });
    setSubmitted(false);
    setTxnHash('');
    setSubmissionTarget(null);
  };

  return (
    <div id="contact-view" className="pt-24 min-h-screen">
      {/* Editorial Header */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-b border-studio-ash/30">
        <div className="max-w-4xl space-y-6">
          <span className="font-mono text-xs text-studio-bronze uppercase tracking-widest block">
            SECURE COMMUNICATIONS CHANNEL
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-studio-dark leading-tight">
            Initiate a <span className="italic font-normal text-studio-bronze">project</span> or <br />
            venture partnership.
          </h1>
          <p className="font-sans text-lg text-studio-muted font-light leading-relaxed max-w-2xl">
            We value your time and operate with extreme logical focus. Fill out the brief query specification below. Your submission is instantly compiled and routed directly to our principal architects.
          </p>
        </div>
      </section>

      {/* Interactive Form Split Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-b border-studio-ash/30">
        
        {/* Left Column - Contact Form */}
        <div className="lg:col-span-7">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {prefilledInterest && (
                <div className="p-4 bg-studio-cream border-l-2 border-studio-bronze flex items-center justify-between text-xs font-mono text-studio-dark">
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-studio-bronze animate-pulse" />
                    PREFILLED: Active "{prefilledInterest}" parameters applied.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      clearPrefills();
                      handleReset();
                    }}
                    className="text-studio-muted hover:text-studio-dark underline cursor-pointer"
                  >
                    Reset Form
                  </button>
                </div>
              )}
              {/* Standard Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block font-mono text-[10px] uppercase tracking-wider text-studio-muted font-semibold">
                    Full Name / Representative *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full legal name"
                    required
                    className="w-full bg-studio-cream/30 border border-studio-ash/80 p-3 text-sm focus:outline-hidden focus:border-studio-dark focus:bg-studio-light transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-wider text-studio-muted font-semibold">
                    Corporate Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@company.com"
                    required
                    className="w-full bg-studio-cream/30 border border-studio-ash/80 p-3 text-sm focus:outline-hidden focus:border-studio-dark focus:bg-studio-light transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block font-mono text-[10px] uppercase tracking-wider text-studio-muted font-semibold">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    required
                    className="w-full bg-studio-cream/30 border border-studio-ash/80 p-3 text-sm focus:outline-hidden focus:border-studio-dark focus:bg-studio-light transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="company" className="block font-mono text-[10px] uppercase tracking-wider text-studio-muted font-semibold">
                    Company / Initiative Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Corp / Stealth Co"
                    className="w-full bg-studio-cream/30 border border-studio-ash/80 p-3 text-sm focus:outline-hidden focus:border-studio-dark focus:bg-studio-light transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="interestType" className="block font-mono text-[10px] uppercase tracking-wider text-studio-muted font-semibold">
                    Nature of Partnership *
                  </label>
                  <select
                    id="interestType"
                    name="interestType"
                    value={formData.interestType}
                    onChange={handleInputChange}
                    className="w-full bg-studio-cream/30 border border-studio-ash/80 p-3 text-sm focus:outline-hidden focus:border-studio-dark focus:bg-studio-light transition-all"
                  >
                    <option value="Custom Software">Custom Software & Platform Development</option>
                    <option value="AI Integration">AI & Machine Learning Pipelines</option>
                    <option value="SaaS MVP">SaaS MVP (Rapid 4-6 Weeks Cycle)</option>
                    <option value="Venture Partnership">Venture Building & Co-founding</option>
                    <option value="TRIU Naturals Preorder">TRIU Naturals Botanical Reserve</option>
                    <option value="Other">Other Strategic Dialogue</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="budgetRange" className="block font-mono text-[10px] uppercase tracking-wider text-studio-muted font-semibold">
                  Intended Capital Allocation
                </label>
                <select
                  id="budgetRange"
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleInputChange}
                  className="w-full bg-studio-cream/30 border border-studio-ash/80 p-3 text-sm focus:outline-hidden focus:border-studio-dark focus:bg-studio-light transition-all"
                >
                  <option value="$10,000 – $25,000">$10,000 – $25,000</option>
                  <option value="$25,000 – $50,000">$25,000 – $50,000</option>
                  <option value="$50,000 – $100,000">$50,000 – $100,000</option>
                  <option value="$100,000+">$100,000+ (Enterprise Scale)</option>
                  <option value="Not Applicable">Not Applicable / TRIU Preorder / Partnership Equity</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="projectBrief" className="block font-mono text-[10px] uppercase tracking-wider text-studio-muted font-semibold">
                  Brief Technical Context / Requirements *
                </label>
                <textarea
                  id="projectBrief"
                  name="projectBrief"
                  value={formData.projectBrief}
                  onChange={handleInputChange}
                  placeholder="Outline your problem. Avoid marketing jargon. List specific features, integrations, and desired launch windows if applicable."
                  required
                  rows={6}
                  className="w-full bg-studio-cream/30 border border-studio-ash/80 p-3 text-sm focus:outline-hidden focus:border-studio-dark focus:bg-studio-light transition-all font-sans leading-relaxed resize-y"
                />
              </div>

              {/* Secure Handshake Disclaimer */}
              <div className="flex gap-3 items-start text-xs text-studio-muted font-light leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-studio-bronze flex-shrink-0 mt-0.5" />
                <p>
                  By submitting this request, you establish a direct routing pipeline to SALTEDHASH. Your data is encrypted in-transit and is never sold, shared, or indexed by third-party search crawlers.
                </p>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3.5 bg-studio-dark text-studio-light hover:bg-studio-bronze disabled:bg-studio-muted/50 text-xs font-mono uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      COMPILING DATA PACK...
                    </>
                  ) : (
                    <>
                      Transmit Inquiry Spec
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* SUCCESS RECEIPT */
            <div id="contact-success-receipt" className={`border p-8 space-y-6 ${submissionTarget === 'appwrite' ? 'border-emerald-500/30 bg-emerald-50/10' : 'border-amber-500/30 bg-amber-50/10'}`}>
              <div className={`flex items-center gap-2.5 font-mono text-xs font-semibold ${submissionTarget === 'appwrite' ? 'text-emerald-600' : 'text-amber-700'}`}>
                <ShieldCheck className="h-5 w-5 animate-pulse" />
                {submissionTarget === 'appwrite' 
                  ? 'TRANSMISSION ACKNOWLEDGED & PERSISTED IN APPWRITE' 
                  : 'OFFLINE MODE: LOCAL SIMULATION (DATABASE SYNC PENDING)'}
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-light text-studio-dark">
                  Thank you, {formData.fullName}.
                </h3>
                <p className="font-sans text-sm text-studio-muted font-light leading-relaxed">
                  {submissionTarget === 'appwrite'
                    ? `Your inquiry has been stored securely in our database. A human engineering partner will review your technical brief and respond to ${formData.email} within 24 business hours.`
                    : `Your inquiry has been processed locally in sandbox mode. Appwrite backend coordinates are not set or unavailable. Your representative email ${formData.email} has been cached.`}
                </p>
              </div>

              <div className="border border-studio-ash/50 bg-studio-cream/40 rounded-none p-4 space-y-2 font-mono text-[10px]">
                <div className="flex justify-between text-studio-muted">
                  <span>TRANSACTION ID:</span>
                  <span className="text-studio-dark select-all">{txnHash}</span>
                </div>
                <div className="flex justify-between text-studio-muted">
                  <span>STORAGE TARGET:</span>
                  <span className={`font-semibold ${submissionTarget === 'appwrite' ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {submissionTarget === 'appwrite' ? 'APPWRITE_CLOUD_DB' : 'LOCAL_DEV_FALLBACK'}
                  </span>
                </div>
                <div className="flex justify-between text-studio-muted">
                  <span>SYSTEM BLOCK:</span>
                  <span className="text-studio-dark">EPOCH_2026_COMPILER</span>
                </div>
                <div className="flex justify-between text-studio-muted">
                  <span>INTEREST ALLOCATION:</span>
                  <span className="text-studio-dark">{formData.interestType}</span>
                </div>
                <div className="flex justify-between text-studio-muted">
                  <span>ESTIMATED REVIEW:</span>
                  <span className="text-studio-dark">Sub-24 Hours UTC</span>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-studio-dark text-studio-dark hover:bg-studio-dark hover:text-studio-light transition-all text-xs font-mono uppercase tracking-wider cursor-pointer"
                >
                  Submit Another Specification
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Live JSON Request Compiler (Interactive Sidebar) */}
        <div className="lg:col-span-5 bg-studio-dark text-studio-light p-6 md:p-8 border border-studio-card space-y-6 lg:sticky lg:top-32">
          <div className="flex justify-between items-center border-b border-studio-card pb-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-studio-bronze" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-studio-bronze font-semibold">
                Live Query Compiler
              </span>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-4">
            <p className="text-[11px] font-sans font-light text-studio-silver leading-relaxed">
              As you adjust interest, budget, and briefing parameters, our live parser structures your inquiry metadata into a formal telemetry spec.
            </p>

            {/* Code Block rendering the Live JSON */}
            <div className="bg-studio-charcoal rounded-none p-4 border border-studio-card max-h-[300px] overflow-y-auto dark-scrollbar">
              <pre className="text-[11px] font-mono text-[#c4a47c] leading-relaxed">
                {JSON.stringify({
                  meta: {
                    source: "SALTEDHASH_PORTAL",
                    epoch: Date.now(),
                    securePort: 3000
                  },
                  payload: {
                    representative: formData.fullName || "NULL_STATED",
                    corporateEmail: formData.email || "NULL_STATED",
                    contactPhone: formData.phone || "NULL_STATED",
                    companyName: formData.company || "NULL_STATED",
                    interestType: formData.interestType,
                    allocatedCapital: formData.budgetRange,
                    requirementsBrief: formData.projectBrief ? `${formData.projectBrief.substring(0, 80)}...` : "NULL_STATED"
                  }
                }, null, 2)}
              </pre>
            </div>
          </div>

          <div className="pt-4 border-t border-studio-card space-y-3">
            <span className="block font-mono text-[9px] uppercase text-studio-muted">
              ALTERNATIVE CHANNELS
            </span>
            <div className="space-y-2 text-xs font-mono text-studio-silver">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-studio-bronze" />
                <a href={`mailto:${businessConfig.email}`} className="hover:text-studio-bronze transition-colors">{businessConfig.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-3.5 w-3.5 text-studio-bronze" />
                <span>{businessConfig.addressSecondary}</span>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
