import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'
import { isSanityConfigured } from '@/lib/sanity/config'
import { consultancySlugsQuery } from '@/lib/sanity/consultancies'
import { eventSlugsQuery } from '@/lib/sanity/events'
import { guideSlugsQuery } from '@/lib/sanity/guides'
import { defineQuery } from 'next-sanity'

const postSlugsQuery = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] { 
    "slug": slug.current,
    "lastModified": _updatedAt
  }
`)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://topconsultancynepal.com'
  
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/editorial-policy',
    '/privacy-policy',
    '/terms',
    '/consultancies',
    '/events',
    '/study',
    '/test-preparation',
    '/locations',
    '/scholarships',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  if (!isSanityConfigured) {
    return staticRoutes
  }

  // Fetch dynamic routes
  const [
    consultancies,
    events,
    destinations,
    tests,
    locations,
    posts
  ] = await Promise.all([
    client.fetch<{ slug: string }[]>(consultancySlugsQuery, {}, { cache: 'no-store' }).catch(() => []),
    client.fetch<{ slug: string }[]>(eventSlugsQuery, {}, { cache: 'no-store' }).catch(() => []),
    client.fetch<{ slug: string }[]>(guideSlugsQuery, { guideType: 'destination' }, { cache: 'no-store' }).catch(() => []),
    client.fetch<{ slug: string }[]>(guideSlugsQuery, { guideType: 'test' }, { cache: 'no-store' }).catch(() => []),
    client.fetch<{ slug: string }[]>(guideSlugsQuery, { guideType: 'location' }, { cache: 'no-store' }).catch(() => []),
    client.fetch<{ slug: string, lastModified: string }[]>(postSlugsQuery, {}, { cache: 'no-store' }).catch(() => [])
  ])

  const dynamicRoutes = [
    ...consultancies.map((c) => ({
      url: `${baseUrl}/consultancies/${c.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...events.map((e) => ({
      url: `${baseUrl}/events/${e.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
    ...destinations.map((d) => ({
      url: `${baseUrl}/study/${d.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...tests.map((t) => ({
      url: `${baseUrl}/test-preparation/${t.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...locations.map((l) => ({
      url: `${baseUrl}/locations/${l.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.lastModified || new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]

  return [...staticRoutes, ...dynamicRoutes]
}
