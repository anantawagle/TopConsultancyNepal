import type { Metadata } from 'next'
import { GuideIndex } from '@/components/content/GuideIndex'
import { tests } from '@/lib/content/guides'
export const metadata: Metadata = { title: 'Test Preparation', description: 'Explore IELTS, PTE, TOEFL and SAT preparation guides.' }
export default function TestPreparationPage() { return <GuideIndex title="Test Preparation" description="Understand each test, build a realistic study plan and find preparation advice for your target score." baseHref="/test-preparation" guides={tests} /> }
