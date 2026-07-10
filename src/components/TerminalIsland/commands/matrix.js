export const description = 'Chuva de caracteres estilo Matrix. Digite "exit" ou role a tela para sair.';

// Este módulo não imprime linhas no buffer normal: ele delega ao Terminal.jsx
// via ctx.startMatrix(), que monta um <canvas> em overlay full-screen.
export async function run(_args, ctx) {
  ctx.print('Wake up, Neo...', { className: 'text-rp-kali-green-bright' });
  await ctx.wait(2000);
  ctx.startMatrix();
}
