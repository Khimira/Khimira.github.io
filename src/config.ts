// -----------------------------------------------------------------------
// Configuração global do site: metadados de SEO, dados pessoais e
// atalhos consumidos tanto pelo Modo RH quanto pelo Modo Terminal.
// -----------------------------------------------------------------------

export const SITE = {
  name: 'Lucas Carvalho',
  handle: 'khimira',
  role: 'Analista de Informática',
  tagline: 'Infraestrutura de Redes, Linux e Engenharia Reversa',
  description:
    'Estudante de Sistemas de Informação (IFBA) com viés prático em infraestrutura de redes, Linux, administração de servidores e engenharia reversa. Experiência real em Homelab/VPS, segurança e automação com IA.',
  location: 'Vitória da Conquista, Bahia, Brasil',
  email: 'khimira.dev@gmail.com',
  linkedin: 'https://www.linkedin.com/in/khimira/',
  github: 'https://github.com/Khimira',
  lang: 'pt-BR',
} as const;

export const ABOUT = {
  summary: SITE.description,
  education: [
    {
      institution: 'IFBA',
      degree: 'Bacharelado em Sistemas de Informação',
      period: '2025 — Atualmente',
      status: 'Em andamento',
    },
  ],
  focusAreas: [
    {
      area: 'Cibersegurança',
      items: ['Análise de Malware', 'Criptografia', 'Redes Seguras'],
    },
    {
      area: 'Redes de Computadores',
      items: ['Virtual Private Servers', 'Virtual Private Networks', 'Sistemas baseados em Cloud'],
    },
    {
      area: 'Engenharia Reversa',
      items: ['Ghidra', 'Extração de Firmware em Bare Metal', 'Low-level Coding'],
    },
  ],
  languages: [
    { name: 'Português', level: 'Fluente' },
    { name: 'Inglês', level: 'Fluente' },
  ],
  skills: [
    'Manutenção de Firmware',
    'Manutenção de Sistemas Operacionais',
    'Manutenção de Redes',
    'Linux',
    'Windows',
    'Ghidra (leitura de assembly e engenharia reversa)',
    'Java',
    'C',
    'Docker',
    'Tailscale',
    'Nginx Proxy Manager',
  ],
  experience: [
    {
      title: 'Administração de Sistemas Linux',
      subtitle: 'VPS, Homelab, Notebooks',
      bullets: [
        'Gerenciamento de servidores Linux (Debian, Ubuntu, Arch) em ambiente VPS (Oracle Cloud) e local (homelab).',
        'Orquestração de contêineres com Docker e CasaOS.',
        'Configuração de redes seguras utilizando Tailscale (VPN/Mesh) e Nginx Proxy Manager (Reverse Proxy/SSL).',
        'Implementação de monitoramento e automação de serviços.',
      ],
    },
    {
      title: 'Manutenção de Aparelhos',
      subtitle: 'Android, Linux, Windows, Firmware',
      bullets: [
        'Auxílio e manutenção de sistemas operacionais mobile (Android) e desktop (Windows e Linux).',
        'Extração de firmware de dispositivos SoC (System-on-Chip) através de programador CH341A, seguido de engenharia reversa e modificação do sistema.',
      ],
    },
  ],
} as const;

// Atalhos de navegação compartilhados entre o header do Modo RH
// e a tabela de rotas do comando `help` no terminal.
export const NAV_LINKS = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Blog', href: '#blog' },
  { label: 'Write-ups', href: '#writeups' },
  { label: 'Contato', href: '#contato' },
] as const;

export const SEO_DEFAULTS = {
  titleTemplate: `%s — ${SITE.name}`,
  defaultTitle: `${SITE.name} | ${SITE.role}`,
  ogImage: '/og-image.png',
} as const;
