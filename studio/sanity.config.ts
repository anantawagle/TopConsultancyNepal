import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { deskStructure } from './structure/deskStructure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  
  title: 'Top Consultancy Nepal',

  plugins: [
    structureTool({
      structure: deskStructure
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
