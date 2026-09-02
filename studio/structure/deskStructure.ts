import type { StructureBuilder } from 'sanity/structure'

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.divider(),
      S.documentTypeListItem('consultancy').title('Consultancies'),
      S.documentTypeListItem('event').title('Events'),
      S.documentTypeListItem('guide').title('Destination & Test Guides'),
      S.documentTypeListItem('enquiry').title('Enquiries'),
      S.documentTypeListItem('post').title('Blog Posts'),
      S.divider(),
      ...S.documentTypeListItems().filter(listItem => !['siteSettings', 'consultancy', 'event', 'guide', 'enquiry', 'post'].includes(listItem.getId() as string))
    ])
