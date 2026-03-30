import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    categories: z.array(z.enum(['engineering', 'nix', 'personal', 'tutorial'])),
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
    url: z.string().optional(),
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

const skills = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/skills' }),
  schema: z.object({
    name: z.string(),
    sortOrder: z.number(),
    resumeSection: z.enum(['sidebar', 'main']),
    items: z.array(z.string()),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/education' }),
  schema: z.object({
    institution: z.string(),
    degree: z.string(),
    major: z.string(),
    minor: z.string().optional(),
    startYear: z.number(),
    endYear: z.number(),
    sortOrder: z.number(),
  }),
});

const certifications = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/certifications' }),
  schema: z.object({
    name: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}$/),
    credentialId: z.string().optional(),
    description: z.string().optional(),
    sortOrder: z.number(),
  }),
});

const awards = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/awards' }),
  schema: z.object({
    title: z.string(),
    years: z.array(z.number()).min(1),
    organization: z.string(),
    sortOrder: z.number(),
  }),
});

export const collections = { blog, experience, skills, education, certifications, awards };
