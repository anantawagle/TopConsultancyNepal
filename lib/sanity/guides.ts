import { defineQuery } from 'next-sanity'
import { countries, locations, tests, type Guide } from '@/lib/content/guides'
import { client } from './client'
import { isSanityConfigured } from './config'

export type GuideType = 'destination' | 'test' | 'location'

const fallbackByType: Record<GuideType, Guide[]> = {
  destination: countries,
  test: tests,
  location: locations,
}

export const guidesQuery = defineQuery(/* groq */ `
  *[_type == "guide" && guideType == $guideType && defined(slug.current)]
    | order(name asc) {
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
  *[_type == "guide" && guideType == $guideType && slug.current == $slug][0] {
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
  const fallback = fallbackByType[guideType]
  if (!isSanityConfigured) return fallback
  const cmsGuides = await client.fetch<Guide[]>(guidesQuery, { guideType }).catch(() => [])
  const cmsSlugs = new Set(cmsGuides.map(({ slug }) => slug))
  return [...cmsGuides, ...fallback.filter(({ slug }) => !cmsSlugs.has(slug))]
}

export async function getGuide(guideType: GuideType, slug: string): Promise<Guide | null> {
  const fallback = fallbackByType[guideType].find((guide) => guide.slug === slug) ?? null
  if (!isSanityConfigured) return fallback
  return client.fetch<Guide | null>(guideQuery, { guideType, slug }).then((guide) => guide ?? fallback).catch(() => fallback)
}

export async function getGuideSlugs(guideType: GuideType): Promise<{ slug: string }[]> {
  const fallback = fallbackByType[guideType].map(({ slug }) => ({ slug }))
  if (!isSanityConfigured) return fallback
  const cmsSlugs = await client.fetch<{ slug: string }[]>(guideSlugsQuery, { guideType }).catch(() => [])
  const seen = new Set(cmsSlugs.map(({ slug }) => slug))
  return [...cmsSlugs, ...fallback.filter(({ slug }) => !seen.has(slug))]
}
