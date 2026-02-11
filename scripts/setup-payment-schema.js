const { Client, Databases, Permission, Role } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID_STUDENT)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db';

async function setupPaymentSchema() {
    console.log('🏗️  Setting up Payment Schema...');

    try {
        // 1. Create 'purchases' collection if it doesn't exist
        try {
            await databases.getCollection(dbId, 'purchases');
            console.log('✅ Collection "purchases" already exists.');
        } catch (e) {
            console.log('⚠️  Collection "purchases" not found. Creating...');
            await databases.createCollection(
                dbId,
                'purchases',
                'Purchases',
                [
                    Permission.read(Role.any()), // Allow read (we'll filter by user in query) - or strictly restrict to user
                    Permission.read(Role.users()), // Authenticated users can read
                    Permission.create(Role.users()), // Authenticated users can create (initiate purchase)
                    Permission.update(Role.any()), // Server updates status (API Key has full access)
                    Permission.delete(Role.any()),
                ]
            );
            console.log('✅ Collection "purchases" created.');
        }

        // 2. Define Attributes
        const attributes = [
            { key: 'userId', type: 'string', size: 255, required: true },
            { key: 'testId', type: 'string', size: 255, required: true },
            { key: 'paymentId', type: 'string', size: 255, required: false },
            { key: 'paymentRequestId', type: 'string', size: 255, required: true },
            { key: 'amount', type: 'double', required: true },
            { key: 'status', type: 'string', size: 50, required: true }, // pending, completed, failed
            { key: 'createdAt', type: 'integer', required: true }, // timestamp
        ];

        console.log('🔄 Checking/Creating attributes for "purchases"...');

        // Helper to delay execution to avoid race conditions when creating attributes
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, 'purchases', attr.key, attr.size, attr.required);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(dbId, 'purchases', attr.key, attr.required);
                } else if (attr.type === 'double') {
                    await databases.createFloatAttribute(dbId, 'purchases', attr.key, attr.required);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(dbId, 'purchases', attr.key, attr.required);
                }
                console.log(`   + Attribute "${attr.key}" created.`);
                await delay(500); // Small delay
            } catch (error) {
                // If attribute already exists, ignore
                if (error.code === 409) {
                    console.log(`   = Attribute "${attr.key}" already exists.`);
                } else {
                    console.error(`   ❌ Error creating attribute "${attr.key}":`, error.message);
                }
            }
        }

        // 3. Update 'tests' collection to include 'price'
        console.log('🔄 Checking/Creating "price" attribute in "tests"...');
        try {
            await databases.createFloatAttribute(dbId, 'tests', 'price', false, 0); // Not required, default 0
            console.log('   + Attribute "price" created in "tests".');
        } catch (error) {
            if (error.code === 409) {
                console.log('   = Attribute "price" already exists in "tests".');
            } else {
                console.error('   ❌ Error creating attribute "price":', error.message);
            }
        }

        console.log('🎉 Payment Schema Setup Complete!');

    } catch (error) {
        console.error('❌ Schema setup failed:', error);
    }
}

setupPaymentSchema();
