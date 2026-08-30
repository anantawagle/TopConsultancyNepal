# Top Consultancy Nepal

A modern, fast, and SEO-optimized directory for education consultancies in Nepal.

## Tech Stack
- Next.js (App Router, Static Export)
- Tailwind CSS v4
- Sanity CMS (Headless CMS for content management)
- Cloudflare Pages (Static hosting)
- Cloudflare Pages Functions (API routes)
- Cloudflare D1 (Serverless SQL database for enquiries)
- Cloudflare Turnstile (Spam protection)

## Setup Instructions

### Environment Variables
Copy the `.env.example` file to `.env` or `.env.local` and fill in the required values.

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```
Runs the Next.js app on `http://localhost:3000`.

### Sanity Studio
The Sanity Studio is integrated into the Next.js app at `/studio`.
To manage content, navigate to `http://localhost:3000/studio`.

### Cloudflare Local Development
To test Cloudflare Functions and D1 locally, use Wrangler:
```bash
npm install -g wrangler
wrangler pages dev .next/server --d1 DB
```

### Deployment
The project is configured for Cloudflare Pages.
Build command: `npm run build`
Output directory: `out` (or `.next` depending on Next.js export settings)
