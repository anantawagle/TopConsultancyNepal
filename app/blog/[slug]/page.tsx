import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { defineQuery } from 'next-sanity'
import { isSanityConfigured } from '@/lib/sanity/config'
import type { PortableTextBlock } from 'sanity'
import { CustomPortableText } from '@/components/content/CustomPortableText'
import { ChevronLeft } from 'lucide-react'

type Post = { title: string; excerpt?: string; publishedAt?: string; body?: PortableTextBlock[] }

const postQuery = defineQuery(/* groq */ `*[_type == "post" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{ title, excerpt, publishedAt, body }`)

async function getPost(slug: string): Promise<Post | null> { 
  if (!isSanityConfigured) return null; 
  const { client } = await import('@/lib/sanity/client'); 
  return client.fetch<Post | null>(postQuery, { slug }, { cache: 'no-store' }).catch(() => null) 
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { 
  const post = await getPost((await params).slug); 
  return post ? { title: post.title, description: post.excerpt } : {} 
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) { 
  const post = await getPost((await params).slug); 
  if (!post) notFound(); 
  
  return (
    <main className="flex-1 bg-white pb-20">
      {/* Article Header */}
      <header className="bg-slate-50 py-16 sm:py-20 mb-12 border-b border-slate-100">
        <div className="mx-auto w-full max-w-4xl px-4">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-brand-secondary hover:text-brand-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> All articles
          </Link>
          
          <div className="flex items-center gap-2 text-sm font-medium text-text-muted mb-6">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-sm">
              📅
            </span>
            {post.publishedAt ? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(post.publishedAt)) : 'Study guide'}
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-primary md:text-5xl lg:text-6xl leading-tight">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="mt-8 text-xl leading-relaxed text-text-muted max-w-3xl">
              {post.excerpt}
            </p>
          )}
        </div>
      </header>
      
      {/* Article Content */}
      <article className="mx-auto w-full max-w-3xl px-4">
        {post.body && post.body.length > 0 ? (
          <CustomPortableText value={post.body} />
        ) : (
          <div className="py-10 text-center text-text-muted italic">
            This article has no content yet.
          </div>
        )}
      </article>
    </main>
  )
}
