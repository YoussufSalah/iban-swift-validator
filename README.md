# 🌍 IBAN & SWIFT Validator API

Fast, stateless structural validation and metadata extraction for international bank accounts and BIC/SWIFT codes.  
Supports **80+ IBAN-participating countries** with ISO 13616 Mod-97 checksum verification.

⚡ **Sub-10ms latency** | 💰 **$0 self-host cost** | 🔒 **No external dependencies** | 📦 **Edge-optimized**

---

## 🔗 Base URL

```
https://iban-swift-validator9.p.rapidapi.com
```

---

## 🔐 Authentication

- **RapidAPI**: Pass `X-RapidAPI-Key` in headers (handled automatically by the marketplace gateway).
- **Direct/Cloudflare**: No auth required. Add your own rate-limiting middleware if self-hosting.

---

## 📥 Endpoint: `POST /validate`

Validates IBAN format + checksum, optionally cross-checks SWIFT/BIC structure, and returns parsed metadata.

### Request

```json
{
    "iban": "DE89370400440532013000",
    "swift": "DEUTDEFFXXX"
}
```

| Field   | Type   | Required | Notes                                 |
| :------ | :----- | :------- | :------------------------------------ |
| `iban`  | string | Yes      | Max 34 chars. Spaces/case normalized. |
| `swift` | string | No       | 8 or 11 chars. Case insensitive.      |

---

### Response

```json
{
    "success": true,
    "data": {
        "iban_valid": true,
        "swift_valid": true,
        "country_match": true,
        "iban": {
            "country": "DE",
            "checkDigits": "89",
            "bban": "370400440532013000",
            "length": 22
        },
        "swift": {
            "bank": "DEUT",
            "country": "DE",
            "location": "FF",
            "branch": "XXX"
        },
        "metadata": {
            "country_name": "Germany",
            "currency": "EUR",
            "standard_length": 22
        }
    }
}
```

---

### Error Responses

| Status | Code          | Example Message                       |
| :----- | :------------ | :------------------------------------ |
| 400    | INVALID_IBAN  | "Invalid IBAN checksum"               |
| 400    | INVALID_SWIFT | "SWIFT must be exactly 8 or 11 chars" |
| 422    | MISSING_FIELD | "\"iban\" is required"                |
| 400    | PARSE_ERROR   | "Invalid JSON payload"                |

---

### 🧪 Quick Test (cURL)

```sh
curl -X POST https://iban-swift-validator9.p.rapidapi.com/validate -H "X-RapidAPI-Host: iban-swift-validator9.p.rapidapi.com" -H "X-RapidAPI-Key: [YOUR_RAPIDAPI_KEY]" -H "Content-Type: application/json" -d "{\"iban\":\"GB29NWBK60161331926819\", \"swift\":\"NWBKGB2L\"}"
```

---

## ⚠️ Important Limitations

- **Structural validation only**: Confirms format, country length, and Mod-97 checksum.
- **Does not verify live account status**: This API does not connect to banking networks, SEPA directories, or Plaid/Tink. It cannot confirm if an account is open, funded, or active.
- **Country mismatch warning**: `country_match: false` means IBAN country ≠ SWIFT country. Common in multinational banks, but worth flagging in UX.

---

## 🛠 Tech Stack

- **Runtime**: Cloudflare Workers (V8 Isolate)
- **Framework**: Hono (Edge-optimized)
- **Validation**: TypeScript + Zod (runtime schema enforcement)
- **Data**: Static ISO 13616 country map (80+ entries, <5KB)
- **Hosting**: Cloudflare

---

## 📈 Usage & Pricing

| Tier       | Calls/mo | Cost |
| :--------- | :------- | :--- |
| Free       | 2,000    | $0   |
| Starter    | 10,000   | $5   |
| Pro        | 50,000   | $15  |
| Enterprise | 500,000  | $50  |

---

## 📄 License

MIT. Free for commercial and open-source use. No attribution required.

---
