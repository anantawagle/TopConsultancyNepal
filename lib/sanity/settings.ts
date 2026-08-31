import { defineQuery } from 'next-sanity'
import { cache } from 'react'
import { client } from './client'
import { isSanityConfigured } from './config'

export type SiteSettings = {
  siteName?: string
  tagline?: string
  defaultSeoTitle?: string
  defaultSeoDescription?: string
  contactEmail?: string
  contactPhone?: string
  logo?: { url: string; alt?: string }
}

export const siteSettingsQuery = defineQuery(/* groq */ `
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    siteName,
    tagline,
    defaultSeoTitle,
    defaultSeoDescription,
    contactEmail,
    contactPhone,
    "logo": logo.asset->{ "url": url, "alt": ^.alt }
  }
`)

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  if (!isSanityConfigured) return null
  return client.fetch<SiteSettings | null>(siteSettingsQuery, {}, { cache: 'no-store' }).catch(() => null)
})
