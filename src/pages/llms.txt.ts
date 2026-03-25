import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { projectGroups } from '../data/portfolio';
import { workExperiences } from '../data/workExperience';

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');

  const allPosts = await getCollection('blog');
  const publishedPosts = allPosts
    .filter((post) => post.data.published)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const lines: string[] = [
    '# jordangarrison.dev',
    '',
    '> Jordan Garrison — Tech Lead & SRE at FloSports. Engineer, lifelong learner, relentlessly curious.',
    '',
    '## About',
    `- [Home](${site}/)`,
    '',
    '## Blog',
    `- [Blog Index](${site}/blog)`,
    ...publishedPosts.map(
      (post) => `- [${post.data.title}](${site}/blog/${post.id}/)`
    ),
    '',
    '## Portfolio',
    `- [Portfolio Index](${site}/portfolio)`,
    ...projectGroups.flatMap((group) =>
      group.projects.map(
        (project) => `- [${project.title}](${project.githubUrl})`
      )
    ),
    '',
    '## Experience',
    `- [Experience](${site}/experience)`,
    ...workExperiences.map(
      (we) =>
        `- ${we.meta.company} — ${we.meta.title} (${we.meta.date.start}–${we.meta.date.end})`
    ),
    '',
    '## Contact',
    `- [Contact](${site}/contact)`,
    `- Email: hello@jordangarrison.dev`,
    `- [GitHub](https://github.com/jordangarrison)`,
    `- [LinkedIn](https://linkedin.com/in/jordan-garrison)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
