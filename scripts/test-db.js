const { Client, Databases } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

console.log('Testing Appwrite config');
console.log('Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
console.log('Project:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID_STUDENT || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
console.log('Key length:', process.env.APPWRITE_API_KEY ? process.env.APPWRITE_API_KEY.length : 0);

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID_STUDENT || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function testConnection() {
    try {
        const collections = await databases.listCollections(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID);
        console.log('Success! Found collections:', collections.total);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

testConnection();
