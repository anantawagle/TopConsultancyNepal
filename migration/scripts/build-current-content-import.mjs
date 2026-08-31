import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = process.cwd()
const outputDirectory = path.join(root, 'migration', 'generated')

function loadTypeScriptModule(relativePath, requireMap = {}) {
  const filename = path.join(root, relativePath)
  const source = fs.readFileSync(filename, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  }).outputText
  const module = { exports: {} }
  const localRequire = (specifier) => {
    if (specifier in requireMap) return requireMap[specifier]
    throw new Error(`Unsupported import ${specifier} while extracting ${relativePath}`)
  }
  new Function('require', 'module', 'exports', compiled)(localRequire, module, module.exports)
  return module.exports
}

function stableKey(prefix, index) {
  return `${prefix}-${String(index + 1).padStart(2, '0')}`
}

const { countries, tests, locations } = loadTypeScriptModule('lib/content/guides.ts')
const { referenceConsultancies } = loadTypeScriptModule('lib/sanity/consultancies.ts', {
  'next-sanity': { defineQuery: (query) => query },
  './config': { isSanityConfigured: false },
})

const guideGroups = [
  ['destination', '/study', countries],
  ['test', '/test-preparation', tests],
  ['location', '/consultancies', locations],
]

const guides = guideGroups.flatMap(([guideType, routePrefix, records]) => records.map((guide) => ({
  _id: `migration.guide.${guideType}.${guide.slug}`,
  _type: 'guide',
  guideType,
  name: guide.name,
  slug: { _type: 'slug', current: guide.slug },
  eyebrow: guide.eyebrow,
  summary: guide.summary,
  introduction: guide.introduction,
  facts: guide.facts.map((fact, index) => ({ _key: stableKey('fact', index), _type: 'fact', ...fact })),
  highlights: guide.highlights.map((highlight, index) => ({ _key: stableKey('highlight', index), _type: 'guideHighlight', ...highlight })),
  sourceId: `repository:${guideType}:${guide.slug}`,
  legacyPath: `${routePrefix}/${guide.slug}`,
})))

const consultancies = referenceConsultancies.map(({ _id: sourceId, slug, ...consultancy }) => ({
  _id: `migration.consultancy.${slug}`,
  _type: 'consultancy',
  ...consultancy,
  slug: { _type: 'slug', current: slug },
  listingStatus: 'active',
  isVerified: false,
  isSponsored: false,
  sourceId: `repository:${sourceId}`,
}))

const highlights = [
  {
    _id: 'migration.homeHighlight.welcome',
    _type: 'homeHighlight',
    category: 'update',
    title: 'Find the right education consultancy with confidence',
    summary: 'Compare trusted consultancies across Nepal and plan your international education journey.',
    link: { _type: 'object', label: 'Explore consultancies', url: '/consultancies' },
    mainImage: { _type: 'image', _sanityAsset: 'image@https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop', alt: 'Students collaborating around a table' },
    publishedAt: '2024-01-01T00:00:00.000Z',
    priority: 30,
  },
  {
    _id: 'migration.homeHighlight.scholarships',
    _type: 'homeHighlight',
    category: 'scholarship',
    title: 'Discover opportunities that can fund your studies',
    summary: 'Browse scholarship information and take the next step toward studying abroad without financial worries.',
    link: { _type: 'object', label: 'View scholarships', url: '/scholarships' },
    mainImage: { _type: 'image', _sanityAsset: 'image@https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop', alt: 'Students cheering with backpacks' },
    publishedAt: '2024-01-01T00:00:00.000Z',
    priority: 20,
  },
  {
    _id: 'migration.homeHighlight.destinations',
    _type: 'homeHighlight',
    category: 'announcement',
    title: 'Start planning your study-abroad journey',
    summary: 'Explore popular destinations, entry requirements, and options for your academic and career goals.',
    link: { _type: 'object', label: 'View destinations', url: '/study' },
    mainImage: { _type: 'image', _sanityAsset: 'image@https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop', alt: 'Airplane wing and destination map' },
    publishedAt: '2024-01-01T00:00:00.000Z',
    priority: 10,
  },
]

const settings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'Top Consultancy Nepal',
  tagline: 'Find, Compare and Choose with Confidence. Your trusted directory for education consultancies in Nepal.',
  defaultSeoTitle: 'Top Consultancy Nepal - Find, Compare and Choose with Confidence',
  defaultSeoDescription: 'Find and compare education consultancies in Nepal. Get study-abroad information, test-preparation guides and scholarship guidance.',
}

const documents = [settings, ...guides, ...consultancies, ...highlights]
fs.mkdirSync(outputDirectory, { recursive: true })
fs.writeFileSync(path.join(outputDirectory, 'current-content.ndjson'), `${documents.map((document) => JSON.stringify(document)).join('\n')}\n`)
fs.writeFileSync(path.join(outputDirectory, 'report.json'), `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  source: 'repository hardcoded content',
  counts: {
    siteSettings: 1,
    guides: guides.length,
    destinations: countries.length,
    tests: tests.length,
    locations: locations.length,
    consultancies: consultancies.length,
    homeHighlights: highlights.length,
    total: documents.length,
  },
  assets: { remoteImagesQueuedForSanityImport: highlights.length },
  routesPreserved: guides.map(({ legacyPath }) => legacyPath),
}, null, 2)}\n`)

console.log(`Generated ${documents.length} documents in migration/generated/current-content.ndjson`)
