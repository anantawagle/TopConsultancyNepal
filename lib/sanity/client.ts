import { createClient } from 'next-sanity'
import { sanityConfig } from './config'

export const client = createClient({
  ...sanityConfig,
  useCdn: false, // Read the freshest published content for server rendering/ISR
})
