# Deployment Guide

This document outlines the exact steps to deploy the Top Consultancy Nepal platform.

## 1. Sanity Studio (Backend CMS)

Sanity Studio is maintained as a standalone project in the `studio/` directory. 
We deploy it to Sanity's free hosting.

1. Install Sanity CLI globally: `npm install -g sanity@latest`
2. Login to Sanity: `sanity login`
3. Navigate to the studio directory: `cd studio`
4. Install dependencies: `npm install`
5. Deploy: `npm run deploy` or `sanity deploy`
6. Choose a hostname (e.g., `topconsultancynepal-studio`).

## 2. Cloudflare D1 (Database)

We use D1 for storing enquiries.

1. Ensure you have Wrangler installed: `npm install -g wrangler`
2. Login to Cloudflare: `wrangler login`
3. Create the database: 
   `wrangler d1 create topconsultancynepal-db`
4. Copy the `database_id` provided.
5. Apply migrations:
   `wrangler d1 execute topconsultancynepal-db --local --file=./migrations/d1/0001_create_enquiries.sql`
   `wrangler d1 execute topconsultancynepal-db --remote --file=./migrations/d1/0001_create_enquiries.sql`

## 3. Cloudflare Pages (Frontend)

We deploy the Next.js static site to Cloudflare Pages.

1. Log into the Cloudflare Dashboard.
2. Go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select this GitHub repository.
4. Set up the build:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
5. Set Environment Variables:
   - `NEXT_PUBLIC_SITE_URL` = `https://topconsultancynepal.com`
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `(your sanity project id)`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = `(your site key)`
   - `TURNSTILE_SECRET_KEY` = `(your secret key)` (Encrypt this!)
   - `NODE_VERSION` = `20`
6. Bind D1 Database:
   - In Pages settings -> **Functions** -> **D1 database bindings**
   - Variable name: `DB`
   - D1 namespace: Select the database created in step 2.

## 4. Cloudflare Turnstile

1. In Cloudflare Dashboard, go to **Turnstile**.
2. Add Site: `topconsultancynepal.com`
3. Copy Site Key and Secret Key to your environment variables.

## 5. Domain & Redirects

1. In Cloudflare Pages, go to **Custom Domains**.
2. Add `topconsultancynepal.com`.
3. The `public/_redirects` file automatically redirects `www.topconsultancynepal.com` to the apex domain.

## 6. Daily Rebuild (Content Freshness)

To ensure events expire and stats update:
1. In Cloudflare Pages -> **Settings** -> **Builds & deployments** -> **Deploy hooks**.
2. Create a hook named `Daily Rebuild`.
3. Set up a GitHub Action to call this URL every 24 hours, or use a tool like Cron-job.org.
4. Add another hook for **Sanity Webhook** so publishing content instantly rebuilds the site.
