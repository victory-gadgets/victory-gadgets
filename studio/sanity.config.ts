import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {marketOptions} from './lib/listingOptions'
import {schemaTypes} from './schemaTypes'
import {inventoryStructure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

if (!projectId) {
  throw new Error(
    'Missing SANITY_STUDIO_PROJECT_ID. Copy .env.example to .env.local and add your Sanity project ID.',
  )
}

export default defineConfig({
  name: 'default',
  title: 'Victory Gadgets',
  projectId,
  dataset,
  plugins: [
    structureTool({structure: inventoryStructure}),
    visionTool({defaultApiVersion: '2026-01-01'}),
  ],
  schema: {
    types: schemaTypes,
    templates: marketOptions.map((market) => ({
      id: `product-listing-${market.value.toLowerCase()}`,
      title: `${market.title} product listing`,
      schemaType: 'productListing',
      value: {
        market: market.value,
        status: 'inStock',
        quantity: 1,
        isActive: false,
        archived: false,
      },
    })),
  },
})
