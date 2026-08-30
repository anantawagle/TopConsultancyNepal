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
      S.documentTypeListItem('post').title('Blog Posts'),
      S.divider(),
      ...S.documentTypeListItems().filter(listItem => !['siteSettings', 'consultancy', 'event', 'post'].includes(listItem.getId() as string))
    ])
