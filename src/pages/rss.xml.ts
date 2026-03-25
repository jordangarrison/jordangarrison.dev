import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const allPosts = await getCollection('blog');
  const publishedPosts = allPosts
    .filter((post) => post.data.published)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'jordangarrison.dev',
    // Intentionally uses site tagline rather than spec's "Jordan Garrison's blog"
    description:
      'Jordan Garrison — Engineer, lifelong learner, relentlessly curious.',
    site: context.site!.toString(),
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.categories,
    })),
  });
}
