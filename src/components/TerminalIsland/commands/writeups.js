export const description = 'Lista os write-ups de CTF / labs de segurança.';

export async function run(args, ctx) {
  const writeups = ctx.writeups || [];

  if (writeups.length === 0) {
    ctx.print('Nenhum write-up publicado ainda.', { className: 'text-rp-muted' });
    return;
  }

  ctx.print(`root@khimira:~# ls -la /writeups`, { className: 'text-rp-subtle' });
  await ctx.wait(150);

  const filterTerm = args[0]?.toLowerCase();
  const filtered = filterTerm
    ? writeups.filter((w) => {
        const haystack = [w.ctf, w.category, ...(w.tags || [])].join(' ').toLowerCase();
        return haystack.includes(filterTerm);
      })
    : writeups;

  if (filtered.length === 0) {
    ctx.print(`Nenhum write-up encontrado para "${filterTerm}".`, { className: 'text-rp-muted' });
    return;
  }

  for (const w of filtered) {
    await ctx.wait(120);
    const status = w.solved === false ? 'NÃO RESOLVIDO' : 'SOLVED';
    const points = w.points ? ` | ${w.points}pts` : '';
    ctx.print(`[${w.difficulty}] ${w.title}`, { className: 'text-rp-kali-green-bright' });
    ctx.print(`  ${w.ctf} / ${w.category}  |  ${status}${points}  |  ${w.readTime}`, {
      className: 'text-rp-subtle',
    });
    ctx.print(`  ${w.summary}`);
    ctx.print('');
  }

  ctx.print(`Dica: use "writeups <termo>" para filtrar por plataforma, categoria ou tag.`, {
    className: 'text-rp-subtle',
  });
}
