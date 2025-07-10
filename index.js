import express from 'express';
import { createVerify, createPublicKey } from 'crypto';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import stableStringify from 'fast-json-stable-stringify';

const __dirname = dirname(fileURLToPath(import.meta.url));

function verifySignature(payload, signature, publicKey) {
  const message = stableStringify(payload);
  const verify = createVerify('sha256');
  verify.update(message);

  return verify.verify(publicKey, signature, 'base64');
}

let publicKey;
try {
  const pemPath = join(__dirname, 'ramp-network.public.pem');
  const pemContent = readFileSync(pemPath, 'utf8');

  publicKey = createPublicKey(pemContent);

  console.log('✅ Public key loaded successfully');
} catch (error) {
  console.error('❌ Failed to load public key:', error.message);
  console.error('ℹ️  Note: This may fail if Node.js doesn\'t support secp256k1');
  process.exit(1);
}

const app = express();
app.use(express.json());

app.post('/', (req, res) => {
  const signature = req.header('X-Body-Signature');

  if (!req.body || !signature) {
    return res.status(401).json({ error: 'Missing body or signature' });
  }

  try {
    if (verifySignature(req.body, signature, publicKey)) {
      console.log('✅ Valid webhook:', req.body.type);
      console.log('signature', signature);
      console.log('req.body', req.body);
      console.log('req.headers', req.headers);
      res.status(204).send();
    } else {
      console.log('❌ Invalid signature');
      res.status(401).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('❌ Verification error:', error.message);
    res.status(401).json({ error: 'Verification failed' });
  }
});

app.listen(3000, () => {
  console.log('🚀 Webhook server running on port 3000');
});
