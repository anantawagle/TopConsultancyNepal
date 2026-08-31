import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GuidePage } from '@/components/content/GuidePage'
import { getGuide, getGuideSlugs } from '@/lib/sanity/guides'
export const dynamicParams = false
export function generateStaticParams() { return getGuideSlugs('test') }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const guide = await getGuide('test', (await params).slug); return guide ? { title: guide.seo?.title || `${guide.name} Preparation`, description: guide.seo?.description || guide.summary } : {} }
export default async function TestPage({ params }: { params: Promise<{ slug: string }> }) { const guide = await getGuide('test', (await params).slug); if (!guide) notFound(); return <GuidePage guide={guide} backHref="/test-preparation" backLabel="All test preparation" topicPrefix="test" /> }
