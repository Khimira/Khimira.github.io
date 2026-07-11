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
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Professional']),
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

// -----------------------------------------------------------------------
// Coleção: Write-ups de CTF / labs (HTB, TryHackMe, picoCTF, etc.)
// -----------------------------------------------------------------------
const writeups = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writeups' }),
  schema: z.object({
    title: z.string(),
    // Plataforma/competição de origem, ex: "HackTheBox", "TryHackMe", "picoCTF 2026"
    ctf: z.string(),
    // Categoria do desafio, ex: "pwn", "web", "crypto", "forense", "reversing"
    category: z.string(),
    summary: z.string(),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Critical']),
    points: z.number().optional(),
    solved: z.boolean().default(true),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    readTime: z.string(),
    repoUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects, blog, writeups };
