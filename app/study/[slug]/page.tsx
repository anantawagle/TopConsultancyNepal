import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GuidePage } from '@/components/content/GuidePage'
import { countries, findGuide } from '@/lib/content/guides'
export const dynamicParams = false
export function generateStaticParams() { return countries.map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const guide = findGuide(countries, (await params).slug); return guide ? { title: `Study in ${guide.name}`, description: guide.summary } : {} }
export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) { const guide = findGuide(countries, (await params).slug); if (!guide) notFound(); return <GuidePage guide={guide} backHref="/study" backLabel="All study destinations" topicPrefix="country" /> }
