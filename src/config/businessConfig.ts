/**
 * Centralized Business Config Source of Truth
 */

export const businessConfig = {
  name: import.meta.env.VITE_BUSINESS_NAME || 'SALTEDHASH',
  tagline: import.meta.env.VITE_BUSINESS_TAGLINE || 'Logic-led venture studio. Natural products rooted in tradition.',
  founderName: import.meta.env.VITE_FOUNDER_NAME || 'VINAY Yadav',
  founderRole: import.meta.env.VITE_FOUNDER_ROLE || 'Managing Partner & Principal Architect',
  address: import.meta.env.VITE_BUSINESS_ADDRESS || 'Bengaluru, KA, India',
  addressSecondary: import.meta.env.VITE_BUSINESS_ADDRESS_SECONDARY || 'Rewari, HR, IN',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'studio@saltedhash.org',
  billingEmail: import.meta.env.VITE_BILLING_EMAIL || 'billing@saltedhash.org',
  phone: import.meta.env.VITE_CONTACT_PHONE || '+91 (080) 4920-HASH',
  whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP || '918930609914',
  primarySiteUrl: import.meta.env.VITE_PRIMARY_SITE_URL || 'https://vinay-dev.vercel.app',
  social: {
    linkedin: import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com/company/saltedhash',
    instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/triu.official',
    twitter: import.meta.env.VITE_TWITTER_URL || 'https://x.com/saltedhash',
    github: import.meta.env.VITE_GITHUB_URL || 'https://github.com/saltedhash',
    facebook: import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/share/1BLQBZ3M8L',
    patreon: import.meta.env.VITE_PATREON_URL || 'https://www.patreon.com/SALTEDHASH',
    whatsappUrl: import.meta.env.VITE_WHATSAPP_URL || 'https://api.whatsapp.com/send?phone=918930609914',
  },
  flipkartStoreUrl: import.meta.env.VITE_FLIPKART_STORE_URL || 'https://www.flipkart.com',
  meeshoStoreUrl: import.meta.env.VITE_MEESHO_STORE_URL || 'https://www.meesho.com',
  paymentGatewayUrl: import.meta.env.VITE_TIDE_PAYMENT_GATEWAY_URL || '',
  shriNandiPwaUrl: import.meta.env.VITE_SHRI_NANDI_PWA_URL || '',
} as const;

export const getProductExternalLinks = (product: { id: string; name: string }, variant?: string) => {
  const id = product.id.toLowerCase();
  const name = product.name.toLowerCase();
  
  let flipkart = '';
  let meesho = '';
  let tideUrl = '';
  let tideIsFallback = false;
  
  if (id.includes('dung') || name.includes('dung') || name.includes('cake')) {
    const v = variant || '1';

    // Fallback to old env keys for backward compatibility
    if (v === '105') flipkart = import.meta.env.VITE_TRIU_DUNGCAKE_FLIPKART_PACK_105_URL || import.meta.env.VITE_TRIU_FLIPKART_PACK_105_URL || '';
    else if (v === '90') flipkart = import.meta.env.VITE_TRIU_DUNGCAKE_FLIPKART_PACK_90_URL || import.meta.env.VITE_TRIU_FLIPKART_PACK_90_URL || '';
    else if (v === '75') flipkart = import.meta.env.VITE_TRIU_DUNGCAKE_FLIPKART_PACK_75_URL || import.meta.env.VITE_TRIU_FLIPKART_PACK_75_URL || '';
    else if (v === '60') flipkart = import.meta.env.VITE_TRIU_DUNGCAKE_FLIPKART_PACK_60_URL || import.meta.env.VITE_TRIU_FLIPKART_PACK_60_URL || '';
    else if (v === '45') flipkart = import.meta.env.VITE_TRIU_DUNGCAKE_FLIPKART_PACK_45_URL || import.meta.env.VITE_TRIU_FLIPKART_PACK_45_URL || '';
    else if (v === '15') flipkart = import.meta.env.VITE_TRIU_DUNGCAKE_FLIPKART_PACK_15_URL || import.meta.env.VITE_TRIU_FLIPKART_PACK_15_URL || '';
    else if (v === '5') flipkart = import.meta.env.VITE_TRIU_DUNGCAKE_FLIPKART_PACK_5_URL || import.meta.env.VITE_TRIU_FLIPKART_PACK_5_URL || '';
    else if (v === '2') flipkart = import.meta.env.VITE_TRIU_DUNGCAKE_FLIPKART_PACK_2_URL || import.meta.env.VITE_TRIU_FLIPKART_PACK_2_URL || '';
    else flipkart = import.meta.env.VITE_TRIU_DUNGCAKE_FLIPKART_PACK_1_URL || import.meta.env.VITE_TRIU_FLIPKART_PACK_1_URL || '';

    if (v === '105') meesho = import.meta.env.VITE_TRIU_DUNGCAKE_MEESHO_PACK_105_URL || '';
    else if (v === '90') meesho = import.meta.env.VITE_TRIU_DUNGCAKE_MEESHO_PACK_90_URL || '';
    else if (v === '75') meesho = import.meta.env.VITE_TRIU_DUNGCAKE_MEESHO_PACK_75_URL || '';
    else if (v === '60') meesho = import.meta.env.VITE_TRIU_DUNGCAKE_MEESHO_PACK_60_URL || '';
    else if (v === '45') meesho = import.meta.env.VITE_TRIU_DUNGCAKE_MEESHO_PACK_45_URL || '';
    else if (v === '15') meesho = import.meta.env.VITE_TRIU_DUNGCAKE_MEESHO_PACK_15_URL || '';
    else if (v === '5') meesho = import.meta.env.VITE_TRIU_DUNGCAKE_MEESHO_PACK_5_URL || '';
    else if (v === '2') meesho = import.meta.env.VITE_TRIU_DUNGCAKE_MEESHO_PACK_2_URL || '';
    else meesho = import.meta.env.VITE_TRIU_DUNGCAKE_MEESHO_PACK_1_URL || '';

    if (v === '105') tideUrl = import.meta.env.VITE_TRIU_DUNGCAKE_TIDE_PACK_105_URL || '';
    else if (v === '90') tideUrl = import.meta.env.VITE_TRIU_DUNGCAKE_TIDE_PACK_90_URL || '';
    else if (v === '75') tideUrl = import.meta.env.VITE_TRIU_DUNGCAKE_TIDE_PACK_75_URL || '';
    else if (v === '60') tideUrl = import.meta.env.VITE_TRIU_DUNGCAKE_TIDE_PACK_60_URL || '';
    else if (v === '45') tideUrl = import.meta.env.VITE_TRIU_DUNGCAKE_TIDE_PACK_45_URL || '';
    else if (v === '15') tideUrl = import.meta.env.VITE_TRIU_DUNGCAKE_TIDE_PACK_15_URL || '';
    else if (v === '5') tideUrl = import.meta.env.VITE_TRIU_DUNGCAKE_TIDE_PACK_5_URL || '';
    else if (v === '2') tideUrl = import.meta.env.VITE_TRIU_DUNGCAKE_TIDE_PACK_2_URL || '';
    else tideUrl = import.meta.env.VITE_TRIU_DUNGCAKE_TIDE_PACK_1_URL || '';
  } else if (id.includes('oil') || name.includes('kumkumadi') || name.includes('hair')) {
    flipkart = import.meta.env.VITE_TRIU_HAIROIL_FLIPKART_URL || import.meta.env.VITE_TRIU_OIL_FLIPKART_URL || '';
    meesho = import.meta.env.VITE_TRIU_HAIROIL_MEESHO_URL || import.meta.env.VITE_TRIU_OIL_MEESHO_URL || '';
    tideUrl = import.meta.env.VITE_TRIU_HAIROIL_TIDE_URL || '';
  } else if (id.includes('toner') || name.includes('rose') || name.includes('serum')) {
    flipkart = import.meta.env.VITE_TRIU_ROSEWATER_FLIPKART_URL || import.meta.env.VITE_TRIU_TONER_FLIPKART_URL || '';
    meesho = import.meta.env.VITE_TRIU_ROSEWATER_MEESHO_URL || import.meta.env.VITE_TRIU_TONER_MEESHO_URL || '';
    tideUrl = import.meta.env.VITE_TRIU_ROSEWATER_TIDE_URL || '';
  } else if (id.includes('soap') || name.includes('bhringraj') || name.includes('scalp') || name.includes('neem') || name.includes('powder')) {
    flipkart = import.meta.env.VITE_TRIU_NEEMSOAP_FLIPKART_URL || import.meta.env.VITE_TRIU_SOAP_FLIPKART_URL || '';
    meesho = import.meta.env.VITE_TRIU_NEEMSOAP_MEESHO_URL || import.meta.env.VITE_TRIU_SOAP_MEESHO_URL || '';
    tideUrl = import.meta.env.VITE_TRIU_NEEMSOAP_TIDE_URL || '';
  }
  
  if (!tideUrl) {
    tideUrl = import.meta.env.VITE_TIDE_CATALOGUE_URL || '';
    if (tideUrl) {
      tideIsFallback = true;
    }
  }

  const cleanUrl = (url: string) => {
    if (!url || url.includes('...') || url.includes('your_') || url.includes('placeholder')) return '';
    return url;
  };
  
  const message = variant 
    ? `Hi, I am interested in ${product.name} (Pack of ${variant}).` 
    : `Hi, I am interested in ${product.name}.`;
  
  return {
    flipkart: cleanUrl(flipkart),
    meesho: cleanUrl(meesho),
    tideUrl: cleanUrl(tideUrl),
    tideIsFallback,
    whatsapp: `https://wa.me/${businessConfig.whatsapp}?text=${encodeURIComponent(message)}`
  };
};
