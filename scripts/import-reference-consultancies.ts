import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-30' })
const sourceUrl = 'https://www.nepaliconsultancy.com/'

type ImportConsultancy = {
  name: string
  slug: string
  address: string
  contactPhone?: string
  contactEmail?: string
  website?: string
  destinations?: string[]
  testPreparation?: string[]
}

const consultancies: ImportConsultancy[] = [
  { name: 'Goreto Educational Consultancy', slug: 'goreto-educational-consultancy', address: 'Kathmandu, Nepal', destinations: ['Australia', 'Canada', 'United Kingdom', 'United States', 'New Zealand'], testPreparation: ['IELTS', 'PTE Academic', 'TOEFL iBT', 'SAT'] },
  { name: 'Expert Education & Visa Services', slug: 'expert-education-visa-services', address: 'The Glass House, opposite NMB Bank, Kathmandu', contactPhone: '01-4016984', destinations: ['Australia', 'United States'] },
  { name: 'Kangaroo Education Foundation', slug: 'kangaroo-education-foundation', address: '5th Floor, AB Complex, Putalisadak, Kathmandu', contactPhone: '01-5333088', destinations: ['Australia'], testPreparation: ['GRE'] },
  { name: 'Oli & Associates', slug: 'oli-associates', address: 'Star Mall, 3rd Floor, Putalisadak, Kathmandu', contactPhone: '01-4012500', destinations: ['Australia', 'Canada', 'New Zealand'], testPreparation: ['IELTS', 'PTE Academic', 'TOEFL iBT'] },
  { name: 'Alfa Beta', slug: 'alfa-beta', address: 'New Baneshwor, Kathmandu', contactPhone: '01-5970123', contactEmail: 'info@alfabetaedu.com', website: 'https://www.alfabetaedu.com/', destinations: ['Australia', 'United States', 'New Zealand', 'United Kingdom', 'Canada'], testPreparation: ['IELTS', 'TOEFL iBT', 'PTE Academic', 'SAT'] },
  { name: 'KIEC', slug: 'kiec', address: 'Opposite Nepal Bank Limited, Kalanki, Kathmandu', contactPhone: '01-5234892', testPreparation: ['IELTS', 'PTE Academic', 'SAT', 'TOEFL iBT', 'GRE'] },
  { name: 'The Next Education', slug: 'the-next-education', address: 'Dillibazar, Kathmandu', contactPhone: '01-5333088', destinations: ['Australia', 'Canada', 'United States'], testPreparation: ['IELTS', 'PTE Academic'] },
  { name: 'Education Planet', slug: 'education-planet', address: 'Bagbazar, Kathmandu', contactPhone: '01-4239656/57', destinations: ['Australia', 'Canada', 'United States'], testPreparation: ['IELTS', 'TOEFL iBT', 'GMAT'] },
]

async function run() {
  for (const [index, item] of consultancies.entries()) {
    const existing = await client.fetch<{ _id: string } | null>(
      '*[_type == "consultancy" && slug.current == $slug][0]{_id}',
      { slug: item.slug },
    )
    if (existing) {
      console.log(`Skipped existing: ${item.name}`)
      continue
    }
    await client.create({
      _type: 'consultancy',
      ...item,
      destinations: item.destinations ?? [],
      testPreparation: item.testPreparation ?? [],
      slug: { _type: 'slug', current: item.slug },
      city: 'Kathmandu',
      shortDescription: `${item.name} is an education consultancy in Kathmandu. This imported listing includes publicly available contact and service information and awaits independent editorial verification.`,
      services: ['Career counselling', 'Course and university selection', 'Application assistance', 'Visa guidance'],
      listingStatus: 'active',
      isVerified: false,
      isSponsored: false,
      featuredRank: index + 1,
      sourceUrl,
      sourceReviewedAt: '2026-08-30',
    })
    console.log(`Created: ${item.name}`)
  }
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
