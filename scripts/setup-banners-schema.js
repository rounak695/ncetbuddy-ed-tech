const { Client, Databases, Permission, Role } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID_STUDENT || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db';

async function setupBannersSchema() {
    console.log('🏗️  Setting up Banners Schema...');

    try {
        // 1. Create 'banners' collection if it doesn't exist
        try {
            await databases.getCollection(dbId, 'banners');
            console.log('✅ Collection "banners" already exists.');
        } catch (e) {
            console.log('⚠️  Collection "banners" not found. Creating...');
            await databases.createCollection(
                dbId,
                'banners',
                'Carousel Banners',
                [
                    Permission.read(Role.any()), // Allow anyone to read banners
                    Permission.create(Role.any()), // Server-side requires this for admin features using client SDK
                    Permission.update(Role.any()),
                    Permission.delete(Role.any()),
                ]
            );
            console.log('✅ Collection "banners" created.');
        }

        // 2. Define Attributes
        const attributes = [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'imageUrl', type: 'string', size: 1024, required: true },
            { key: 'linkUrl', type: 'string', size: 1024, required: false },
            { key: 'isActive', type: 'boolean', required: true, default: true },
            { key: 'order', type: 'integer', required: true, default: 0 },
            { key: 'createdAt', type: 'integer', required: true }, // timestamp
        ];

        console.log('🔄 Checking/Creating attributes for "banners"...');

        // Helper to delay execution to avoid race conditions when creating attributes
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, 'banners', attr.key, attr.size, attr.required);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(dbId, 'banners', attr.key, attr.required, attr.default);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(dbId, 'banners', attr.key, attr.required, attr.default);
                }
                console.log(`   + Attribute "${attr.key}" creation initiated.`);
                await delay(2000); // 2 second delay between attributes for Appwrite to process
            } catch (error) {
                // If attribute already exists, ignore
                if (error.code === 409) {
                    console.log(`   = Attribute "${attr.key}" already exists.`);
                } else {
                    console.error(`   ❌ Error creating attribute "${attr.key}":`, error.message);
                }
            }
        }

        console.log('🎉 Banners Schema Setup Complete! Note: Background attribute creation might take a few moments.');

    } catch (error) {
        console.error('❌ Schema setup failed:', error);
    }
}

setupBannersSchema();
