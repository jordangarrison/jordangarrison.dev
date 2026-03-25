import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    categories: z.array(z.enum(['engineering', 'nix', 'devops', 'personal', 'tutorial'])),
    tags: z.array(z.string()),
    published: z.boolean(),
    readingTime: z.string(),
  }),
});

export const collections = { blog };
