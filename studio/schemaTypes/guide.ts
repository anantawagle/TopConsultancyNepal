import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'migration', title: 'Migration' },
  ],
  fields: [
    defineField({
      name: 'guideType',
      title: 'Guide type',
      type: 'string',
      group: 'content',
      options: {
        layout: 'radio',
        list: [
          { title: 'Study destination', value: 'destination' },
          { title: 'Test preparation', value: 'test' },
          { title: 'Consultancy location', value: 'location' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'content', validation: (rule) => rule.required().max(100) }),
    defineField({ name: 'slug', title: 'Page URL', type: 'slug', group: 'content', options: { source: 'name', maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: 'eyebrow', title: 'Section label', type: 'string', group: 'content', validation: (rule) => rule.required().max(50) }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3, group: 'content', validation: (rule) => rule.required().min(40).max(300) }),
    defineField({ name: 'introduction', title: 'Introduction', type: 'text', rows: 6, group: 'content', validation: (rule) => rule.required().min(80) }),
    defineField({
      name: 'facts',
      title: 'Key facts',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({
        type: 'object',
        name: 'fact',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
          defineField({ name: 'value', title: 'Value', type: 'string', validation: (rule) => rule.required() }),
        ],
        preview: { select: { title: 'label', subtitle: 'value' } },
      })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'highlights',
      title: 'Planning highlights',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({
        type: 'object',
        name: 'guideHighlight',
        fields: [
          defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.required() }),
        ],
        preview: { select: { title: 'title', subtitle: 'description' } },
      })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'seo',
      title: 'Search appearance',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({ name: 'title', title: 'SEO title', type: 'string', validation: (rule) => rule.max(60).warning('Keep titles under 60 characters') }),
        defineField({ name: 'description', title: 'SEO description', type: 'text', rows: 3, validation: (rule) => rule.max(160).warning('Keep descriptions under 160 characters') }),
      ],
    }),
    defineField({ name: 'sourceId', title: 'Migration source ID', type: 'string', group: 'migration', readOnly: true }),
    defineField({ name: 'legacyPath', title: 'Original route', type: 'string', group: 'migration', readOnly: true }),
  ],
  orderings: [{ title: 'Type and name', name: 'typeAndName', by: [{ field: 'guideType', direction: 'asc' }, { field: 'name', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'guideType' } },
})
