import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homeHighlight',
  title: 'Home Highlight',
  type: 'document',
  fields: [
    defineField({
      name: 'category', title: 'Category', type: 'string',
      options: {
        list: [
          { title: 'News', value: 'news' }, { title: 'Update', value: 'update' },
          { title: 'Class', value: 'class' }, { title: 'Scholarship', value: 'scholarship' },
          { title: 'Announcement', value: 'announcement' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required().max(90) }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3, validation: (rule) => rule.required().max(220) }),
    defineField({
      name: 'link', title: 'Link', type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Button label', type: 'string', validation: (rule) => rule.max(30) }),
        defineField({
          name: 'url', title: 'URL or site path', type: 'string',
          description: 'Use a site path such as /scholarships or a full https:// URL.',
          validation: (rule) => rule.custom((value) => {
            if (!value) return true
            if (value.startsWith('/')) {
              const allowedPaths = ['/', '/about', '/blog', '/consultancies', '/contact', '/editorial-policy', '/events', '/privacy-policy', '/scholarships', '/study', '/terms', '/test-preparation']
              return allowedPaths.includes(value) || 'Choose an existing top-level site page to avoid broken links'
            }
            try { return new URL(value).protocol === 'https:' || 'Use a site path or an https:// URL' }
            catch { return 'Use a site path or an https:// URL' }
          }),
        }),
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        },
      ],
    }),
    defineField({ name: 'publishedAt', title: 'Publish date', type: 'datetime', initialValue: () => new Date().toISOString(), validation: (rule) => rule.required() }),
    defineField({
      name: 'expiresAt', title: 'Hide after', type: 'datetime',
      description: 'Optional. The item will stop appearing after this date.',
      validation: (rule) => rule.custom((value, context) => {
        const publishedAt = context.document?.publishedAt
        if (!value || !publishedAt) return true
        return new Date(value) > new Date(publishedAt as string) || 'Must be after the publish date'
      }),
    }),
    defineField({ name: 'priority', title: 'Priority', type: 'number', description: 'Higher-priority items appear first.', initialValue: 0, validation: (rule) => rule.integer().min(0).max(100) }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'mainImage' },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle: subtitle ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1) : undefined, media }),
  },
})
