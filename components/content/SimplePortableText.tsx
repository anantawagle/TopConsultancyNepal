import type { PortableTextBlock } from '@/lib/sanity/consultancies'

export function SimplePortableText({ value = [] }: { value?: PortableTextBlock[] }) {
  return <div className="space-y-5 text-lg leading-8 text-text-main">{value.filter((block) => block._type === 'block').map((block) => { const text = block.children?.map((child) => child.text).join('') ?? ''; if (block.style === 'h2') return <h2 key={block._key} className="pt-5 text-3xl font-bold text-brand-primary">{text}</h2>; if (block.style === 'h3' || block.style === 'h4') return <h3 key={block._key} className="pt-4 text-2xl font-bold text-brand-primary">{text}</h3>; if (block.style === 'blockquote') return <blockquote key={block._key} className="border-l-4 border-brand-secondary pl-5 italic text-text-muted">{text}</blockquote>; if (block.listItem) return <div key={block._key} className="flex gap-3 pl-2"><span aria-hidden="true">•</span><p>{text}</p></div>; return <p key={block._key}>{text}</p> })}</div>
}
