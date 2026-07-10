export const description = 'Não. Sério, não faça isso. (easter egg)';

export async function run(_args, ctx) {
  ctx.print('rm: descendo em /, isso vai apagar TUDO.', { className: 'text-rp-love' });
  await ctx.wait(500);
  ctx.print('Sentinel - ATAQUE DETECTADO!', {
    className: 'text-rp-love',
  });
  await ctx.wait(500);
  ctx.print('Sentinel - Tentando impedir Kernel Panic', {
    className: 'text-rp-love',
  });
  ctx.print('Sentinel - Oh no, here we go again...', {
    className: 'text-rp-love',
  });
  await ctx.wait(3000);
  ctx.triggerKernelPanic();
}
