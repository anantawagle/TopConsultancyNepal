
# Hardcoded content to Sanity

This migration snapshots the structured records currently embedded in the repository and converts them to Sanity NDJSON.

## Included

- Site settings singleton
- 5 destination guides
- 4 test-preparation guides
- 4 location guides
- 8 reference consultancy profiles
- 3 homepage fallback highlights, including Sanity asset-import directives

The existing source records remain as frontend fallbacks until the imported documents have been reviewed. Existing route slugs are preserved, so no redirects are required.

## Generate and review

```powershell
npm run cms:prepare-import
Get-Content migration/generated/report.json
```

Review `migration/generated/current-content.ndjson` before any dataset write.

## Import checkpoint

The target is project `aajhi08k`, dataset `production`. Importing writes documents and uploads the three remote homepage images into Sanity. Authenticate the Sanity CLI, then run:

```powershell
npx sanity dataset import migration/generated/current-content.ndjson --dataset production --project-id aajhi08k --replace
```

After import, open `/studio`, review the migrated documents, publish any editorial corrections, and run the production build. The migration is idempotent because imported source documents have stable IDs.

## Validation

Expected counts are recorded in `migration/generated/report.json`. Verify document counts, all guide slugs, image assets, and the `/study`, `/test-preparation`, and `/consultancies` routes before removing any code fallbacks.
