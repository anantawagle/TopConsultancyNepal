export const dynamic = 'force-dynamic';
import type { Metadata } from 'next'
import { GuideIndex } from '@/components/content/GuideIndex'
import { getGuides } from '@/lib/sanity/guides'
export const metadata: Metadata = { title: 'Study Destinations', description: 'Compare popular study destinations for Nepalese students.' }
export default async function StudyDestinationsPage() { const guides = await getGuides('destination'); return <GuideIndex title="Study Destinations" description="Compare popular countries for Nepalese students, including study options, typical intakes and practical planning considerations." baseHref="/study" guides={guides} /> }
