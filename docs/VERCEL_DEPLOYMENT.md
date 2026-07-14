# Vercel Deployment Guide

## Prerequisites

- GitHub repository connected to Vercel
- Appwrite project configured (see [Appwrite Setup](../APPWRITE_SETUP.md))
- All environment variables ready

## Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import your GitHub repository
4. Vercel auto-detects the framework (Vite) and build settings

## Step 2: Configure Environment Variables

In the Vercel project settings, add all variables from `.env`:

| Variable | Example |
|----------|---------|
| `VITE_APPWRITE_ENDPOINT` | `https://cloud.appwrite.io/v1` |
| `VITE_APPWRITE_PROJECT_ID` | `69d77850001bef04a924` |
| `VITE_APPWRITE_DATABASE_ID` | `saltedhash_public` |
| `VITE_APPWRITE_PRODUCTS_COLLECTION_ID` | `products` |
| `VITE_APPWRITE_SERVICES_COLLECTION_ID` | `services` |
| `VITE_APPWRITE_LEADS_COLLECTION_ID` | `contact_leads` |
| `VITE_APPWRITE_BUCKET_ID` | `product_assets` |
| `VITE_WHATSAPP_NUMBER` | `918930609914` |
| `VITE_CONTACT_EMAIL` | `askvinaybusiness@gmail.com` |
| `VITE_INSTAGRAM_URL` | `https://instagram.com/triu.official` |
| `VITE_LINKEDIN_URL` | `https://linkedin.com/company/saltedhash` |

> **Important:** Never add `APPWRITE_API_KEY` to Vercel env vars if it contains server-side secrets that should not be exposed to the client bundle.

## Step 3: Build Configuration

Vercel auto-detects:

- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

These match the project's `package.json` — no overrides needed.

## Step 4: Serverless API Routes

The `vercel.json` configuration routes API requests:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/index.ts" },
    { "source": "/(.*)", "destination": "/$1" }
  ]
}
```

- `/api/*` requests are routed to `api/index.ts` as a serverless function
- All other requests serve the SPA from `dist/`

## Step 5: Deploy

Push to `main` branch to trigger automatic deployment. Vercel will:

1. Install dependencies
2. Run `vite build` (production build)
3. Deploy static files to Edge Network
4. Deploy `api/index.ts` as a serverless function

## Production Notes

### Order Persistence

In Vercel serverless, orders are written to `/tmp/orders.json`. This file is **ephemeral** — it resets when the serverless function cold-starts. For production use, migrate to Appwrite database or a persistent store.

### HMR Disabled in Production

The Vite dev server HMR is only active during local development (`npm run dev`). Production serves pre-built static files.

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown by Vercel
4. SSL certificates are provisioned automatically

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page after deploy | Check that `VITE_*` env vars are set in Vercel dashboard |
| API routes return 404 | Verify `vercel.json` is in the repository root |
| Build fails | Run `npm run build` locally to reproduce |
| Orders not persisting | Expected — `/tmp` resets on cold start; use Appwrite database |
