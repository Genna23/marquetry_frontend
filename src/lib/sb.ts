import { useStoryblokApi  } from '@storyblok/astro'

export async function fetchStory(slug: string, draft = false) {
  const api = useStoryblokApi()
  const { data } = await api.get(`cdn/stories/${slug}`, {
    version: draft ? 'draft' : 'published',
    resolve_links: 'url',
  })
  return data.story
}

export async function fetchAllLinks() {
  const api = useStoryblokApi()
  const { data } = await api.get('cdn/links', { version: 'published' })
  return data.links as Record<string, { slug: string; is_folder: boolean; is_startpage: boolean }>
}
