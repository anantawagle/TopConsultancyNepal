# Content Management Guide

This guide explains how to manage content in Sanity Studio for the Top Consultancy Nepal platform.

## Adding Consultancies
1. Open Sanity Studio.
2. Navigate to **Consultancies** in the Desk view.
3. Click the **Edit** icon (pencil) or create a new document.
4. Fill in the **Name**, **Slug**, and **Short Description**.
5. Ensure the **Is Verified?** toggle is correct.
6. Set the **Last Verified Date**.
7. If sponsored, toggle **Is Sponsored?** and include sponsorship dates.

## Adding Destinations (Countries)
1. Navigate to **Countries**.
2. Add a new Country with Name, Slug, and relevant fields (Universities, FAQs, Visa info).
3. Ensure Hero Image has a descriptive **Alt text**.

## Uploading Images
- Upload WebP or AVIF images when possible to save bandwidth.
- **IMPORTANT**: Every image uploaded MUST have descriptive alt text to meet accessibility (WCAG 2.2) standards.
- Do not upload excessively large images (> 2MB).

## Events and Expiry
- All events must have a Start Date and an End Date.
- The frontend will automatically hide or label events as "Expired" once the End Date has passed.

## Sponsored Content Labels
- Sponsored articles or consultancy profiles must have their sponsored toggle turned ON.
- The frontend will automatically display a "Sponsored" badge next to these items to comply with editorial policies.

## Publishing Workflow
- Drafts are saved automatically in Sanity.
- When ready, click **Publish**. This will trigger a webhook to Cloudflare Pages, rebuilding the static site within 1-2 minutes.
