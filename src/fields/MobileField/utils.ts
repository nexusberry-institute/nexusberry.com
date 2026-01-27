/**
 * Formats phone number for WhatsApp URL
 * - Removes +, spaces, dashes, brackets
 * - Removes leading zeros (local format)
 * - Keeps only digits
 *
 * Examples:
 *   "+92-(300)1234567" -> "923001234567"
 *   "0300-1234567"     -> "3001234567" (needs country code)
 *   "+92 300 1234567"  -> "923001234567"
 */
export function formatPhoneForWhatsApp(phone: string | null | undefined): string {
  if (!phone) return ''

  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '')

  // If starts with 0 (local format), remove leading zero
  // User should ideally store with country code, but handle common case
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1)
  }

  return cleaned
}

/**
 * Check if phone number is valid for WhatsApp
 * Must have at least 10 digits after cleaning
 */
export function isValidPhoneForWhatsApp(phone: string | null | undefined): boolean {
  const cleaned = formatPhoneForWhatsApp(phone)
  return cleaned.length >= 10
}
