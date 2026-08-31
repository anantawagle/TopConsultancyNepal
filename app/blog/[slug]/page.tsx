import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { defineQuery } from 'next-sanity'
import { isSanityConfigured } from '@/lib/sanity/config'
type Span = { _key: string; _type: 'span'; text: string; marks?: string[] }
type Block = { _key: string; _type: string; style?: string; children?: Span[] }
type Post = { title: string; excerpt?: string; publishedAt?: string; body?: Block[] }
const slugsQuery = defineQuery(/* groq */ `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]{ "slug": slug.current }`)
const postQuery = defineQuery(/* groq */ `*[_type == "post" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{ title, excerpt, publishedAt, body }`)
async function getPost(slug: string): Promise<Post | null> { if (!isSanityConfigured) return null; const { client } = await import('@/lib/sanity/client'); return client.fetch<Post | null>(postQuery, { slug }).catch(() => null) }
export const dynamicParams = false
export async function generateStaticParams() { if (!isSanityConfigured) return [{ slug: '__empty' }]; const { client } = await import('@/lib/sanity/client'); const slugs = await client.fetch<{ slug: string }[]>(slugsQuery).catch(() => []); return slugs.length ? slugs : [{ slug: '__empty' }] }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const post = await getPost((await params).slug); return post ? { title: post.title, description: post.excerpt } : {} }
function ArticleBody({ blocks = [] }: { blocks?: Block[] }) { return <div className="space-y-5 text-lg leading-8 text-text-main">{blocks.filter((block) => block._type === 'block').map((block) => { const value = block.children?.map((child) => child.text).join('') ?? ''; if (block.style === 'h2') return <h2 key={block._key} className="pt-5 text-3xl font-bold text-brand-primary">{value}</h2>; if (block.style === 'h3') return <h3 key={block._key} className="pt-4 text-2xl font-bold text-brand-primary">{value}</h3>; if (block.style === 'blockquote') return <blockquote key={block._key} className="border-l-4 border-brand-secondary pl-5 italic text-text-muted">{value}</blockquote>; return <p key={block._key}>{value}</p> })}</div> }
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) { const post = await getPost((await params).slug); if (!post) notFound(); return <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14"><Link href="/blog" className="font-semibold text-brand-secondary">← All articles</Link><article className="mt-8"><p className="text-sm text-text-muted">{post.publishedAt ? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(post.publishedAt)) : 'Study guide'}</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-primary md:text-5xl">{post.title}</h1>{post.excerpt && <p className="my-8 border-l-4 border-brand-secondary pl-5 text-xl leading-8 text-text-muted">{post.excerpt}</p>}<ArticleBody blocks={post.body} /></article></main> }
