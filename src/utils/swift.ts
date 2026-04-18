export interface SwiftResult {
  valid: boolean;
  error?: string;
  parts?: { bank: string; country: string; location: string; branch?: string };
}

export function validateSwift(raw: string): SwiftResult {
  const bic = raw.replace(/\s+/g, '').toUpperCase();

  if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(bic)) {
    return { valid: false, error: 'Invalid SWIFT/BIC character format' };
  }
  if (bic.length !== 8 && bic.length !== 11) {
    return { valid: false, error: 'SWIFT must be exactly 8 or 11 characters' };
  }

  return {
    valid: true,
    parts: {
      bank: bic.slice(0, 4),
      country: bic.slice(4, 6),
      location: bic.slice(6, 8),
      branch: bic.length === 11 ? bic.slice(8) : undefined
    }
  };
}