export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatWeight(weightInGrams: number): string {
  if (weightInGrams >= 1000) {
    return `${(weightInGrams / 1000).toFixed(1)} kg`;
  }
  return `${weightInGrams} gram`;
}

export function calculateDiscountPercent(originalPrice: number, discountPrice?: number): number {
  if (!discountPrice || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateId(prefix: string = 'id'): string {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const time = Date.now().toString(36).toUpperCase().slice(-4);
  return `${prefix}-${time}-${rand}`;
}

/**
 * Format numbers with dots as thousands separators (e.g. 250000 -> "250.000")
 */
export function formatNumberWithDots(val: number | string): string {
  if (val === '' || val === null || val === undefined) return '';
  const num = typeof val === 'string' ? parseInt(val.replace(/[^\d]/g, ''), 10) : Math.round(val);
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Parses a currency input string (which may have "Rp", dots, commas, spaces)
 * into a pure integer number.
 */
export function parseCurrencyInput(input: string): number {
  if (!input) return 0;
  // Remove non-digit characters
  const cleaned = input.replace(/[^\d]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Parses weight input with unit support (g or kg) and returns weight in grams.
 * Allows decimal input like "1.5" or "1,5" in kg mode.
 */
export function parseWeightInput(input: string | number, unit: 'g' | 'kg'): number {
  if (input === '' || input === null || input === undefined) return 0;
  if (typeof input === 'number') {
    return unit === 'kg' ? Math.round(input * 1000) : Math.round(input);
  }
  // Replace comma with dot for decimal parsing
  const sanitized = input.toString().replace(/,/g, '.').replace(/[^\d.]/g, '');
  const num = parseFloat(sanitized);
  if (isNaN(num) || num < 0) return 0;
  return unit === 'kg' ? Math.round(num * 1000) : Math.round(num);
}

/**
 * Format phone number to international WhatsApp format (e.g. 085723691588 -> 6285723691588)
 */
export function formatWaNumber(phone: string = '085723691588'): string {
  let clean = (phone || '').replace(/[^\d]/g, '');
  if (!clean) return '6285723691588';
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (!clean.startsWith('62')) {
    clean = '62' + clean;
  }
  return clean;
}


