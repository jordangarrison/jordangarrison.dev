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

const experience = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    title: z.string(),
    image: z.string().optional(),
    url: z.string().url().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}$/).nullable(),
    sortOrder: z.number(),
    category: z.enum(['professional', 'other']),
    summary: z.string(),
    promotions: z.array(z.object({
      title: z.string(),
      date: z.string(),
    })).optional(),
    highlights: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
  }),
});

export const collections = { blog, experience };
