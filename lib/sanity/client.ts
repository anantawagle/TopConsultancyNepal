import { createClient } from 'next-sanity'
import { sanityConfig } from './config'

export const client = createClient({
  ...sanityConfig,
  useCdn: false, // We're generating a static site, so we fetch fresh at build time
})
