# Vercel Deployment Guide

The SALTEDHASH application is designed to be deployed cleanly as a Single Page Application (SPA) on Vercel.

## 1. Pre-Deployment Configuration
Ensure you have the following environment variables configured in your Vercel Project Settings (under `Environment Variables`):

- `VITE_APPWRITE_ENDPOINT` (e.g., `https://cloud.appwrite.io/v1`)
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID` (Default: `saltedhash_public`)
- `VITE_APPWRITE_PRODUCTS_COLLECTION_ID` (Default: `products`)
- `VITE_APPWRITE_SERVICES_COLLECTION_ID` (Default: `services`)
- `VITE_APPWRITE_LEADS_COLLECTION_ID` (Default: `contact_leads`)
- `VITE_APPWRITE_BUCKET_ID` (Default: `product_assets`)

_Note: Do not add `APPWRITE_API_KEY` to Vercel, as it is only needed locally for the initialization script._

## 2. Build Settings
When deploying via the Vercel dashboard, ensure the Build & Development Settings are:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## 3. History Mode & Rewrites
Because the application uses Vue Router in `history` mode, navigation outside the root `/` will 404 if a user refreshes the page on Vercel.

To prevent this, a `vercel.json` file is included in the project root:
```json
{
  "rewrites": [
    { "source": "/((?!icons|favicon\\.svg|sw\\.js|workbox|manifest\\.webmanifest).*)", "destination": "/index.html" }
  ]
}
```
This configuration correctly routes all application paths to `index.html` while preserving access to Progressive Web App (PWA) assets.
