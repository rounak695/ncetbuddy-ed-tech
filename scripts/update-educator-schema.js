
const { Client, Databases, Storage, ID, Permission, Role } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Config
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID_STUDENT;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db';

if (!API_KEY || !PROJECT_ID) {
    console.error('Error: APPWRITE_API_KEY and NEXT_PUBLIC_APPWRITE_PROJECT_ID are required.');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const db = new Databases(client);

async function updateSchema() {
    console.log('--- Updating Educator Schema ---');

    try {
        console.log('Adding "youtubeChannelId" attribute to "educators"...');
        await db.createStringAttribute(DATABASE_ID, 'educators', 'youtubeChannelId', 128, false); // false = not required
        console.log('Attribute added successfully.');
    } catch (e) {
        console.log('Attribute creation failed (might already exist):', e.message);
    }

    console.log('--- Update Complete ---');
}

updateSchema();
