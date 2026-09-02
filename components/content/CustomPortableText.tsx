import { PortableText, type PortableTextComponents } from 'next-sanity'
import type { PortableTextBlock } from 'sanity'
import Link from 'next/link'

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="mt-8 mb-4 text-4xl font-extrabold text-brand-primary md:text-5xl">{children}</h1>,
    h2: ({ children }) => <h2 className="mt-8 mb-4 text-3xl font-bold text-brand-primary">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 mb-3 text-2xl font-bold text-brand-primary">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-4 mb-2 text-xl font-bold text-brand-primary">{children}</h4>,
    normal: ({ children }) => <p className="mb-6 text-lg leading-8 text-text-main">{children}</p>,
    blockquote: ({ children }) => <blockquote className="my-6 border-l-4 border-brand-secondary pl-5 italic text-text-muted">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 list-disc space-y-3 pl-6 text-lg text-text-main">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 list-decimal space-y-3 pl-6 text-lg text-text-main">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const rel = value.href && !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
      return (
        <Link href={value?.href ?? '#'} rel={rel} className="font-semibold text-brand-secondary underline hover:text-brand-primary transition-colors">
          {children}
        </Link>
      )
    },
    strong: ({ children }) => <strong className="font-bold text-brand-primary">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
}

export function CustomPortableText({ value = [] }: { value?: PortableTextBlock[] }) {
  if (!value || value.length === 0) return null
  return <div className="portable-text"><PortableText value={value} components={components} /></div>
}
