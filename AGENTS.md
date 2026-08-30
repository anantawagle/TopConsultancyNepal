<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Top Consultancy Nepal - Developer Guide

## Repository Structure
- `app/`: Next.js App Router static pages
- `components/`: Reusable UI components
- `studio/`: Sanity CMS configuration and schemas
- `functions/api/`: Cloudflare Pages API Functions (Enquiries)
- `migrations/d1/`: D1 SQL migrations
- `lib/`: Shared utilities, Sanity client, SEO helpers

## Commands
- `npm run dev`: Start local dev server
- `npm run build`: Build static site
- `npm run lint`: Run ESLint

## Conventions
- **No SSR/ISR**: The Next.js app must be completely statically exported.
- **Sanity**: Always use `useCdn: false` for the static build to fetch fresh data.
- **Security**: Never expose D1 credentials, Turnstile secret, or Sanity write tokens to the client.
