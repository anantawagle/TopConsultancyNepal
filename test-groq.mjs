import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'h914k677',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false
})

async function run() {
  const posts = await client.fetch(`*[_type == "post"]{ title, topics }`)
  console.log('All posts:', JSON.stringify(posts, null, 2))

  const topicPosts = await client.fetch(`*[_type == "post" && "country:canada" in coalesce(topics, [])]{ title, topics }`)
  console.log('Canada posts:', JSON.stringify(topicPosts, null, 2))
}

run()
