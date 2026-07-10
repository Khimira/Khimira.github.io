// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// IMPORTANT (GitHub Pages):
// - Se o repositório se chamar "Khimira.github.io" (user/organization page),
//   deixe base: '/' e site: 'https://khimira.github.io'.
// - Se for um repositório de projeto (ex: "portfolio"), troque base para
//   '/nome-do-repositorio' e ajuste o site abaixo. Veja DEPLOY.md.
export default defineConfig({
  site: 'https://khimira.github.io',
  base: '/',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
