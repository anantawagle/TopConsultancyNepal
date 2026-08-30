# Architecture

This document describes the architecture of the Top Consultancy Nepal platform.

## Frontend (Next.js)
- **Framework**: Next.js App Router
- **Export**: Fully static export (`output: 'export'`)
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks (useState, useEffect) for filtering logic
- **SEO**: Static metadata generation using `generateMetadata`

The Next.js app is pre-rendered at build time. Dynamic client-side features like search/filtering are handled using query parameters and client-side JavaScript.

## CMS (Sanity)
- **Hosted**: Independently deployed via Sanity CLI (`/studio` directory)
- **Content Flow**: 
  1. Internal team updates Sanity.
  2. Sanity triggers a webhook to Cloudflare Pages (Deploy Hook).
  3. Cloudflare Pages rebuilds the Next.js static site.
- **Images**: Served directly from Sanity's image CDN for optimal performance and caching.

## Backend (Cloudflare)
- **Hosting**: Cloudflare Pages for the static Next.js export.
- **API (Functions)**: Cloudflare Pages Functions located in `/functions/api/enquiries.ts`.
- **Database (D1)**: Cloudflare's serverless SQLite database (D1) stores the enquiries securely. It is NOT exposed to the client.
- **Security (Turnstile)**: Cloudflare Turnstile protects the enquiry form from bots and spam.

## Why Consultancies Do Not Receive Accounts
To maintain strict editorial integrity and prevent spam/fake claims, the platform does not allow consultancies to edit their own profiles directly. Instead, they must submit a "Correction Request" which is manually reviewed by the internal team.

## Security Boundaries
- **Sanity Write Tokens**: Never exposed to the Next.js app.
- **Cloudflare D1**: Only accessible via the Cloudflare Pages Function on the server side.
- **Environment Variables**: Only variables prefixed with `NEXT_PUBLIC_` are bundled with the client application.

## Future Migration Path
If Server-Side Rendering (SSR) becomes necessary (e.g., personalized dashboards), the application can be seamlessly transitioned to run on **Cloudflare Workers** using the `@cloudflare/next-on-pages` adapter, shifting from static export to edge SSR.
