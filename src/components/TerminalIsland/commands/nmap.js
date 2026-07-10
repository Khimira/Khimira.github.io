export const description = 'Simula um scan de portas lógicas do portfólio.';

const PORTS = [
  { port: '22/ssh-terminal', state: ' open  ', service: 'modo-terminal-ssh' },
  { port: '80/http-website', state: ' open  ', service: 'modo-website-http' },
  { port: '443/https-website ', state:'open', service: 'modo-website-tls'  },
  { port: '31337/elite', state: 'closed', service: 'reservado' },
];

export async function run(args, ctx) {
  const target = args[0] || 'khimira.dev';
  ctx.print(`Starting Nmap 7.94 ( https://nmap.org )`, { className: 'text-rp-subtle' });
  ctx.print(`Scanning ${target}...`, { className: 'text-rp-subtle' });
  await ctx.wait(400);

  ctx.print('PORT             STATE          SERVICE', { mono: true, className: 'text-rp-gold' });
  for (const p of PORTS) {
    await ctx.wait(180);
    ctx.print(`${p.port.padEnd(17)}${p.state.padEnd(15)}${p.service}`, {
      mono: true,
      className: p.state === 'closed' ? 'text-rp-muted' : 'text-rp-kali-green-bright',
    });
  }

  await ctx.wait(200);
  ctx.print('');
  ctx.print(`Nmap done: 1 IP address (1 host up) scanned.`, { className: 'text-rp-subtle' });
}
