import type { Config } from 'tailwindcss';

// Tailwind v4 é "CSS-first": os tokens visuais (cores, fontes, animações)
// vivem em `src/styles/global.css` dentro do bloco `@theme`.
// Este arquivo é mantido por compatibilidade/documentação e para IDEs que
// ainda leem `tailwind.config.ts` para autocomplete de classes.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
} satisfies Config;
