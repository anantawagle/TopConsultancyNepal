import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'enquiry',
  title: 'Enquiry',
  type: 'document',
  readOnly: true, // Enquiries are submitted via form, not created manually in studio
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'destination', title: 'Preferred Destination', type: 'string' }),
    defineField({
      name: 'tests',
      title: 'Test Preparation',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({ name: 'educationLevel', title: 'Education Level', type: 'string' }),
    defineField({ name: 'intake', title: 'Preferred Intake', type: 'string' }),
    defineField({ name: 'academicBackground', title: 'Academic Background', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'text' }),
    defineField({ name: 'sourcePath', title: 'Source URL Path', type: 'string' }),
    defineField({ name: 'utmSource', title: 'UTM Source', type: 'string' }),
    defineField({ name: 'submittedAt', title: 'Submitted At', type: 'datetime' }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'destination',
      date: 'submittedAt'
    },
    prepare({ title, subtitle, date }) {
      return {
        title: title || 'Unknown',
        subtitle: `${subtitle || 'No destination'} - ${date ? new Date(date).toLocaleDateString() : ''}`
      }
    }
  }
})
