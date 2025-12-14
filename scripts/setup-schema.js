const sdk = require('node-appwrite');
const client = new sdk.Client();

// Configuration
// You need to set these environment variables before running the script
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY; // Needs 'collections.write', 'attributes.write', 'databases.write' scopes
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db';

if (!PROJECT_ID || !API_KEY) {
    console.error('Error: Please set NEXT_PUBLIC_APPWRITE_PROJECT_ID and APPWRITE_API_KEY environment variables.');
    process.exit(1);
}

client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new sdk.Databases(client);

const collections = [
    {
        name: 'users',
        id: 'users',
        attributes: [
            { key: 'userId', type: 'string', size: 255, required: true },
            { key: 'email', type: 'string', size: 255, required: true },
            { key: 'displayName', type: 'string', size: 255, required: false },
            { key: 'role', type: 'string', size: 50, required: false, default: 'user' },
            { key: 'premiumStatus', type: 'boolean', required: false, default: false },
            { key: 'isBanned', type: 'boolean', required: false, default: false },
            { key: 'createdAt', type: 'integer', required: false },
        ]
    },
    {
        name: 'tests',
        id: 'tests',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'subject', type: 'string', size: 100, required: true },
            { key: 'duration', type: 'integer', required: true },
            { key: 'questions', type: 'string', size: 1000000, required: true }, // Large string for JSON
            { key: 'createdAt', type: 'integer', required: false },
        ]
    },
    {
        name: 'books',
        id: 'books',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'subject', type: 'string', size: 100, required: true },
            { key: 'chapter', type: 'string', size: 255, required: false },
            { key: 'url', type: 'string', size: 1000, required: true },
            { key: 'thumbnailColor', type: 'string', size: 50, required: false },
            { key: 'isVisible', type: 'boolean', required: false, default: true },
            { key: 'createdAt', type: 'integer', required: false },
        ]
    },
    {
        name: 'formula_cards',
        id: 'formula_cards',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'subject', type: 'string', size: 100, required: true },
            { key: 'chapter', type: 'string', size: 255, required: false },
            { key: 'content', type: 'string', size: 10000, required: false },
            { key: 'imageUrl', type: 'string', size: 1000, required: false },
            { key: 'isVisible', type: 'boolean', required: false, default: true },
            { key: 'createdAt', type: 'integer', required: false },
        ]
    },
    {
        name: 'pyqs',
        id: 'pyqs',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'subject', type: 'string', size: 100, required: true },
            { key: 'year', type: 'integer', required: true },
            { key: 'url', type: 'string', size: 1000, required: true },
            { key: 'createdAt', type: 'integer', required: false },
        ]
    },
    {
        name: 'notifications',
        id: 'notifications',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'message', type: 'string', size: 5000, required: true },
            { key: 'type', type: 'string', size: 50, required: false, default: 'info' },
            { key: 'createdAt', type: 'integer', required: false },
        ]
    },
    {
        name: 'test-results',
        id: 'test-results',
        attributes: [
            { key: 'userId', type: 'string', size: 255, required: true },
            { key: 'testId', type: 'string', size: 255, required: true },
            { key: 'score', type: 'integer', required: true },
            { key: 'totalQuestions', type: 'integer', required: true },
            { key: 'answers', type: 'string', size: 1000000, required: false }, // JSON
            { key: 'completedAt', type: 'integer', required: false },
        ]
    },
    {
        name: 'settings',
        id: 'settings',
        attributes: [
            { key: 'siteName', type: 'string', size: 255, required: false },
            { key: 'contactEmail', type: 'string', size: 255, required: false },
            { key: 'allowSignup', type: 'boolean', required: false, default: true },
            { key: 'maintenanceMode', type: 'boolean', required: false, default: false },
        ]
    }
];

async function setup() {
    console.log('Starting Appwrite Database Setup...');

    // 1. Create Database if not exists
    try {
        await databases.get(DATABASE_ID);
        console.log(`Database '${DATABASE_ID}' already exists.`);
    } catch (error) {
        if (error.code === 404) {
            console.log(`Creating database '${DATABASE_ID}'...`);
            await databases.create(DATABASE_ID, 'NCET Buddy Database');
        } else {
            throw error;
        }
    }

    // 2. Create Collections and Attributes
    for (const col of collections) {
        console.log(`Processing collection: ${col.name}...`);

        // Create Collection
        try {
            await databases.getCollection(DATABASE_ID, col.id);
            console.log(`  Collection '${col.name}' already exists.`);
        } catch (error) {
            if (error.code === 404) {
                console.log(`  Creating collection '${col.name}'...`);
                await databases.createCollection(DATABASE_ID, col.id, col.name);
            } else {
                throw error;
            }
        }

        // Create Attributes
        for (const attr of col.attributes) {
            try {
                // Check if attribute exists (this is tricky, so we just try to create and ignore 409 conflict)
                if (attr.type === 'string') {
                    await databases.createStringAttribute(DATABASE_ID, col.id, attr.key, attr.size, attr.required, attr.default);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(DATABASE_ID, col.id, attr.key, attr.required, 0, 2147483647, attr.default);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(DATABASE_ID, col.id, attr.key, attr.required, attr.default);
                }
                console.log(`    Created attribute '${attr.key}'`);
                // Wait a bit because attribute creation is async in Appwrite backend
                await new Promise(r => setTimeout(r, 500));
            } catch (error) {
                if (error.code === 409) {
                    console.log(`    Attribute '${attr.key}' already exists.`);
                } else {
                    console.error(`    Error creating attribute '${attr.key}':`, error.message);
                }
            }
        }
        // Wait between collections to avoid rate limits
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log('Setup Complete!');
}

setup().catch(console.error);
