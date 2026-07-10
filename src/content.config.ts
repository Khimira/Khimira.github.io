import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// -----------------------------------------------------------------------
// Coleção: Projetos (usada tanto pelo Modo RH quanto pelo comando `projects`
// do Terminal). Fonte única de verdade.
// -----------------------------------------------------------------------
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    // Frase de ação no imperativo, ex: "Audite e blinde um barramento I2C"
    actionTitle: z.string(),
    summary: z.string(),
    // Tag combinada Protocolo/Dificuldade -> ex: "Linux / Advanced"
    protocol: z.string(),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Critical']),
    // Selo do ambiente de execução (runtime/tecnologia central)
    runtime: z.array(z.string()),
    readTime: z.string(),
    date: z.coerce.date(),
    repoUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

// -----------------------------------------------------------------------
// Coleção: Blog / notas técnicas de SecOps
// -----------------------------------------------------------------------
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Critical']).default('Intermediate'),
    readTime: z.string(),
  }),
});

export const collections = { projects, blog };
