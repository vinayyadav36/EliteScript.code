/**
 * Appwrite SDK Client
 *
 * Configured client for the Appwrite backend.
 */

import { Client, Account, Databases, Storage, Query } from 'appwrite';

const ENDPOINT = "https://syd.cloud.appwrite.io/v1";
const PROJECT_ID = "69d77850001bef04a924";
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID as string | undefined;

const PRODUCTS_COLLECTION = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID as string | undefined;
const SERVICES_COLLECTION = import.meta.env.VITE_APPWRITE_SERVICES_COLLECTION_ID as string | undefined;
const LEADS_COLLECTION = import.meta.env.VITE_APPWRITE_LEADS_COLLECTION_ID as string | undefined;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID as string | undefined;

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases };

export function isAppwriteConfigured(): boolean {
  return !!DATABASE_ID;
}

// --- Database Helpers ---

export async function fetchActiveProducts() {
  if (!DATABASE_ID || !PRODUCTS_COLLECTION) return null;

  try {
    const response = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION, [
      Query.orderDesc('$createdAt'),
    ]);
    return response.documents;
  } catch (err) {
    console.error('[Appwrite] Failed to fetch products:', err);
    return null;
  }
}

export async function fetchServices() {
  if (!DATABASE_ID || !SERVICES_COLLECTION) return null;

  try {
    const response = await databases.listDocuments(DATABASE_ID, SERVICES_COLLECTION);
    return response.documents;
  } catch (err) {
    console.error('[Appwrite] Failed to fetch services:', err);
    return null;
  }
}

export async function submitContactLead(lead: {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  productInterest?: string;
  source?: string;
}) {
  if (!DATABASE_ID || !LEADS_COLLECTION) {
    console.warn('[Appwrite] Cannot submit lead — database ID or collection not configured.');
    return null;
  }

  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      LEADS_COLLECTION,
      'unique()',
      {
        ...lead,
        source: lead.source || 'website',
      }
    );
    return doc;
  } catch (err) {
    console.error('[Appwrite] Failed to submit contact lead:', err);
    return null;
  }
}

// --- Storage Helpers ---

export function getProductImageUrl(fileId: string): string | null {
  if (!BUCKET_ID) return null;

  try {
    return storage.getFileView(BUCKET_ID, fileId);
  } catch {
    return null;
  }
}

// Re-export config for components that need IDs directly
export const config = {
  databaseId: DATABASE_ID,
  productsCollection: PRODUCTS_COLLECTION,
  servicesCollection: SERVICES_COLLECTION,
  leadsCollection: LEADS_COLLECTION,
  bucketId: BUCKET_ID,
} as const;
