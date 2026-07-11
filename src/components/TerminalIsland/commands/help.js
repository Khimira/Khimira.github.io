export const description = 'Lista todos os comandos disponíveis.';

export const COMMAND_LIST = [
  { cmd: 'about', desc: 'Perfil, formação e resumo técnico' },
  { cmd: 'projects [tag]', desc: 'Lista projetos (filtro opcional por tag)' },
  { cmd: 'blog', desc: 'Lista notas técnicas / SecOps' },
  { cmd: 'writeups [termo]', desc: 'Lista write-ups de CTF/labs (filtro opcional)' },
  { cmd: 'contact', desc: 'Informações de contato' },
  { cmd: 'nmap | scan', desc: 'Simula um scan de portas do portfólio' },
  { cmd: 'themes <nome>', desc: 'Troca a paleta de cores do terminal' },
  { cmd: 'clear', desc: 'Limpa a tela' },
  { cmd: 'exit', desc: 'Retorna ao Modo Website' },
];

export async function run(_args, ctx) {
  ctx.print('Comandos disponíveis:', { className: 'text-rp-gold' });
  for (const { cmd, desc } of COMMAND_LIST) {
    ctx.print(`  ${cmd.padEnd(18)} ${desc}`, { mono: true });
  }
}
