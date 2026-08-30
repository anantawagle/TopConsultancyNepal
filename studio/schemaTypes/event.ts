import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    { name: 'details', title: 'Event details', default: true },
    { name: 'venue', title: 'Venue & registration' },
    { name: 'publishing', title: 'Publishing & SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Event title', type: 'string', group: 'details', validation: (rule) => rule.required().max(120) }),
    defineField({ name: 'slug', title: 'Page URL', type: 'slug', group: 'details', description: 'Click Generate after entering the title.', options: { source: 'title', maxLength: 96 }, validation: (rule) => rule.required().custom((slug) => !slug?.current || /^[a-z0-9-]+$/.test(slug.current) || 'Use lowercase letters, numbers and hyphens only') }),
    defineField({ name: 'summary', title: 'Short summary', type: 'text', rows: 4, group: 'details', description: 'Used on the event card and at the top of the event page.', validation: (rule) => rule.required().min(40).max(300) }),
    defineField({ name: 'image', title: 'Event image', type: 'image', group: 'details', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: (rule) => rule.max(120) })] }),
    defineField({ name: 'startDate', title: 'Start date and time', type: 'datetime', group: 'details', validation: (rule) => rule.required() }),
    defineField({ name: 'endDate', title: 'End date and time', type: 'datetime', group: 'details', validation: (rule) => rule.required().custom((endDate, context) => { const startDate = context.document?.startDate; return !startDate || !endDate || new Date(endDate) >= new Date(startDate as string) || 'End time must be after the start time' }) }),
    defineField({ name: 'details', title: 'Full event description', type: 'blockContent', group: 'details' }),
    defineField({ name: 'organizer', title: 'Organized by', type: 'reference', group: 'details', to: [{ type: 'consultancy' }], description: 'Optional: connect this event to a consultancy profile.' }),

    defineField({ name: 'eventFormat', title: 'Event format', type: 'string', group: 'venue', initialValue: 'inPerson', options: { layout: 'radio', list: [{ title: 'In person', value: 'inPerson' }, { title: 'Online', value: 'online' }, { title: 'Hybrid', value: 'hybrid' }] }, validation: (rule) => rule.required() }),
    defineField({ name: 'venueName', title: 'Venue name', type: 'string', group: 'venue', hidden: ({ parent }) => parent?.eventFormat === 'online' }),
    defineField({ name: 'address', title: 'Venue address', type: 'string', group: 'venue', hidden: ({ parent }) => parent?.eventFormat === 'online' }),
    defineField({ name: 'city', title: 'City', type: 'string', group: 'venue', hidden: ({ parent }) => parent?.eventFormat === 'online' }),
    defineField({ name: 'onlineUrl', title: 'Online event link', type: 'url', group: 'venue', hidden: ({ parent }) => parent?.eventFormat === 'inPerson', validation: (rule) => rule.uri({ scheme: ['http', 'https'] }) }),
    defineField({ name: 'registrationUrl', title: 'Registration link', type: 'url', group: 'venue', validation: (rule) => rule.uri({ scheme: ['http', 'https'] }) }),
    defineField({ name: 'registrationDeadline', title: 'Registration deadline', type: 'datetime', group: 'venue' }),
    defineField({ name: 'contactEmail', title: 'Event contact email', type: 'string', group: 'venue', validation: (rule) => rule.email() }),
    defineField({ name: 'price', title: 'Admission information', type: 'string', group: 'venue', description: 'For example: Free, NPR 500, or Invitation only.' }),

    defineField({ name: 'listingStatus', title: 'Listing status', type: 'string', group: 'publishing', initialValue: 'active', options: { layout: 'radio', list: [{ title: 'Active — show publicly', value: 'active' }, { title: 'Hidden', value: 'hidden' }, { title: 'Cancelled', value: 'cancelled' }] }, validation: (rule) => rule.required() }),
    defineField({ name: 'featured', title: 'Featured event', type: 'boolean', group: 'publishing', initialValue: false }),
    defineField({ name: 'seo', title: 'Search appearance', type: 'object', group: 'publishing', fields: [defineField({ name: 'title', title: 'SEO title', type: 'string', validation: (rule) => rule.max(60).warning('Keep titles under 60 characters') }), defineField({ name: 'description', title: 'SEO description', type: 'text', rows: 3, validation: (rule) => rule.max(160).warning('Keep descriptions under 160 characters') })] }),
  ],
  orderings: [{ title: 'Event date', name: 'eventDate', by: [{ field: 'startDate', direction: 'asc' }] }],
  preview: { select: { title: 'title', startDate: 'startDate', city: 'city', format: 'eventFormat', media: 'image', status: 'listingStatus' }, prepare({ title, startDate, city, format, media, status }) { const date = startDate ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(startDate)) : 'Date not set'; return { title, media, subtitle: [date, format === 'online' ? 'Online' : city, status === 'cancelled' ? 'Cancelled' : undefined].filter(Boolean).join(' · ') } } },
})
