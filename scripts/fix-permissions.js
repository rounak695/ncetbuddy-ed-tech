const sdk = require('node-appwrite');
const client = new sdk.Client();

// Configuration
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
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

async function fixPermissions() {
    console.log('Fixing Appwrite Permissions...');

    // 1. Users Collection
    // Allow 'users' to create. Enable Document Security so creator becomes owner.
    // Allow 'any' to read (public profiles).
    try {
        console.log('Updating users collection...');
        await databases.updateCollection(
            DATABASE_ID,
            'users',
            'users',
            [
                sdk.Permission.create(sdk.Role.users()),
                sdk.Permission.read(sdk.Role.any()), // Public profiles
                // Update/Delete left empty at collection level, handled by Document Security (Owner)
            ],
            true // Document Security Enabled
        );
        console.log('  -> users: Fixed');
    } catch (e) { console.error('  -> users: Failed', e.message); }

    // 2. Test Results
    // Allow 'users' to create. Document Security enabled.
    try {
        console.log('Updating test-results collection...');
        await databases.updateCollection(
            DATABASE_ID,
            'test-results',
            'test-results',
            [
                sdk.Permission.create(sdk.Role.users()),
                sdk.Permission.read(sdk.Role.users()), // Authenticated users can read (or maybe just owner?)
                // Let's allow users to read for leaderboards potentially, but for now strict.
            ],
            true // Document Security Enabled
        );
        console.log('  -> test-results: Fixed');
    } catch (e) { console.error('  -> test-results: Failed', e.message); }

    // 3. Public Content (Books, Tests, PYQs, Formula Cards, Notifications)
    // Read: Any
    // Create/Update/Delete: Users (For now, to allow Admin Dashboard to work for logged in users)
    const publicCollections = ['books', 'tests', 'pyqs', 'formula_cards', 'notifications', 'settings'];

    for (const colId of publicCollections) {
        try {
            console.log(`Updating ${colId} collection...`);
            await databases.updateCollection(
                DATABASE_ID,
                colId,
                colId, // Name (reusing ID as name is fine for update)
                [
                    sdk.Permission.read(sdk.Role.any()),
                    sdk.Permission.create(sdk.Role.users()),
                    sdk.Permission.update(sdk.Role.users()),
                    sdk.Permission.delete(sdk.Role.users()),
                ],
                false // Document Security Disabled (Simple role based access)
            );
            console.log(`  -> ${colId}: Fixed`);
        } catch (e) { console.error(`  -> ${colId}: Failed`, e.message); }
    }

    console.log('Permissions Update Complete!');
}

fixPermissions().catch(console.error);
