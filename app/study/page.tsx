import type { Metadata } from 'next'
import { GuideIndex } from '@/components/content/GuideIndex'
import { countries } from '@/lib/content/guides'
export const metadata: Metadata = { title: 'Study Destinations', description: 'Compare popular study destinations for Nepalese students.' }
export default function StudyDestinationsPage() { return <GuideIndex title="Study Destinations" description="Compare popular countries for Nepalese students, including study options, typical intakes and practical planning considerations." baseHref="/study" guides={countries} /> }
