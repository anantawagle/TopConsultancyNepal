import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About Top Consultancy Nepal',
}

export default function AboutPage() {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
      <h1 className="text-4xl font-bold text-brand-primary mb-6">About Top Consultancy Nepal</h1>
      
      <div className="prose max-w-none text-text-main space-y-6">
        <p className="text-lg">
          Top Consultancy Nepal is a comprehensive, neutral directory of education consultancies across Nepal. 
          Our mission is to help students find, compare, and choose the right consultancy with confidence.
        </p>

        <h2 className="text-2xl font-bold text-brand-primary mt-8">Our Mission</h2>
        <p>
          We aim to bring transparency to the study abroad industry in Nepal. By providing verified listings, 
          clear information, and an unbiased platform, we empower students to make the best decisions for their future.
        </p>

        <h2 className="text-2xl font-bold text-brand-primary mt-8">Our Editorial Promise</h2>
        <p>
          Directory listings are presented using consistent criteria, with sponsored or promotional content
          clearly identified so students can make informed decisions.
        </p>
      </div>
    </main>
  )
}
