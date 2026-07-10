export const description = 'Lista os projetos, extraídos da mesma fonte de dados do Modo RH.';

export async function run(args, ctx) {
  const projects = ctx.projects || [];

  if (projects.length === 0) {
    ctx.print('Nenhum projeto encontrado.', { className: 'text-rp-muted' });
    return;
  }

  ctx.print(`root@khimira:~# ls -la /projects`, { className: 'text-rp-subtle' });
  await ctx.wait(150);

  const filterTag = args[0];
  const filtered = filterTag ? projects.filter((p) => p.tags?.includes(filterTag)) : projects;

  if (filtered.length === 0) {
    ctx.print(`Nenhum projeto com a tag "${filterTag}".`, { className: 'text-rp-muted' });
    return;
  }

  for (const p of filtered) {
    await ctx.wait(120);
    ctx.print(`[${p.difficulty}] ${p.actionTitle}`, { className: 'text-rp-kali-green-bright' });
    ctx.print(`  proto: ${p.protocol}  |  runtime: ${p.runtime.join(', ')}  |  ${p.readTime}`, {
      className: 'text-rp-subtle',
    });
    ctx.print(`  ${p.summary}`);
    ctx.print('');
  }

  ctx.print(`Dica: use "projects <tag>" para filtrar. Veja também o Modo RH para os cards visuais.`, {
    className: 'text-rp-subtle',
  });
}
