/**
 * Generate XMTP Keys Script
 * 
 * Generates cryptographic keys required for XMTP messaging.
 * Creates a wallet private key and database encryption key.
 * 
 * @module scripts/generate-keys
 */

import {randomBytes} from "crypto"

import {privateKeyToAccount} from "viem/accounts"

console.log("Generating XMTP KEYS.....\n")


const privateKey = `0x${randomBytes(32).toString('hex')}`
const account = privateKeyToAccount(privateKey)

const encryptionKey = randomBytes(32).toString('hex')

console.log('✅ Keys generated successfully!\n');
console.log('=' .repeat(60));
console.log('Add these to your .env file:\n');
console.log(`XMTP_WALLET_KEY=${privateKey}`);
console.log(`XMTP_DB_ENCRYPTION_KEY=${encryptionKey}`);
console.log('=' .repeat(60));
console.log('\n📬 Agent Address:', account.address);
console.log('\n⚠️  Keep these keys secure and never share them!\n');
