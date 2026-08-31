import { defineQuery } from 'next-sanity'
import type { PortableTextBlock } from './consultancies'
import { isSanityConfigured } from './config'

export type EventCard = {
  _id: string
  title: string
  slug: string
  summary: string
  startDate: string
  endDate: string
  eventFormat: 'inPerson' | 'online' | 'hybrid'
  venueName?: string
  city?: string
  featured?: boolean
  image?: { url: string; alt?: string }
}

export type Event = EventCard & {
  details?: PortableTextBlock[]
  address?: string
  onlineUrl?: string
  registrationUrl?: string
  registrationDeadline?: string
  contactEmail?: string
  price?: string
  organizer?: { name: string; slug: string; logo?: { url: string; alt?: string } }
  seo?: { title?: string; description?: string }
}

export const upcomingEventsQuery = defineQuery(/* groq */ `
  *[_type == "event" && defined(slug.current) && defined(startDate) && endDate >= now() && coalesce(listingStatus, "active") == "active"]
    | order(featured desc, startDate asc, _id asc) {
      _id, title, "slug": slug.current, summary, startDate, endDate,
      eventFormat, venueName, city, featured,
      "image": image.asset->{ "url": url, "alt": ^.alt }
    }
`)

export const eventSlugsQuery = defineQuery(/* groq */ `
  *[_type == "event" && defined(slug.current) && endDate >= now() && coalesce(listingStatus, "active") == "active"] { "slug": slug.current }
`)

export const eventQuery = defineQuery(/* groq */ `
  *[_type == "event" && slug.current == $slug && coalesce(listingStatus, "active") == "active"][0] {
    _id, title, "slug": slug.current, summary, startDate, endDate, details,
    eventFormat, venueName, address, city, onlineUrl, registrationUrl,
    registrationDeadline, contactEmail, price, featured, seo,
    "image": image.asset->{ "url": url, "alt": ^.alt },
    coalesce(organizer->listingStatus, "active") == "active" => {
      "organizer": organizer->{ name, "slug": slug.current, "logo": logo.asset->{ "url": url, "alt": ^.alt } }
    }
  }
`)

export async function getUpcomingEvents(): Promise<EventCard[]> { if (!isSanityConfigured) return []; const { client } = await import('./client'); return client.fetch<EventCard[]>(upcomingEventsQuery).catch(() => []) }
export async function getEvent(slug: string): Promise<Event | null> { if (!isSanityConfigured) return null; const { client } = await import('./client'); return client.fetch<Event | null>(eventQuery, { slug }).catch(() => null) }
