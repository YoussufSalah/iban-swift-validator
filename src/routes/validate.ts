import type { Context } from 'hono';
import { validateIban } from '../utils/iban';
import { validateSwift } from '../utils/swift';
import { COUNTRY_META } from '../utils/metadata';

interface ValidateBody {
  iban?: string;
  swift?: string;
}

export async function handleValidate(c: Context) {
  let body: ValidateBody;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: { message: 'Invalid JSON payload', code: 'PARSE_ERROR', status: 400 } }, 400);
  }

  if (!body || typeof body.iban !== 'string' || !body.iban.trim()) {
    return c.json({ success: false, error: { message: '"iban" is required', code: 'MISSING_FIELD', status: 422 } }, 422);
  }

  const ibanRes = validateIban(body.iban);
  const swiftRaw = typeof body.swift === 'string' ? body.swift.trim() : undefined;
  const swiftRes = swiftRaw ? validateSwift(swiftRaw) : { valid: false, error: 'Not provided' };

  if (!ibanRes.valid) {
    return c.json({ success: false, error: { message: ibanRes.error || 'IBAN validation failed', code: 'INVALID_IBAN', status: 400 } }, 400);
  }

  const metadata = COUNTRY_META[ibanRes.parts!.country];
  const swiftCountryMatch = swiftRes.parts?.country === ibanRes.parts!.country;

  return c.json({
    success: true,
    data: {
      iban_valid: true,
      swift_valid: !!swiftRes.valid,
      country_match: swiftRes.valid ? swiftCountryMatch : null,
      iban: ibanRes.parts,
      swift: swiftRes.parts,
      metadata: metadata ? {
        country_name: metadata.name,
        currency: metadata.currency,
        standard_length: metadata.ibanLength
      } : null
    }
  });
}