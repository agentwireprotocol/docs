import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
  }),
});

const meta = defineCollection({
  loader: glob({ pattern: '**/*.{json,yaml}', base: './content/docs' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    pages: z.array(z.string()).optional(),
    icon: z.string().optional(),
    // A root folder is a sidebar tab: its pages get a sidebar of their own.
    root: z.boolean().optional(),
  }),
});

export const collections = {
  docs,
  meta,
};
