const fs = require('fs');
const path = require('path');

// Simulate pricing logic
const pricingPath = path.resolve(__dirname, '..', 'pricing.js');
eval(fs.readFileSync(pricingPath, 'utf8'));

const P = globalThis.LUCAS_PRICING || (typeof window !== 'undefined' ? window.LUCAS_PRICING : null);

if (!P) {
  console.error('NO_PRICING');
  process.exit(1);
}

// Test empty
const empty = P.calculate({ type: null });
if (empty.total !== 0) { console.error('EMPTY_FAIL'); process.exit(1); }

// Test landing
const land = P.calculate({ type: 'landing', pages: ['home','contato'], features: ['responsivo','whatsapp'], integrations: [], ia: [], automation: [], extras: [] });
if (land.total <= 0) { console.error('LAND_FAIL'); process.exit(1); }
if (!land.min || !land.max) { console.error('RANGE_FAIL'); process.exit(1); }

// Test WhatsApp message
const msg = P.buildWhatsAppMessage({ type: 'landing', pages: ['home'], features: ['whatsapp'], integrations: [], ia: [], automation: [], extras: [], name: 'Teste' }, land);
if (!msg.includes('Estimativa no site')) { console.error('MSG_FAIL'); process.exit(1); }
if (!msg.includes('valores aproximados')) { console.error('MSG_WARN_FAIL'); process.exit(1); }

console.log('PRICING_TESTS_OK', land.total);
