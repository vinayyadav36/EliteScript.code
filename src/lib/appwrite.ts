/**
 * Appwrite SDK Client
 *
 * Lazy-initialized client for the Appwrite backend.
 * Falls back gracefully when environment variables are missing.
 */

import { Client, Databases, Storage, Query } from 'appwrite';

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT as string | undefined;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID as string | undefined;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID as string | undefined;

const PRODUCTS_COLLECTION = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID as string | undefined;
const SERVICES_COLLECTION = import.meta.env.VITE_APPWRITE_SERVICES_COLLECTION_ID as string | undefined;
const LEADS_COLLECTION = import.meta.env.VITE_APPWRITE_LEADS_COLLECTION_ID as string | undefined;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID as string | undefined;

let _client: Client | null = null;
let _databases: Databases | null = null;
let _storage: Storage | null = null;

function getClient(): Client | null {
  if (!ENDPOINT || !PROJECT_ID) {
    console.warn('[Appwrite] Missing VITE_APPWRITE_ENDPOINT or VITE_APPWRITE_PROJECT_ID — running in offline/fallback mode.');
    return null;
  }

  if (!_client) {
    _client = new Client();
    _client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);
  }

  return _client;
}

export function getDatabases(): Databases | null {
  if (_databases) return _databases;
  const client = getClient();
  if (!client) return null;
  _databases = new Databases(client);
  return _databases;
}

export function getStorage(): Storage | null {
  if (_storage) return _storage;
  const client = getClient();
  if (!client) return null;
  _storage = new Storage(client);
  return _storage;
}

export function isAppwriteConfigured(): boolean {
  return !!ENDPOINT && !!PROJECT_ID && !!DATABASE_ID;
}

// --- Database Helpers ---

export async function fetchActiveProducts() {
  const db = getDatabases();
  if (!db || !DATABASE_ID || !PRODUCTS_COLLECTION) return null;

  try {
    const response = await db.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION, [
      Query.equal('status', 'active'),
      Query.orderDesc('$createdAt'),
    ]);
    return response.documents;
  } catch (err) {
    console.error('[Appwrite] Failed to fetch products:', err);
    return null;
  }
}

export async function fetchServices() {
  const db = getDatabases();
  if (!db || !DATABASE_ID || !SERVICES_COLLECTION) return null;

  try {
    const response = await db.listDocuments(DATABASE_ID, SERVICES_COLLECTION);
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
  const db = getDatabases();
  if (!db || !DATABASE_ID || !LEADS_COLLECTION) {
    console.warn('[Appwrite] Cannot submit lead — backend not configured.');
    return null;
  }

  try {
    const doc = await db.createDocument(
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
  const storage = getStorage();
  if (!storage || !BUCKET_ID) return null;

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
