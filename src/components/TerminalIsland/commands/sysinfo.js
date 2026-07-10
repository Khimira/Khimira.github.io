import { SITE, ABOUT } from '../../../config';

export const description = 'Exibe dados de perfil, formação e habilidades técnicas.';

function table(rows) {
  const width = Math.max(...rows.map((r) => r.join(' : ').length), 40);
  const bar = '+' + '-'.repeat(width + 2) + '+';
  const lines = [bar];
  for (const row of rows) {
    const text = row.join(' : ');
    lines.push('| ' + text.padEnd(width, ' ') + ' |');
  }
  lines.push(bar);
  return lines;
}

export async function run(args, ctx) {
  const sub = args[0];

  if (sub === 'skills') {
    ctx.print(`root@khimira:~# extracting skill matrix...`, { className: 'text-rp-subtle' });
    await ctx.wait(200);
    for (const line of table(ABOUT.skills.map((s) => [s]))) {
      ctx.print(line, { mono: true });
    }
    return;
  }

  ctx.print(`root@khimira:~# whoami -v`, { className: 'text-rp-subtle' });
  await ctx.wait(150);
  ctx.print(`> ${SITE.name} :: ${SITE.role}`, { className: 'text-rp-kali-green-bright' });
  ctx.print(SITE.tagline, { className: 'text-rp-subtle' });
  ctx.print('');
  ctx.print(ABOUT.summary);
  ctx.print('');
  ctx.print('[FORMAÇÃO]', { className: 'text-rp-gold' });
  for (const edu of ABOUT.education) {
    ctx.print(`  ${edu.institution} — ${edu.degree} (${edu.period}) [${edu.status}]`);
  }
  ctx.print('');
  ctx.print('[FOCOS DE ESTUDO]', { className: 'text-rp-gold' });
  for (const focus of ABOUT.focusAreas) {
    ctx.print(`  * ${focus.area}`);
    for (const item of focus.items) {
      ctx.print(`      - ${item}`, { className: 'text-rp-subtle' });
    }
  }
  ctx.print('');
  ctx.print(`Digite "skills" para a lista completa de habilidades técnicas.`, {
    className: 'text-rp-subtle',
  });
}
