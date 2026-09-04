export const dynamic = 'force-dynamic';
import { AnimatedHero } from '@/components/home/AnimatedHero';
import { BentoGrid } from '@/components/home/BentoGrid';
import { CTASection } from '@/components/home/CTASection';
import { ClientReviews } from '@/components/home/ClientReviews';
import { HomeDiscovery } from '@/components/home/HomeDiscovery';
import { defineQuery } from 'next-sanity';
import { getConsultancies } from '@/lib/sanity/consultancies';
import type { ConsultancyCard } from '@/lib/sanity/consultancies';
import type { Highlight } from '@/components/home/AnimatedHero';
import { isSanityConfigured } from '@/lib/sanity/config';

type HomePost = { 
  _id: string; 
  title: string; 
  slug: string; 
  excerpt?: string;
  publishedAt?: string;
  mainImage?: { url: string; alt?: string };
  author?: { name: string; image?: { url: string; alt?: string } };
};

const highlightsQuery = defineQuery(/* groq */ `*[
  _type == "homeHighlight" && defined(publishedAt) && publishedAt <= now() &&
  (!defined(expiresAt) || expiresAt > now())
] | order(priority desc, publishedAt desc)[0...8] {
  _id, category, title, summary, link,
  mainImage { "url": asset->url, alt }
}`);
const latestPostsQuery = defineQuery(/* groq */ `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc, _id asc)[0...3]{ 
  _id, title, "slug": slug.current, excerpt, publishedAt,
  "mainImage": mainImage.asset->{ "url": url, "alt": ^.alt },
  "author": author->{ name, "image": image.asset->{ "url": url, "alt": ^.alt } }
}`);

export default async function Home() {
  let highlights: Highlight[] = [];
  let consultancies: ConsultancyCard[] = [];
  let posts: HomePost[] = [];
  if (isSanityConfigured) {
    const { client } = await import('@/lib/sanity/client');
    [highlights, consultancies, posts] = await Promise.all([
      client.fetch(highlightsQuery, {}, { cache: 'no-store' }).catch(() => []),
      getConsultancies(),
      client.fetch(latestPostsQuery, {}, { cache: 'no-store' }).catch(() => []),
    ]);
  }

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 w-full relative">
      <AnimatedHero highlights={highlights} />
      <HomeDiscovery consultancies={consultancies} posts={posts} />
      <BentoGrid />
      <ClientReviews />
      <CTASection />
    </main>
  )
}
