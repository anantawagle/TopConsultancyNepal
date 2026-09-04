import Link from 'next/link'

export const BLOG_CATEGORIES = [
  { slug: 'all', label: 'All Blogs', href: '/blog' },
  { slug: 'australia', label: 'Australia', href: '/blog/category/australia' },
  { slug: 'canada', label: 'Canada', href: '/blog/category/canada' },
  { slug: 'uk', label: 'United Kingdom', href: '/blog/category/uk' },
  { slug: 'usa', label: 'United States', href: '/blog/category/usa' },
  { slug: 'new-zealand', label: 'New Zealand', href: '/blog/category/new-zealand' }
]

export function BlogCategories({ activeCategory = 'all' }: { activeCategory?: string }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-10 mt-6">
      {BLOG_CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={c.href}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
            activeCategory === c.slug
              ? 'bg-brand-primary text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-secondary/30 hover:shadow-sm hover:text-brand-primary'
          }`}
        >
          {c.label}
        </Link>
      ))}
    </div>
  )
}
