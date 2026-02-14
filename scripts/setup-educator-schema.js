const { Client, Databases, Permission, Role } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Init SDK
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID_STUDENT)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db';

async function setupEducatorVideos() {
    try {
        console.log('Checking Educator Videos collection...');

        try {
            await databases.getCollection(DB_ID, 'educator_videos');
            console.log('Collection already exists.');
        } catch (error) {
            console.log('Creating Educator Videos collection...');
            await databases.createCollection(DB_ID, 'educator_videos', 'Educator Videos', [
                Permission.read(Role.any()),
                Permission.read(Role.label('educator')),
                Permission.write(Role.label('educator')),
                Permission.update(Role.label('educator')),
                Permission.delete(Role.label('educator')),
            ]);
        }

        console.log('Creating attributes...');

        // Helper to ignore "Attribute already exists" errors
        const createAttr = async (promise) => {
            try {
                await promise;
                console.log('Attribute created.');
            } catch (e) {
                if (e.code === 409) console.log('Attribute already exists.');
                else console.error('Error creating attribute:', e.message);
            }
        };

        await createAttr(databases.createStringAttribute(DB_ID, 'educator_videos', 'educatorId', 255, true));
        // Fixed typo: added 'educator_videos' as 2nd arg
        await createAttr(databases.createStringAttribute(DB_ID, 'educator_videos', 'title', 255, true));
        await createAttr(databases.createUrlAttribute(DB_ID, 'educator_videos', 'url', true));
        // Integer attribute: key, required, min, max, default
        await createAttr(databases.createIntegerAttribute(DB_ID, 'educator_videos', 'createdAt', true));

        console.log('Waiting for attributes to be available...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Creating indexes...');
        const createIdx = async (promise) => {
            try {
                await promise;
                console.log('Index created.');
            } catch (e) {
                if (e.code === 409) console.log('Index already exists.');
                else console.error('Error creating index:', e.message);
            }
        }

        await createIdx(databases.createIndex(DB_ID, 'educator_videos', 'idx_educator', 'key', ['educatorId'], ['ASC']));
        await createIdx(databases.createIndex(DB_ID, 'educator_videos', 'idx_created', 'key', ['createdAt'], ['DESC']));

        console.log('Educator Videos collection setup complete!');
    } catch (error) {
        console.error('Final Error:', error);
    }
}

setupEducatorVideos();
