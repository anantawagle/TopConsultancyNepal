import { defineQuery } from 'next-sanity'
import { isSanityConfigured } from './config'

export type ConsultancyCard = {
  _id: string
  name: string
  slug: string
  shortDescription?: string
  city?: string
  isVerified?: boolean
  isSponsored?: boolean
  logo?: { url: string; alt?: string }
  destinations?: string[]
  testPreparation?: string[]
}

export type PortableTextBlock = { _key: string; _type: string; style?: string; listItem?: string; children?: { _key: string; text: string; marks?: string[] }[] }
export type Consultancy = ConsultancyCard & {
  coverImage?: { url: string; alt?: string }
  details?: PortableTextBlock[]
  establishedYear?: number
  services?: string[]
  testPreparation?: string[]
  accreditations?: string[]
  contactEmail?: string
  contactPhone?: string
  address?: string
  website?: string
  googleMapsUrl?: string
  lastVerifiedDate?: string
  branches?: { _key: string; name: string; address: string; phone?: string; email?: string }[]
  seo?: { title?: string; description?: string }
}

export const referenceConsultancies: Consultancy[] = [
  { _id: 'reference-goreto', name: 'Goreto Educational Consultancy', slug: 'goreto-educational-consultancy', city: 'Kathmandu', address: 'Kathmandu, Nepal', destinations: ['Australia', 'Canada', 'United Kingdom', 'United States', 'New Zealand'], testPreparation: ['IELTS', 'PTE Academic', 'TOEFL iBT', 'SAT'], services: ['Career counselling', 'Course and university selection', 'Application assistance', 'Visa guidance', 'Test preparation'], shortDescription: 'Goreto Educational Consultancy supports students with study-abroad counselling, applications, visa guidance and preparation for major English-language and admission tests.' },
  { _id: 'reference-expert', name: 'Expert Education & Visa Services', slug: 'expert-education-visa-services', city: 'Kathmandu', address: 'The Glass House, opposite NMB Bank, Kathmandu', contactPhone: '01-4016984', destinations: ['Australia', 'United States'], services: ['Career counselling', 'Course and university selection', 'Application assistance', 'Visa guidance'], shortDescription: 'Education consultancy in Kathmandu with publicly listed study-abroad counselling and application services. Contact and service details await independent editorial verification.' },
  { _id: 'reference-kangaroo', name: 'Kangaroo Education Foundation', slug: 'kangaroo-education-foundation', city: 'Kathmandu', address: '5th Floor, AB Complex, Putalisadak, Kathmandu', contactPhone: '01-5333088', destinations: ['Australia'], testPreparation: ['GRE'], services: ['Career counselling', 'Course and university selection', 'Application assistance', 'Visa guidance'], shortDescription: 'Education consultancy in Putalisadak with publicly listed counselling and test-preparation services. Contact and service details await independent editorial verification.' },
  { _id: 'reference-oli', name: 'Oli & Associates', slug: 'oli-associates', city: 'Kathmandu', address: 'Star Mall, 3rd Floor, Putalisadak, Kathmandu', contactPhone: '01-4012500', destinations: ['Australia', 'Canada', 'New Zealand'], testPreparation: ['IELTS', 'PTE Academic', 'TOEFL iBT'], services: ['Career counselling', 'Course and university selection', 'Application assistance', 'Visa guidance'], shortDescription: 'Education consultancy in Putalisadak with publicly listed destination and language-test support. Contact and service details await independent editorial verification.' },
  { _id: 'reference-alfa-beta', name: 'Alfa Beta', slug: 'alfa-beta', city: 'Kathmandu', address: 'New Baneshwor, Kathmandu', contactPhone: '01-5970123', contactEmail: 'info@alfabetaedu.com', website: 'https://www.alfabetaedu.com/', destinations: ['Australia', 'United States', 'New Zealand', 'United Kingdom', 'Canada'], testPreparation: ['IELTS', 'TOEFL iBT', 'PTE Academic', 'SAT'], services: ['Career counselling', 'Course and university selection', 'Application assistance', 'Visa guidance'], shortDescription: 'Education consultancy in New Baneshwor with publicly listed destination and test-preparation services. Contact and service details await independent editorial verification.' },
  { _id: 'reference-kiec', name: 'KIEC', slug: 'kiec', city: 'Kathmandu', address: 'Opposite Nepal Bank Limited, Kalanki, Kathmandu', contactPhone: '01-5234892', testPreparation: ['IELTS', 'PTE Academic', 'SAT', 'TOEFL iBT', 'GRE'], services: ['Career counselling', 'Course and university selection', 'Application assistance', 'Visa guidance'], shortDescription: 'Education consultancy in Kalanki with publicly listed counselling and test-preparation services. Contact and service details await independent editorial verification.' },
  { _id: 'reference-next', name: 'The Next Education', slug: 'the-next-education', city: 'Kathmandu', address: 'Dillibazar, Kathmandu', contactPhone: '01-5333088', destinations: ['Australia', 'Canada', 'United States'], testPreparation: ['IELTS', 'PTE Academic'], services: ['Career counselling', 'Course and university selection', 'Application assistance', 'Visa guidance'], shortDescription: 'Education consultancy in Dillibazar with publicly listed destination and test-preparation support. Contact and service details await independent editorial verification.' },
  { _id: 'reference-education-planet', name: 'Education Planet', slug: 'education-planet', city: 'Kathmandu', address: 'Bagbazar, Kathmandu', contactPhone: '01-4239656/57', destinations: ['Australia', 'Canada', 'United States'], testPreparation: ['IELTS', 'TOEFL iBT', 'GMAT'], services: ['Career counselling', 'Course and university selection', 'Application assistance', 'Visa guidance'], shortDescription: 'Education consultancy in Bagbazar with publicly listed destination and test-preparation services. Contact and service details await independent editorial verification.' },
]

const consultancySlugAliases: Record<string, string> = {
  'goreto-consultancy': 'goreto-educational-consultancy',
  'goreto-educational-cosnultancy': 'goreto-educational-consultancy',
}

export const referenceConsultancySlugs = [
  ...referenceConsultancies.map(({ slug }) => ({ slug })),
  ...Object.keys(consultancySlugAliases).map((slug) => ({ slug })),
]

export const consultanciesQuery = defineQuery(/* groq */ `
  *[_type == "consultancy" && defined(slug.current) && coalesce(listingStatus, "active") == "active"]
    | order(_updatedAt desc, isSponsored desc, featuredRank asc, name asc) {
      _id, name, "slug": slug.current, shortDescription, city,
      isVerified, isSponsored, destinations, testPreparation,
      "logo": logo.asset->{ "url": url, "alt": ^.alt }
    }
`)

export const consultancySlugsQuery = defineQuery(/* groq */ `
  *[_type == "consultancy" && defined(slug.current) && coalesce(listingStatus, "active") == "active"] {
    "slug": slug.current
  }
`)

export const consultancyQuery = defineQuery(/* groq */ `
  *[_type == "consultancy" && slug.current == $slug && coalesce(listingStatus, "active") == "active"]
    | order(_updatedAt desc)[0] {
    _id, name, "slug": slug.current, shortDescription, city,
    isVerified, isSponsored, establishedYear, details,
    services, destinations, testPreparation, accreditations,
    contactEmail, contactPhone, address, website, googleMapsUrl,
    lastVerifiedDate, seo,
    "logo": logo.asset->{ "url": url, "alt": ^.alt },
    "coverImage": coverImage.asset->{ "url": url, "alt": ^.alt },
    branches[]{ _key, name, address, phone, email }
  }
`)

export async function getConsultancies(): Promise<ConsultancyCard[]> {
  if (!isSanityConfigured) return referenceConsultancies
  const { client } = await import('./client')
  const cmsItems = await client.fetch<ConsultancyCard[]>(consultanciesQuery, {}, { cache: 'no-store' }).catch((error) => {
    console.error('[Sanity] Failed to load consultancies', error)
    return []
  })
  const cmsSlugs = new Set(cmsItems.map(({ slug }) => slug))
  return [...cmsItems, ...referenceConsultancies.filter(({ slug }) => !cmsSlugs.has(slug))]
    .sort((a, b) => Number(b.slug === 'goreto-educational-consultancy') - Number(a.slug === 'goreto-educational-consultancy'))
}

export async function getConsultancy(slug: string): Promise<Consultancy | null> {
  const resolvedSlug = consultancySlugAliases[slug] ?? slug
  const fallback = referenceConsultancies.find((item) => item.slug === resolvedSlug) ?? null
  if (!isSanityConfigured) return fallback
  const { client } = await import('./client')
  return client.fetch<Consultancy | null>(consultancyQuery, { slug: resolvedSlug }, { cache: 'no-store' }).then((item) => item ?? fallback).catch((error) => {
    console.error(`[Sanity] Failed to load consultancy: ${resolvedSlug}`, error)
    return fallback
  })
}
