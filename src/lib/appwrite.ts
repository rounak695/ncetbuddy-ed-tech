import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'; // Default or Placeholder
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';

client
    .setEndpoint(endpoint)
    .setProject(projectId);

if (!projectId) {
    console.error("Appwrite Project ID is missing. Please check your .env.local file.");
}

export const isAppwriteConfigured = () => {
    return !!projectId && !!endpoint;
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export default client;
