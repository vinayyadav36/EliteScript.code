import { Client, Account, Databases, Storage } from 'appwrite'
import { logger } from '@/utils/logger'

const client = new Client()

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

if (projectId) {
    client
        .setEndpoint(endpoint)
        .setProject(projectId)
} else {
    logger.warn('Appwrite project ID is not set. Appwrite features will fall back to local mode.')
}

const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)

export { client, account, databases, storage }