import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }
      ]
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'topics',
      title: 'Related page topics',
      description: 'Select the pages where this article should appear as a related guide.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Australia', value: 'country:australia' },
          { title: 'Canada', value: 'country:canada' },
          { title: 'United Kingdom', value: 'country:uk' },
          { title: 'United States', value: 'country:usa' },
          { title: 'New Zealand', value: 'country:new-zealand' },
          { title: 'IELTS', value: 'test:ielts' },
          { title: 'PTE Academic', value: 'test:pte' },
          { title: 'TOEFL iBT', value: 'test:toefl' },
          { title: 'SAT', value: 'test:sat' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
