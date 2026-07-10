export const description = 'Lista as notas técnicas / posts do blog.';

export async function run(_args, ctx) {
  const posts = ctx.posts || [];
  if (posts.length === 0) {
    ctx.print('Nenhuma nota técnica publicada ainda.', { className: 'text-rp-muted' });
    return;
  }

  ctx.print(`root@khimira:~# cat /var/log/blog/*.md`, { className: 'text-rp-subtle' });
  await ctx.wait(150);

  for (const post of posts) {
    await ctx.wait(120);
    ctx.print(`* ${post.title} [${post.difficulty}] — ${post.readTime}`, {
      className: 'text-rp-kali-green-bright',
    });
    ctx.print(`  ${post.summary}`, { className: 'text-rp-subtle' });
    ctx.print('');
  }
}
