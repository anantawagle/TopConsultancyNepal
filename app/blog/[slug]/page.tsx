import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { defineQuery } from 'next-sanity'
import { isSanityConfigured } from '@/lib/sanity/config'
import type { PortableTextBlock } from 'sanity'
import { CustomPortableText } from '@/components/content/CustomPortableText'
import { ChevronLeft } from 'lucide-react'
import { RelatedBlogs } from '@/components/content/RelatedBlogs'

type Post = { 
  title: string; 
  slug: string;
  excerpt?: string; 
  publishedAt?: string; 
  body?: PortableTextBlock[];
  topics?: string[];
  mainImage?: { url: string; alt?: string };
  author?: { 
    name: string; 
    slug: string;
    bio?: PortableTextBlock[];
    image?: { url: string; alt?: string } 
  };
}

const postQuery = defineQuery(/* groq */ `*[_type == "post" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{ 
  title, 
  "slug": slug.current,
  excerpt, 
  publishedAt, 
  body,
  topics,
  "mainImage": mainImage.asset->{ "url": url, "alt": ^.alt },
  "author": author->{ name, "slug": slug.current, bio, "image": image.asset->{ "url": url, "alt": ^.alt } }
}`)

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
      <header className="bg-slate-50 pt-16 pb-12 sm:pt-20 sm:pb-16 mb-12 border-b border-slate-100">
        <div className="mx-auto w-full max-w-4xl px-4">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-brand-secondary hover:text-brand-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> All articles
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-text-muted mb-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-sm">
                📅
              </span>
              {post.publishedAt ? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(post.publishedAt)) : 'Study guide'}
            </div>
            
            {post.author && (
              <div className="flex items-center gap-2">
                <span className="text-slate-300">•</span>
                {post.author.image?.url ? (
                  <Image 
                    src={post.author.image.url} 
                    alt={post.author.image.alt || post.author.name}
                    width={28}
                    height={28}
                    className="rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                    {post.author.name.charAt(0)}
                  </span>
                )}
                <Link href={`/author/${post.author.slug}`} className="hover:text-brand-primary transition-colors">
                  By {post.author.name}
                </Link>
              </div>
            )}
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-primary md:text-5xl lg:text-6xl leading-tight">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="mt-8 text-xl leading-relaxed text-text-muted max-w-3xl">
              {post.excerpt}
            </p>
          )}

          {post.mainImage?.url && (
            <div className="relative w-full aspect-[16/9] mt-10 rounded-2xl overflow-hidden bg-slate-200 shadow-xl border border-slate-200/50">
              <Image
                src={post.mainImage.url}
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
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

        {/* Author Bio Section */}
        {post.author && (
          <div className="mt-16 mb-8 p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row gap-6 items-start">
            {post.author.image?.url ? (
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md">
                <Image
                  src={post.author.image.url}
                  alt={post.author.image.alt || post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-3xl font-bold text-brand-primary border-4 border-white shadow-md">
                {post.author.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-brand-primary mb-2">
                <Link href={`/author/${post.author.slug}`} className="hover:text-brand-secondary transition-colors">
                  {post.author.name}
                </Link>
              </h3>
              {post.author.bio && post.author.bio.length > 0 ? (
                <div className="text-slate-600 prose prose-slate prose-sm max-w-none">
                  <CustomPortableText value={post.author.bio} />
                </div>
              ) : (
                <p className="text-slate-500 text-sm">
                  Author and contributor at Top Consultancy Nepal.
                </p>
              )}
              <Link href={`/author/${post.author.slug}`} className="inline-block mt-4 text-sm font-bold text-brand-secondary hover:text-brand-primary transition-colors">
                View all posts by {post.author.name} &rarr;
              </Link>
            </div>
          </div>
        )}
      </article>

      {/* Related Blogs */}
      {post.topics && post.topics.length > 0 && (
        <div className="mx-auto w-full max-w-4xl px-4 mt-12">
          <RelatedBlogs topics={post.topics} excludeSlug={post.slug} />
        </div>
      )}
    </main>
  )
}
