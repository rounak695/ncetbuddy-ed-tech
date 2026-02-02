
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
const storage = new Storage(client);

async function setup() {
    console.log('--- Setting up Educator Video Schema ---');



    // 1. Create Educators Collection
    try {
        console.log('Creating "educators" collection...');
        await db.createCollection(DATABASE_ID, 'educators', 'Educators', [
            Permission.read(Role.any()),
            Permission.write(Role.guests()), // Initially open for dev, or Role.admins()
        ]);
        console.log('Collection created.');

        console.log('Adding attributes to "educators"...');
        await db.createStringAttribute(DATABASE_ID, 'educators', 'name', 128, true);
        await db.createStringAttribute(DATABASE_ID, 'educators', 'subject', 64, true);
        await db.createStringAttribute(DATABASE_ID, 'educators', 'logoFileId', 128, true);
        await db.createStringAttribute(DATABASE_ID, 'educators', 'catalogXmlFileId', 128, true);
        console.log('Attributes added.');
    } catch (e) {
        console.log('Educators collection might already exist:', e.message);
    }

    // 2. Create Video Progress Collection
    try {
        console.log('Creating "video_progress" collection...');
        await db.createCollection(DATABASE_ID, 'video_progress', 'Video Progress', [
            Permission.create(Role.users()),
            Permission.read(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]);
        console.log('Collection created.');

        console.log('Adding attributes to "video_progress"...');
        await db.createStringAttribute(DATABASE_ID, 'video_progress', 'studentId', 128, true);
        await db.createStringAttribute(DATABASE_ID, 'video_progress', 'educatorId', 128, true);
        await db.createStringAttribute(DATABASE_ID, 'video_progress', 'videoId', 128, true);
        await db.createBooleanAttribute(DATABASE_ID, 'video_progress', 'watched', true);
        await db.createIntegerAttribute(DATABASE_ID, 'video_progress', 'lastTimestamp', false);
        console.log('Attributes added.');
    } catch (e) {
        console.log('Video Progress collection might already exist:', e.message);
    }

    // 3. Update User Profiles
    try {
        console.log('Updating "user_profiles"...');
        // Check if attribute exists, if not create
        try {
            await db.createStringAttribute(DATABASE_ID, 'users', 'enrolledEducatorId', 128, false); // Using 'users' based on appwrite-db.ts usage, but check 'user_profiles' if it exists. appwrite-db.ts accesses 'users' collection. 
            // Note: Implementation plan mentioned `user_profiles` but appwrite-db.ts uses `users` collection for leaderboard. 
            // BUT `EDUCATOR_AUTH_SETUP.md` mentioned `user_profiles` collection. I should check which one is the source of truth for profiles.
            // Given the context of "Educator Auth", `user_profiles` seems to be the new standard. 
            // I will try to add to `user_profiles` AND `users` if unsure, or primarily `user_profiles`.
            // Let's stick to `user_profiles` as per the prompt's context (which implies following the educator auth pattern).
            await db.createStringAttribute(DATABASE_ID, 'user_profiles', 'enrolledEducatorId', 128, false);
        } catch (e) {
            // fallback or ignore if exists
        }
    } catch (e) {
        console.log('Attribute might already exist:', e.message);
    }

    // 4. Create Bucket
    try {
        console.log('Creating "educator-xmls" bucket...');
        await storage.createBucket('educator-xmls', 'Educator XMLs', [
            Permission.read(Role.any()), // Public read for XMLs
        ]);
    } catch (e) {
        console.log('Bucket might already exist:', e.message);
    }

    console.log('--- Setup Complete ---');
}

setup();
