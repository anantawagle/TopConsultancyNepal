import { Studio } from '../Studio'

export const dynamicParams = false

export function generateStaticParams() {
  return [{ index: [] }]
}

export default function StudioPage() {
  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_DATASET
  )

  if (!isConfigured) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-secondary">
            Content Studio
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-brand-primary">
            Sanity Studio is not configured
          </h1>
          <p className="mt-4 leading-7 text-text-muted">
            Add the public Sanity project ID and dataset environment variables
            to enable the content-management interface on this deployment.
          </p>
        </div>
      </main>
    )
  }

  return <Studio />
}
