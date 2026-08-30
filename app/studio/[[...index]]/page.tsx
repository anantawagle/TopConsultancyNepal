import { Studio } from '../Studio'

export const dynamicParams = false

export function generateStaticParams() {
  return [{ index: [] }]
}

export default function StudioPage() {
  return <Studio />
}
