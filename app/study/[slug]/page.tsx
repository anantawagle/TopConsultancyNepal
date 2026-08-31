import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GuidePage } from '@/components/content/GuidePage'
import { getGuide, getGuideSlugs } from '@/lib/sanity/guides'
export const dynamicParams = false
export function generateStaticParams() { return getGuideSlugs('destination') }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const guide = await getGuide('destination', (await params).slug); return guide ? { title: guide.seo?.title || `Study in ${guide.name}`, description: guide.seo?.description || guide.summary } : {} }
export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) { const guide = await getGuide('destination', (await params).slug); if (!guide) notFound(); return <GuidePage guide={guide} backHref="/study" backLabel="All study destinations" topicPrefix="country" /> }
