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
} as const;

export const getProductExternalLinks = (product: { id: string; name: string }, variant?: string) => {
  const id = product.id.toLowerCase();
  const name = product.name.toLowerCase();
  
  let flipkart = '';
  let meesho = '';
  
  if (id.includes('dung') || name.includes('dung') || name.includes('cake')) {
    const v = variant || '1';
    if (v === '105') flipkart = import.meta.env.VITE_TRIU_FLIPKART_PACK_105_URL || '';
    else if (v === '90') flipkart = import.meta.env.VITE_TRIU_FLIPKART_PACK_90_URL || '';
    else if (v === '75') flipkart = import.meta.env.VITE_TRIU_FLIPKART_PACK_75_URL || '';
    else if (v === '60') flipkart = import.meta.env.VITE_TRIU_FLIPKART_PACK_60_URL || '';
    else if (v === '45') flipkart = import.meta.env.VITE_TRIU_FLIPKART_PACK_45_URL || '';
    else if (v === '15') flipkart = import.meta.env.VITE_TRIU_FLIPKART_PACK_15_URL || '';
    else if (v === '5') flipkart = import.meta.env.VITE_TRIU_FLIPKART_PACK_5_URL || '';
    else if (v === '2') flipkart = import.meta.env.VITE_TRIU_FLIPKART_PACK_2_URL || '';
    else flipkart = import.meta.env.VITE_TRIU_FLIPKART_PACK_1_URL || '';
  } else if (id.includes('oil') || name.includes('kumkumadi')) {
    flipkart = import.meta.env.VITE_TRIU_OIL_FLIPKART_URL || '';
    meesho = import.meta.env.VITE_TRIU_OIL_MEESHO_URL || '';
  } else if (id.includes('toner') || name.includes('neem') || name.includes('serum')) {
    flipkart = import.meta.env.VITE_TRIU_TONER_FLIPKART_URL || '';
    meesho = import.meta.env.VITE_TRIU_TONER_MEESHO_URL || '';
  } else if (id.includes('soap') || name.includes('bhringraj') || name.includes('scalp')) {
    flipkart = import.meta.env.VITE_TRIU_SOAP_FLIPKART_URL || '';
    meesho = import.meta.env.VITE_TRIU_SOAP_MEESHO_URL || '';
  }
  
  // Fallbacks to store URLs if specific product URLs are empty
  if (!flipkart) flipkart = businessConfig.flipkartStoreUrl;
  if (!meesho) meesho = businessConfig.meeshoStoreUrl;
  
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
    whatsapp: `https://wa.me/${businessConfig.whatsapp}?text=${encodeURIComponent(message)}`
  };
};
