import { COUNTRY_META } from './metadata';

export interface IbanResult {
  valid: boolean;
  error?: string;
  parts?: { country: string; checkDigits: string; bban: string; length: number };
  warning?: string;
}

export function validateIban(raw: string): IbanResult {
  const iban = raw.replace(/\s+/g, '').toUpperCase();

  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) {
    return { valid: false, error: 'Invalid IBAN character format' };
  }

  const country = iban.slice(0, 2);
  const spec = COUNTRY_META[country];
  if (!spec) {
    return { valid: false, error: `Unsupported country code: ${country}` };
  }
  if (iban.length !== spec.ibanLength) {
    return { valid: false, error: `Length mismatch. Expected ${spec.ibanLength}, got ${iban.length}` };
  }

  // Mod-97 checksum
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let numeric = '';
  for (let i = 0; i < rearranged.length; i++) {
    const code = rearranged.charCodeAt(i);
    numeric += code >= 65 && code <= 90 ? (code - 55).toString() : rearranged[i];
  }

  try {
    const isValid = BigInt(numeric) % 97n === 1n;
    if (!isValid) return { valid: false, error: 'Invalid IBAN checksum' };
  } catch {
    return { valid: false, error: 'Checksum calculation overflow' };
  }

  return {
    valid: true,
    parts: {
      country,
      checkDigits: iban.slice(2, 4),
      bban: iban.slice(4),
      length: iban.length
    },
    warning: spec ? undefined : 'Country metadata missing. Format valid.'
  };
}