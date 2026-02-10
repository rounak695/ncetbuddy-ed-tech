const sdk = require('node-appwrite');

// Usage: 
// 1. Export API key: export APPWRITE_API_KEY=your_admin_api_key
// 2. Export Project ID: export APPWRITE_PROJECT_ID=your_project_id
// 3. Run: node scripts/setup-schema.js

const client = new sdk.Client();
const databases = new sdk.Databases(client);

const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1'; // Update region if needed
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!PROJECT_ID || !API_KEY) {
    console.error("Please set APPWRITE_PROJECT_ID and APPWRITE_API_KEY environment variables.");
    process.exit(1);
}

client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const DB_ID = 'ncet-buddy-db';

const COLLECTIONS = [
    {
        id: 'users',
        name: 'Users',
        attributes: [
            { key: 'userId', type: 'string', size: 255, required: true },
            { key: 'email', type: 'string', size: 255, required: true },
            { key: 'displayName', type: 'string', size: 255, required: true },
            { key: 'role', type: 'string', size: 255, required: true },
            { key: 'premiumStatus', type: 'boolean', required: true },
            { key: 'isBanned', type: 'boolean', required: false },
            { key: 'totalScore', type: 'integer', required: false },
            { key: 'testsAttempted', type: 'integer', required: false },
            { key: 'createdAt', type: 'integer', required: false },
        ]
    },
    {
        id: 'tests',
        name: 'Tests',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 10000, required: false },
            { key: 'subject', type: 'string', size: 255, required: false },
            { key: 'duration', type: 'integer', required: true },
            { key: 'questions', type: 'string', size: 1000000, required: true }, // JSON array
            { key: 'createdBy', type: 'string', size: 255, required: true },
            { key: 'isVisible', type: 'boolean', required: true },
            { key: 'status', type: 'string', size: 255, required: false },
            { key: 'createdAt', type: 'integer', required: true },
        ]
    },
    {
        id: 'test-results',
        name: 'Test Results',
        attributes: [
            { key: 'userId', type: 'string', size: 255, required: true },
            { key: 'testId', type: 'string', size: 255, required: true },
            { key: 'score', type: 'integer', required: true },
            { key: 'totalQuestions', type: 'integer', required: true },
            { key: 'answers', type: 'string', size: 100000, required: true }, // JSON object
            { key: 'completedAt', type: 'integer', required: true },
        ]
    },
    {
        id: 'books',
        name: 'Books',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'subject', type: 'string', size: 255, required: true },
            { key: 'chapter', type: 'string', size: 255, required: false },
            { key: 'url', type: 'url', required: true },
            { key: 'thumbnailColor', type: 'string', size: 255, required: true },
            { key: 'isVisible', type: 'boolean', required: true },
            { key: 'createdAt', type: 'integer', required: false },
        ]
    },
    {
        id: 'formula_cards',
        name: 'Formula Cards',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'subject', type: 'string', size: 255, required: true },
            { key: 'chapter', type: 'string', size: 255, required: false },
            { key: 'content', type: 'string', size: 10000, required: false },
            { key: 'imageUrl', type: 'url', required: false },
            { key: 'url', type: 'url', required: false },
            { key: 'isVisible', type: 'boolean', required: true },
            { key: 'createdAt', type: 'integer', required: false },
        ]
    },
    {
        id: 'pyqs',
        name: 'PYQs',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'subject', type: 'string', size: 255, required: true },
            { key: 'year', type: 'integer', required: true },
            { key: 'url', type: 'url', required: true },
            { key: 'createdAt', type: 'integer', required: true },
        ]
    },
    {
        id: 'videos',
        name: 'Video Classes',
        attributes: [
            { key: 'videoId', type: 'string', size: 255, required: false },
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 5000, required: false },
            { key: 'url', type: 'url', required: true },
            { key: 'duration', type: 'integer', required: false },
            { key: 'authorId', type: 'string', size: 255, required: false },
            { key: 'subject', type: 'string', size: 255, required: false },
            { key: 'thumbnailUrl', type: 'url', required: false },
            { key: 'createdAt', type: 'integer', required: false },
        ]
    },
    {
        id: 'notifications',
        name: 'Notifications',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'message', type: 'string', size: 1000, required: true },
            { key: 'type', type: 'string', size: 255, required: true },
            { key: 'createdAt', type: 'integer', required: true },
        ]
    },
    {
        id: 'settings',
        name: 'Settings',
        attributes: [
            { key: 'bannerText', type: 'string', size: 255, required: true },
            { key: 'primaryColor', type: 'string', size: 255, required: true },
            { key: 'contactEmail', type: 'email', required: true },
            { key: 'showBanner', type: 'boolean', required: true },
        ]
    },
    {
        name: 'videos',
        id: 'videos',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 5000, required: false },
            { key: 'url', type: 'string', size: 1000, required: true },
            { key: 'videoId', type: 'string', size: 255, required: true },
            { key: 'duration', type: 'integer', required: true },
            { key: 'subject', type: 'string', size: 100, required: false, default: 'General' },
            { key: 'authorId', type: 'string', size: 255, required: false },
            { key: 'thumbnailUrl', type: 'string', size: 1000, required: false },
            { key: 'createdAt', type: 'integer', required: false },
        ]
    }
];

async function setup() {
    console.log(`Setting up Database [${DB_ID}] in Project [${PROJECT_ID}]...`);

    // 1. Create Database
    try {
        await databases.create(DB_ID, 'NCET Buddy Database');
        console.log('✅ Database created');
    } catch (err) {
        if (err.code === 409) console.log('✅ Database already exists');
        else {
            console.error('❌ Failed to create database:', err.message);
            return;
        }
    }

    // 2. Create Collections
    for (const col of COLLECTIONS) {
        console.log(`Processing collection [${col.id}]...`);
        try {
            await databases.createCollection(DB_ID, col.id, col.name);
            console.log(`  ✅ Collection created`);
        } catch (err) {
            if (err.code === 409) console.log(`  ✅ Collection already exists`);
            else console.error(`  ❌ Failed to create collection:`, err.message);
        }

        // 3. Create Attributes
        for (const attr of col.attributes) {
            try {
                if (attr.type === 'string') {
                    if (attr.key === 'url' || attr.key === 'imageUrl' || attr.key === 'thumbnailUrl') {
                        await databases.createUrlAttribute(DB_ID, col.id, attr.key, attr.required);
                    } else if (attr.key === 'email' || attr.key === 'contactEmail') {
                        await databases.createEmailAttribute(DB_ID, col.id, attr.key, attr.required);
                    }
                    else {
                        await databases.createStringAttribute(DB_ID, col.id, attr.key, attr.size, attr.required);
                    }
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(DB_ID, col.id, attr.key, attr.required);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(DB_ID, col.id, attr.key, attr.required);
                } else if (attr.type === 'url') {
                    await databases.createUrlAttribute(DB_ID, col.id, attr.key, attr.required);
                }

                console.log(`    ✅ Attribute [${attr.key}] created`);
            } catch (err) {
                if (err.code === 409) console.log(`    ✅ Attribute [${attr.key}] already exists`);
                else console.error(`    ❌ Failed to create attribute [${attr.key}]:`, err.message);
            }
            // Wait a bit to avoid rate limits
            await new Promise(r => setTimeout(r, 200));
        }
    }

    console.log('Setup complete!');
}

setup();
