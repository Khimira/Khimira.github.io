import { SITE } from '../../../config';

export const description = 'Exibe informações de contato.';

export async function run(_args, ctx) {
  ctx.print('[CONTATO]', { className: 'text-rp-gold' });
  ctx.print(`  email     : ${SITE.email}`);
  ctx.print(`  linkedin  : ${SITE.linkedin}`);
  ctx.print(`  github    : ${SITE.github}`);
  ctx.print(`  localidade: ${SITE.location}`);
}
