export function useContactInfo() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '918930609914'
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'askvinaybusiness@gmail.com'
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/triu.official'
  const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com/company/saltedhash'

  const whatsappUrl = `https://wa.me/${whatsappNumber}`
  const emailUrl = `mailto:${contactEmail}`

  return {
    whatsappNumber,
    contactEmail,
    instagramUrl,
    linkedinUrl,
    whatsappUrl,
    emailUrl
  }
}
