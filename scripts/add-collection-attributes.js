const sdk = require('node-appwrite');

const client = new sdk.Client();
const databases = new sdk.Databases(client);

const API_KEY = 'standard_58f37da35a0e0bd27b05eef0cb2881159f99b2b6b190486854092a920237a91e8d5d5675c04e8dee802c93392ebbda597484cc136e32ce9e32a8a86e10da62cf846a438c448edb5c78e00985b452b71a4386c38b79f3332399a9331d92b56ec2e15cb3e1fe9916de36c8e962b6d81c78e18ca5f2f2f65760e9dbd20d2a34a42e';

client
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('697c7bce001c9be5d650')
    .setKey(API_KEY);

const DB_ID = 'ncet-buddy-db';

const ATTRIBUTES = {
    videos: [
        { key: 'videoId', type: 'string', size: 255, required: false },
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'description', type: 'string', size: 5000, required: false },
        { key: 'url', type: 'url', required: true },
        { key: 'duration', type: 'integer', required: false },
        { key: 'authorId', type: 'string', size: 255, required: false },
        { key: 'subject', type: 'string', size: 255, required: false },
        { key: 'thumbnailUrl', type: 'url', required: false },
        { key: 'createdAt', type: 'integer', required: false },
    ],
    notifications: [
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'message', type: 'string', size: 1000, required: true },
        { key: 'type', type: 'string', size: 255, required: true },
        { key: 'createdAt', type: 'integer', required: true },
    ]
};

async function createAttributes() {
    for (const [collectionId, attrs] of Object.entries(ATTRIBUTES)) {
        console.log(`\n📦 Adding attributes to [${collectionId}]...`);

        for (const attr of attrs) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(DB_ID, collectionId, attr.key, attr.size, attr.required);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(DB_ID, collectionId, attr.key, attr.required);
                } else if (attr.type === 'url') {
                    await databases.createUrlAttribute(DB_ID, collectionId, attr.key, attr.required);
                }
                console.log(`  ✅ ${attr.key}`);
            } catch (err) {
                if (err.code === 409) {
                    console.log(`  ⏭️  ${attr.key} (already exists)`);
                } else {
                    console.error(`  ❌ ${attr.key}:`, err.message);
                }
            }
            // Wait to avoid rate limits
            await new Promise(r => setTimeout(r, 300));
        }
    }

    console.log('\n✅ All attributes created!');
}

createAttributes();
