import { defineQuery } from 'next-sanity'
import type { Guide } from '@/lib/content/guides'
import { client } from './client'
import { isSanityConfigured } from './config'

export type GuideType = 'destination' | 'test' | 'location'

export const guidesQuery = defineQuery(/* groq */ `
  *[_type == "guide" && guideType == $guideType && defined(slug.current)]
    | order(_updatedAt desc, name asc) {
      name,
      "slug": slug.current,
      eyebrow,
      summary,
      introduction,
      facts[]{ _key, label, value },
      highlights[]{ _key, title, description },
      seo
    }
`)

export const guideQuery = defineQuery(/* groq */ `
  *[_type == "guide" && guideType == $guideType && slug.current == $slug]
    | order(_updatedAt desc)[0] {
    name,
    "slug": slug.current,
    eyebrow,
    summary,
    introduction,
    facts[]{ _key, label, value },
    highlights[]{ _key, title, description },
    seo
  }
`)

export const guideSlugsQuery = defineQuery(/* groq */ `
  *[_type == "guide" && guideType == $guideType && defined(slug.current)] { "slug": slug.current }
`)

export async function getGuides(guideType: GuideType): Promise<Guide[]> {
  if (!isSanityConfigured) return []
  const cmsGuides = await client.fetch<Guide[]>(guidesQuery, { guideType }, { cache: 'no-store' }).catch(() => [])
  return cmsGuides
}

export async function getGuide(guideType: GuideType, slug: string): Promise<Guide | null> {
  if (!isSanityConfigured) return null
  return client.fetch<Guide | null>(guideQuery, { guideType, slug }, { cache: 'no-store' }).catch(() => null)
}

export async function getGuideSlugs(guideType: GuideType): Promise<{ slug: string }[]> {
  if (!isSanityConfigured) return []
  const cmsSlugs = await client.fetch<{ slug: string }[]>(guideSlugsQuery, { guideType }, { cache: 'no-store' }).catch(() => [])
  return cmsSlugs
}
