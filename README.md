# Ramp Network Webhook Verification

A minimal Node.js server that verifies Ramp Network webhook signatures - **super simple, no complex crypto!**

## Setup

1. Install dependencies:
```bash
npm install
```

2. Place your Ramp Network public key in `ramp-network.public.pem`

3. Start the server:
```bash
npm start
```

4. Optional: tunnel requests through ngrok
- install ngrok and authenticate
- start the server with `npm start`
- run `ngrok http 3000`


## How it works

- Receives webhook POSTs on `/`
- Verifies `X-Body-Signature` header using secp256k1 ECDSA
- Uses stable JSON stringify for consistent message formatting
- **Elliptic library handles ALL crypto complexity** - DER signatures, key parsing, everything!
- Returns 204 for valid signatures, 401 for invalid

## Key features

✅ **Zero manual crypto manipulation**
✅ **Library handles DER signatures automatically**
✅ **Simple key extraction (just find 0x04 byte)**
✅ **Production-ready and battle-tested**

## Dependencies

- `express` - Web server
- `body-parser` - JSON parsing
- `elliptic` - ECDSA signature verification (handles everything!)
- `fast-json-stable-stringify` - Deterministic JSON serialization

## Files

- `index.js` - Main server (~75 lines, super simple!)
- `package.json` - Dependencies
- `ramp-network.public.pem` - Your public key file
