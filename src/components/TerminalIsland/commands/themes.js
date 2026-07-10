export const description = 'Troca a paleta de cores do terminal. Ex: themes dracula';

export const THEMES = {
  'rose-pine-moon': {
    base: '#232136',
    surface: '#2a273f',
    text: '#e0def4',
    accent: '#3e8fb0',
    bright: '#9ccfd8',
    subtle: '#908caa',
  },
  'kali-green': {
    base: '#0a0e0a',
    surface: '#111811',
    text: '#c8f7c5',
    accent: '#10b981',
    bright: '#4ade80',
    subtle: '#5f8a6a',
  },
  dracula: {
    base: '#282a36',
    surface: '#343746',
    text: '#f8f8f2',
    accent: '#bd93f9',
    bright: '#ff79c6',
    subtle: '#6272a4',
  },
  'catppuccin-mocha': {
    base: '#1e1e2e',
    surface: '#292c3c',
    text: '#cdd6f4',
    accent: '#89b4fa',
    bright: '#f5c2e7',
    subtle: '#7f849c',
  },
  'amber-phosphor': {
    base: '#1a1207',
    surface: '#241a0d',
    text: '#ffb000',
    accent: '#ff9500',
    bright: '#ffcc66',
    subtle: '#a87b2e',
  },
};

export async function run(args, ctx) {
  const name = args[0];

  if (!name) {
    ctx.print('Temas disponíveis:', { className: 'text-rp-gold' });
    for (const key of Object.keys(THEMES)) {
      ctx.print(`  - ${key}`);
    }
    ctx.print('Uso: themes <nome>', { className: 'text-rp-subtle' });
    return;
  }

  const theme = THEMES[name];
  if (!theme) {
    ctx.print(`Tema "${name}" não encontrado. Digite "themes" para ver as opções.`, {
      className: 'text-rp-love',
    });
    return;
  }

  ctx.setTheme(name, theme);
  ctx.print(`Tema alterado para "${name}".`, { className: 'text-rp-kali-green-bright' });
}
