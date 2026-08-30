import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GuidePage } from '@/components/content/GuidePage'
import { findGuide, tests } from '@/lib/content/guides'
export const dynamicParams = false
export function generateStaticParams() { return tests.map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const guide = findGuide(tests, (await params).slug); return guide ? { title: `${guide.name} Preparation`, description: guide.summary } : {} }
export default async function TestPage({ params }: { params: Promise<{ slug: string }> }) { const guide = findGuide(tests, (await params).slug); if (!guide) notFound(); return <GuidePage guide={guide} backHref="/test-preparation" backLabel="All test preparation" topicPrefix="test" /> }
