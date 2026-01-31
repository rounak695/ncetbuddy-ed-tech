const sdk = require('node-appwrite');

// Run: APPWRITE_PROJECT_ID=697c7cf2003bcd6cd483 APPWRITE_API_KEY=your_key node scripts/setup-educator-collections.js

const client = new sdk.Client();
const databases = new sdk.Databases(client);

const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!PROJECT_ID || !API_KEY) {
    console.error("❌ Please set APPWRITE_PROJECT_ID and APPWRITE_API_KEY");
    process.exit(1);
}

client
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const DB_ID = 'ncet-buddy-db';

async function setupCollections() {
    console.log('🚀 Setting up Educator Auth Collections...\n');

    // Collection 1: educator_codes
    console.log('📦 Creating educator_codes collection...');
    try {
        await databases.createCollection(DB_ID, 'educator_codes', 'Educator Codes');
        console.log('  ✅ Collection created');
    } catch (err) {
        if (err.code === 409) {
            console.log('  ✅ Collection already exists');
        } else {
            console.error('  ❌ Error:', err.message);
            return;
        }
    }

    // Attributes for educator_codes
    const educatorCodesAttrs = [
        { key: 'codeHash', type: 'string', size: 64, required: true },
        { key: 'codeHint', type: 'string', size: 8, required: false },
        { key: 'active', type: 'boolean', required: true, default: true },
        { key: 'createdAt', type: 'integer', required: true },
        { key: 'educatorLabel', type: 'string', size: 255, required: false },
        { key: 'boundUserId', type: 'string', size: 255, required: false },
        { key: 'boundEmail', type: 'string', size: 255, required: false },
        { key: 'lastUsedAt', type: 'integer', required: false },
    ];

    for (const attr of educatorCodesAttrs) {
        try {
            if (attr.type === 'string') {
                await databases.createStringAttribute(DB_ID, 'educator_codes', attr.key, attr.size, attr.required);
            } else if (attr.type === 'integer') {
                await databases.createIntegerAttribute(DB_ID, 'educator_codes', attr.key, attr.required);
            } else if (attr.type === 'boolean') {
                await databases.createBooleanAttribute(DB_ID, 'educator_codes', attr.key, attr.required, attr.default);
            }
            console.log(`  ✅ ${attr.key}`);
        } catch (err) {
            if (err.code === 409) {
                console.log(`  ⏭️  ${attr.key} (exists)`);
            } else {
                console.error(`  ❌ ${attr.key}:`, err.message);
            }
        }
        await new Promise(r => setTimeout(r, 300));
    }

    // Create index on codeHash for fast lookups
    try {
        await databases.createIndex(DB_ID, 'educator_codes', 'codeHash_idx', 'unique', ['codeHash']);
        console.log('  ✅ Index on codeHash created');
    } catch (err) {
        if (err.code === 409) {
            console.log('  ⏭️  Index already exists');
        }
    }

    // Collection 2: user_profiles
    console.log('\n📦 Creating user_profiles collection...');
    try {
        await databases.createCollection(DB_ID, 'user_profiles', 'User Profiles');
        console.log('  ✅ Collection created');
    } catch (err) {
        if (err.code === 409) {
            console.log('  ✅ Collection already exists');
        } else {
            console.error('  ❌ Error:', err.message);
            return;
        }
    }

    // Attributes for user_profiles
    const userProfilesAttrs = [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'role', type: 'string', size: 20, required: true, default: 'student' },
        { key: 'educatorCodeId', type: 'string', size: 255, required: false },
        { key: 'email', type: 'string', size: 255, required: false },
        { key: 'createdAt', type: 'integer', required: true },
    ];

    for (const attr of userProfilesAttrs) {
        try {
            if (attr.type === 'string') {
                await databases.createStringAttribute(DB_ID, 'user_profiles', attr.key, attr.size, attr.required);
            } else if (attr.type === 'integer') {
                await databases.createIntegerAttribute(DB_ID, 'user_profiles', attr.key, attr.required);
            }
            console.log(`  ✅ ${attr.key}`);
        } catch (err) {
            if (err.code === 409) {
                console.log(`  ⏭️  ${attr.key} (exists)`);
            } else {
                console.error(`  ❌ ${attr.key}:`, err.message);
            }
        }
        await new Promise(r => setTimeout(r, 300));
    }

    // Create index on userId for fast lookups
    try {
        await databases.createIndex(DB_ID, 'user_profiles', 'userId_idx', 'unique', ['userId']);
        console.log('  ✅ Index on userId created');
    } catch (err) {
        if (err.code === 409) {
            console.log('  ⏭️  Index already exists');
        }
    }

    // Set permissions
    console.log('\n🔐 Setting permissions...');

    // educator_codes: Read only for admins (no public access)
    try {
        await databases.updateCollection(DB_ID, 'educator_codes', 'Educator Codes', []);
        console.log('  ✅ educator_codes: Admin-only access');
    } catch (err) {
        console.error('  ❌ educator_codes permissions:', err.message);
    }

    // user_profiles: Users can read/update their own profile
    try {
        await databases.updateCollection(DB_ID, 'user_profiles', 'User Profiles', [
            'read("any")',
            'create("users")',
            'update("users")',
        ]);
        console.log('  ✅ user_profiles: Users can manage own profiles');
    } catch (err) {
        console.error('  ❌ user_profiles permissions:', err.message);
    }

    console.log('\n✅ Setup complete!');
}

setupCollections();
