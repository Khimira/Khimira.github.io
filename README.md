# Lucas Carvalho — Portfólio Híbrido

Portfólio de alta performance construído em **Astro.js**, com duas experiências:

- **Modo RH** (`/`) — página estática, 0 kb de JS por padrão, otimizada para
  SEO e leitura rápida por recrutadores.
- **Modo Terminal** (`/terminal`) — ilha React hidratada sob demanda, com
  emulação CRT, efeitos de fósforo, digitação estilo typewriter e comandos
  interativos (`about`, `projects`, `nmap`, `matrix`, `themes`, etc).

O conteúdo (projetos e posts) vive em `src/content/` como Markdown tipado
via **Zod** (Content Collections), então os dois modos leem exatamente a
mesma fonte de dados.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:4321`. Para simular o build de produção:

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
├── config.ts              # Dados pessoais, SEO, nav — fonte única
├── content.config.ts       # Schemas Zod das Content Collections
├── content/
│   ├── projects/           # Um .md por projeto (cards do Modo RH e comando `projects`)
│   └── blog/                # Notas técnicas / SecOps
├── layouts/
│   ├── LayoutRH.astro       # Layout estático + JSON-LD Person + Open Graph
│   └── LayoutTerminal.astro # Wrapper CRT (scanlines, flicker, botão de acessibilidade)
├── components/
│   ├── CardProjeto.astro
│   ├── SwitchTerminal.astro # Botão de transição RH → Terminal
│   └── TerminalIsland/      # Ilha React (só carrega JS ao visitar /terminal)
│       ├── Terminal.jsx     # Orquestrador: boot, loop de comandos, temas
│       ├── InputLine.jsx    # Linha de comando (contentEditable + caret customizado)
│       ├── OutputLine.jsx   # Renderização de saída + efeito typewriter
│       ├── MatrixRain.jsx   # Easter egg `matrix`
│       └── commands/        # Um módulo por comando, importado dinamicamente
└── pages/
    ├── index.astro
    ├── terminal.astro
    └── projects/[...slug].astro
```

## Adicionando um novo projeto

Crie um arquivo em `src/content/projects/nome-do-projeto.md` seguindo o
schema definido em `src/content.config.ts` (veja os arquivos existentes como
modelo). Ele aparece automaticamente no card do Modo RH **e** no comando
`projects` do terminal — não precisa editar mais nada.

## Deploy

Veja **[DEPLOY.md](./DEPLOY.md)** para o passo a passo de publicação
gratuita no GitHub Pages usando o GitHub Student Developer Pack.

## Comandos do terminal

`help` · `about` · `skills` · `projects [tag]` · `blog` · `contact` ·
`nmap` / `scan` · `themes <nome>` · `matrix` · `clear` · `exit` ·
`sudo rm -rf /` (não faça isso — mas pode tentar 👀)

## Acessibilidade

O Modo Terminal inclui um botão fixo **"Desabilitar Flicker/CRT"** no canto
inferior direito, que desliga scanlines e cintilação para pessoas com
epilepsia fotossensível ou sensibilidade visual. A preferência é lembrada via
`localStorage` e também respeita `prefers-reduced-motion` do sistema.
