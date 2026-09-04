import { client } from '@/lib/sanity/client'
import { isSanityConfigured } from '@/lib/sanity/config'
import { consultancySlugsQuery } from '@/lib/sanity/consultancies'
import { eventSlugsQuery } from '@/lib/sanity/events'
import { guideSlugsQuery } from '@/lib/sanity/guides'
import { defineQuery } from 'next-sanity'

export const dynamic = 'force-static'

const postSlugsQuery = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] { 
    "slug": slug.current,
    "title": title,
    "excerpt": excerpt
  }
`)

const consultancyNamesQuery = defineQuery(/* groq */ `
  *[_type == "consultancy" && defined(slug.current) && coalesce(listingStatus, "active") == "active"] {
    "slug": slug.current,
    "name": name,
    "shortDescription": shortDescription
  }
`)

const eventTitlesQuery = defineQuery(/* groq */ `
  *[_type == "event" && defined(slug.current) && endDate >= now() && coalesce(listingStatus, "active") == "active"] {
    "slug": slug.current,
    "title": title,
    "summary": summary
  }
`)

const guideTitlesQuery = defineQuery(/* groq */ `
  *[_type == "guide" && guideType == $guideType && defined(slug.current)] {
    "slug": slug.current,
    "name": name,
    "summary": summary
  }
`)

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://topconsultancynepal.com'

  let content = `# Top Consultancy Nepal
Welcome to Top Consultancy Nepal. We are the premier platform for students in Nepal looking for educational consultancies, study destinations, test preparation guides, and study abroad events.

## Key Sections
- [Home](${baseUrl}/)
- [Consultancies](${baseUrl}/consultancies)
- [Events](${baseUrl}/events)
- [Study Destinations](${baseUrl}/study)
- [Test Preparation](${baseUrl}/test-preparation)
- [Blog](${baseUrl}/blog)

`

  if (!isSanityConfigured) {
    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  }

  try {
    const [
      consultancies,
      events,
      destinations,
      tests,
      posts
    ] = await Promise.all([
      client.fetch<{ slug: string, name: string, shortDescription?: string }[]>(consultancyNamesQuery, {}, { cache: 'no-store' }),
      client.fetch<{ slug: string, title: string, summary?: string }[]>(eventTitlesQuery, {}, { cache: 'no-store' }),
      client.fetch<{ slug: string, name: string, summary?: string }[]>(guideTitlesQuery, { guideType: 'destination' }, { cache: 'no-store' }),
      client.fetch<{ slug: string, name: string, summary?: string }[]>(guideTitlesQuery, { guideType: 'test' }, { cache: 'no-store' }),
      client.fetch<{ slug: string, title: string, excerpt?: string }[]>(postSlugsQuery, {}, { cache: 'no-store' })
    ])

    content += `## Top Consultancies\n`
    consultancies.slice(0, 50).forEach(c => {
      content += `- [${c.name}](${baseUrl}/consultancies/${c.slug})${c.shortDescription ? `: ${c.shortDescription}` : ''}\n`
    })

    if (events.length > 0) {
      content += `\n## Upcoming Events\n`
      events.slice(0, 20).forEach(e => {
        content += `- [${e.title}](${baseUrl}/events/${e.slug})${e.summary ? `: ${e.summary}` : ''}\n`
      })
    }

    if (destinations.length > 0) {
      content += `\n## Study Destinations\n`
      destinations.forEach(d => {
        content += `- [${d.name}](${baseUrl}/study/${d.slug})${d.summary ? `: ${d.summary}` : ''}\n`
      })
    }

    if (tests.length > 0) {
      content += `\n## Test Preparation\n`
      tests.forEach(t => {
        content += `- [${t.name}](${baseUrl}/test-preparation/${t.slug})${t.summary ? `: ${t.summary}` : ''}\n`
      })
    }

    if (posts.length > 0) {
      content += `\n## Latest Blog Posts\n`
      posts.slice(0, 20).forEach(p => {
        content += `- [${p.title}](${baseUrl}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ''}\n`
      })
    }

  } catch (error) {
    console.error('Error generating llms.txt content:', error)
  }

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
