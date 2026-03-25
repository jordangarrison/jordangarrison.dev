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

  const sections: string[] = [];

  // Header
  sections.push(
    '# jordangarrison.dev',
    '',
    '> Jordan Garrison — Tech Lead & SRE at FloSports. Engineer, lifelong learner, relentlessly curious.',
    '',
    `Site: ${site}`,
    ''
  );

  // About — NOTE: Keep in sync with src/pages/index.astro
  sections.push(
    '## About',
    '',
    'Passionate about my family, Open Source, Linux, Jiu Jitsu, and being actively involved in my local church.',
    '',
    '"Complexity very bad. Say no to complexity."',
    '',
    '### Education',
    '',
    'Texas A&M University — B.S. Physics with Math Minor (2012–2017)',
    'Started with Higgs Boson simulations in the Department of Physics and Astronomy, running C++ and Bash on distributed computing clusters.',
    '',
    '### Skills',
    '',
    '- **Languages:** Go, TypeScript, Python, Bash, Ruby',
    '- **Platforms:** Kubernetes, Istio, Argo, Fastly, Kafka',
    '- **Infrastructure as Code:** Terraform, CDK, Helm, Kustomize, Nix',
    '- **Observability:** Datadog, Prometheus, Grafana, ELK',
    '',
    '### Awards & Certifications',
    '',
    '- Advanced GitOps Certification — Akuity, 2024',
    '- Promotion to Tech Lead — FloSports, 2023',
    '- Top Performer - Own It Award — FloSports, 2021',
    '- Promotion to Senior Infrastructure Engineer — FloSports, 2021',
    '- CEO Life Saving Award & CIO Safety Award — General Motors, 2019',
    '- Early Promotion from New College Hire Program — General Motors, 2019',
    '- CIO Distinguished New College Hire — General Motors, 2018 & 2019',
    ''
  );

  // Work Experience
  sections.push('## Work Experience', '');
  for (const we of workExperiences) {
    sections.push(
      `### ${we.meta.company} — ${we.meta.title}`,
      `${we.meta.date.start}–${we.meta.date.end}`,
      `${we.meta.url}`,
      ''
    );
    if (we.meta.promotions) {
      sections.push(
        '**Promotions:**',
        ...we.meta.promotions.map((p) => `- ${p.title} (${p.date})`),
        ''
      );
    }
    for (const item of we.body) {
      sections.push(`**${item.title}**`, item.description, '');
    }
  }

  // Portfolio
  sections.push('## Portfolio', '');
  for (const group of projectGroups) {
    sections.push(`### ${group.title}`, '');
    for (const project of group.projects) {
      sections.push(
        `#### ${project.title}`,
        '',
        project.description,
        '',
        `- **GitHub:** ${project.githubUrl}`,
        ...(project.liveUrl ? [`- **Live:** ${project.liveUrl}`] : []),
        ...(project.downloadUrl
          ? [`- **Download:** ${project.downloadUrl}`]
          : []),
        `- **Tech Stack:** ${project.techStack.join(', ')}`,
        `- **Features:** ${project.features.join('; ')}`,
        ''
      );
    }
  }

  // Blog Posts (full content)
  sections.push('## Blog Posts', '');
  for (const post of publishedPosts) {
    sections.push(
      `### ${post.data.title}`,
      '',
      `- **Date:** ${post.data.date.toISOString().split('T')[0]}`,
      `- **Categories:** ${post.data.categories.join(', ')}`,
      `- **Tags:** ${post.data.tags.join(', ')}`,
      `- **Reading Time:** ${post.data.readingTime}`,
      `- **URL:** ${site}/blog/${post.id}/`,
      '',
      post.body ?? '',
      ''
    );
  }

  // Contact
  sections.push(
    '## Contact',
    '',
    `- **Email:** hello@jordangarrison.dev`,
    `- **GitHub:** https://github.com/jordangarrison`,
    `- **LinkedIn:** https://linkedin.com/in/jordan-garrison`,
    `- **Web:** ${site}/contact`,
    ''
  );

  return new Response(sections.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
