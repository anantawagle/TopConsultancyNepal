import { defineArrayMember, defineField, defineType } from 'sanity'

const destinationOptions = ['Australia', 'Canada', 'United Kingdom', 'United States', 'New Zealand', 'Japan', 'South Korea', 'Europe']
const serviceOptions = ['Career counselling', 'Course and university selection', 'Application assistance', 'Visa guidance', 'Scholarship guidance', 'SOP and documentation', 'Pre-departure briefing', 'Accommodation support']
const testOptions = ['IELTS', 'PTE Academic', 'TOEFL iBT', 'SAT', 'GRE', 'GMAT', 'Duolingo English Test']

export default defineType({
  name: 'consultancy',
  title: 'Consultancy',
  type: 'document',
  groups: [
    { name: 'profile', title: 'Profile', default: true },
    { name: 'services', title: 'Services & destinations' },
    { name: 'contact', title: 'Contact & branches' },
    { name: 'trust', title: 'Trust & listing' },
    { name: 'seo', title: 'SEO' },
    { name: 'migration', title: 'Migration' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Consultancy name', type: 'string', group: 'profile', validation: (rule) => rule.required().max(100) }),
    defineField({ name: 'slug', title: 'Page URL', type: 'slug', group: 'profile', description: 'Click Generate after entering the name.', options: { source: 'name', maxLength: 96 }, validation: (rule) => rule.required().custom((slug) => !slug?.current || /^[a-z0-9-]+$/.test(slug.current) || 'Use lowercase letters, numbers and hyphens only') }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', group: 'profile', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: (rule) => rule.max(120) })] }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', group: 'profile', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: (rule) => rule.max(120) })] }),
    defineField({ name: 'shortDescription', title: 'Summary', type: 'text', rows: 4, group: 'profile', description: 'Shown on directory cards and at the top of the profile.', validation: (rule) => rule.required().min(40).max(300) }),
    defineField({ name: 'details', title: 'About the consultancy', type: 'blockContent', group: 'profile' }),
    defineField({ name: 'establishedYear', title: 'Established year', type: 'number', group: 'profile', validation: (rule) => rule.integer().min(1950).max(new Date().getFullYear()) }),

    defineField({ name: 'services', title: 'Services', type: 'array', group: 'services', of: [defineArrayMember({ type: 'string' })], options: { list: serviceOptions.map((value) => ({ title: value, value })) }, validation: (rule) => rule.unique().min(1).error('Select at least one service') }),
    defineField({ name: 'destinations', title: 'Study destinations', type: 'array', group: 'services', of: [defineArrayMember({ type: 'string' })], options: { list: destinationOptions.map((value) => ({ title: value, value })) }, validation: (rule) => rule.unique() }),
    defineField({ name: 'testPreparation', title: 'Test preparation offered', type: 'array', group: 'services', of: [defineArrayMember({ type: 'string' })], options: { list: testOptions.map((value) => ({ title: value, value })) }, validation: (rule) => rule.unique() }),
    defineField({ name: 'accreditations', title: 'Accreditations and memberships', type: 'array', group: 'services', of: [defineArrayMember({ type: 'string' })], validation: (rule) => rule.unique() }),

    defineField({ name: 'contactEmail', title: 'Public email', type: 'string', group: 'contact', validation: (rule) => rule.email() }),
    defineField({ name: 'contactPhone', title: 'Primary phone', type: 'string', group: 'contact', validation: (rule) => rule.max(30) }),
    defineField({ name: 'address', title: 'Head office address', type: 'string', group: 'contact', validation: (rule) => rule.required() }),
    defineField({ name: 'city', title: 'City', type: 'string', group: 'contact', options: { list: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal', 'Biratnagar', 'Dharan'] }, validation: (rule) => rule.required() }),
    defineField({ name: 'website', title: 'Website', type: 'url', group: 'contact', validation: (rule) => rule.uri({ scheme: ['http', 'https'] }) }),
    defineField({ name: 'googleMapsUrl', title: 'Google Maps link', type: 'url', group: 'contact', validation: (rule) => rule.uri({ scheme: ['http', 'https'] }) }),
    defineField({ name: 'branches', title: 'Additional branches', type: 'array', group: 'contact', of: [defineArrayMember({ type: 'object', name: 'branch', fields: [defineField({ name: 'name', title: 'Branch name', type: 'string', validation: (rule) => rule.required() }), defineField({ name: 'address', title: 'Address', type: 'string', validation: (rule) => rule.required() }), defineField({ name: 'phone', title: 'Phone', type: 'string' }), defineField({ name: 'email', title: 'Email', type: 'string', validation: (rule) => rule.email() })], preview: { select: { title: 'name', subtitle: 'address' } } })] }),

    defineField({ name: 'listingStatus', title: 'Listing status', type: 'string', group: 'trust', initialValue: 'active', options: { list: [{ title: 'Active — show publicly', value: 'active' }, { title: 'Temporarily hidden', value: 'hidden' }, { title: 'Closed', value: 'closed' }], layout: 'radio' }, validation: (rule) => rule.required() }),
    defineField({ name: 'isVerified', title: 'Verified listing', type: 'boolean', group: 'trust', initialValue: false, description: 'Enable only after the editorial team has checked the contact and business details.' }),
    defineField({ name: 'lastVerifiedDate', title: 'Last verified date', type: 'date', group: 'trust', hidden: ({ parent }) => !parent?.isVerified, validation: (rule) => rule.custom((date, context) => context.parent && (context.parent as { isVerified?: boolean }).isVerified && !date ? 'Add the date this listing was verified' : true) }),
    defineField({ name: 'isSponsored', title: 'Sponsored placement', type: 'boolean', group: 'trust', initialValue: false }),
    defineField({ name: 'featuredRank', title: 'Featured order', type: 'number', group: 'trust', description: 'Lower numbers appear first. Leave empty for normal ordering.', validation: (rule) => rule.integer().positive() }),
    defineField({ name: 'sourceUrl', title: 'Information source', type: 'url', group: 'trust', description: 'Internal editorial reference showing where imported facts came from.', validation: (rule) => rule.uri({ scheme: ['http', 'https'] }) }),
    defineField({ name: 'sourceReviewedAt', title: 'Source reviewed on', type: 'date', group: 'trust' }),

    defineField({ name: 'seo', title: 'Search appearance', type: 'object', group: 'seo', fields: [defineField({ name: 'title', title: 'SEO title', type: 'string', validation: (rule) => rule.max(60).warning('Keep titles under 60 characters') }), defineField({ name: 'description', title: 'SEO description', type: 'text', rows: 3, validation: (rule) => rule.max(160).warning('Keep descriptions under 160 characters') })] }),
    defineField({ name: 'sourceId', title: 'Migration source ID', type: 'string', group: 'migration', readOnly: true }),
  ],
  orderings: [{ title: 'Featured first', name: 'featuredFirst', by: [{ field: 'featuredRank', direction: 'asc' }, { field: 'name', direction: 'asc' }] }],
  preview: { select: { title: 'name', city: 'city', media: 'logo', verified: 'isVerified', status: 'listingStatus' }, prepare({ title, city, media, verified, status }) { return { title, media, subtitle: [city, verified ? 'Verified' : undefined, status === 'hidden' ? 'Hidden' : undefined].filter(Boolean).join(' · ') } } },
})
