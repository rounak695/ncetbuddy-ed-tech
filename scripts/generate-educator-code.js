#!/usr/bin/env node

/**
 * Educator Code Generator
 * 
 * Usage:
 *   npm run generate-code -- --label "John Doe"
 * 
 * OR:
 *   APPWRITE_PROJECT_ID=xxx APPWRITE_API_KEY=yyy node scripts/generate-educator-code.js --label "John Doe"
 */

const sdk = require('node-appwrite');
const crypto = require('crypto');

const client = new sdk.Client();
const databases = new sdk.Databases(client);

const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!PROJECT_ID || !API_KEY) {
    console.error('\n❌ Missing required environment variables:');
    console.error('   APPWRITE_PROJECT_ID (Educator project ID)');
    console.error('   APPWRITE_API_KEY (Admin API key)\n');
    console.error('Example:');
    console.error('  APPWRITE_PROJECT_ID=697c7cf2003bcd6cd483 APPWRITE_API_KEY=xxx node scripts/generate-educator-code.js --label "John Doe"\n');
    process.exit(1);
}

client
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

// Parse command line args
const args = process.argv.slice(2);
const labelIndex = args.indexOf('--label');
const educatorLabel = labelIndex !== -1 ? args[labelIndex + 1] : 'Unnamed Educator';

// Generate code
function generateCode() {
    const part1 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const part2 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const part3 = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `NCET-${part1}-${part2}-${part3}`;
}

// Hash code
function hashCode(code) {
    return crypto.createHash('sha256').update(code.trim().toUpperCase()).digest('hex');
}

// Get hint (last 4 chars)
function getHint(code) {
    return code.slice(-4);
}

async function main() {
    console.log('\n🔐 Generating Educator Code...\n');

    const code = generateCode();
    const codeHash = hashCode(code);
    const codeHint = getHint(code);

    try {
        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db';

        const doc = await databases.createDocument(
            dbId,
            'educator_codes',
            sdk.ID.unique(),
            {
                codeHash,
                codeHint,
                active: true,
                createdAt: Math.floor(Date.now() / 1000),
                educatorLabel,
                boundUserId: null,
                boundEmail: null,
                lastUsedAt: null,
            }
        );

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Educator Code Generated\n');
        console.log(`   Code:  ${code}`);
        console.log(`   Label: ${educatorLabel}`);
        console.log(`   Hint:  ...${codeHint}`);
        console.log(`   ID:    ${doc.$id}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('⚠️  IMPORTANT: Save this code securely!');
        console.log('   It will NOT be shown again.\n');
        console.log('   Provide this code to the educator to access');
        console.log('   the platform at /educator/login\n');

    } catch (err) {
        console.error('\n❌ Failed to generate code:', err.message);
        process.exit(1);
    }
}

main();
