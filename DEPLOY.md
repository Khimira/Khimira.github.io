# Deploy no GitHub Pages

O repositório já vem com o workflow `.github/workflows/deploy.yml` pronto:
todo `push` na branch `main` builda e publica o site automaticamente. Você só
precisa fazer 3 coisas.

## 1. Escolha o tipo de repositório (isso muda 1 linha de config)

**Opção A — Repositório de usuário** (`Khimira.github.io`)
Se você criar/renomear o repositório exatamente como `Khimira.github.io`,
o site fica em `https://khimira.github.io/` (raiz). Não precisa mudar nada:
`astro.config.mjs` já está configurado com `base: '/'`.

**Opção B — Repositório de projeto** (qualquer outro nome, ex: `portfolio`)
O site fica em `https://khimira.github.io/portfolio/`. Nesse caso, abra
`astro.config.mjs` e troque:

```js
export default defineConfig({
  site: 'https://khimira.github.io',
  base: '/portfolio', // <- nome exato do repositório
  ...
});
```

## 2. Suba o código para o GitHub

```bash
cd portfolio
git init
git add .
git commit -m "feat: portfólio híbrido inicial"
git branch -M main
git remote add origin https://github.com/Khimira/NOME-DO-REPOSITORIO.git
git push -u origin main
```

## 3. Ative o GitHub Pages via Actions

No repositório no GitHub: **Settings → Pages → Build and deployment → Source**
e selecione **GitHub Actions**. Isso é tudo — o workflow já existente cuida
do build (`npm ci && npm run build`) e do deploy a partir da pasta `dist/`.

Depois do primeiro push, acompanhe o progresso na aba **Actions** do
repositório. Em 1–2 minutos o site estará no ar.

## Domínio customizado (GitHub Student Developer Pack)

1. No [GitHub Education Pack](https://education.github.com/pack), resgate um
   domínio grátis (Namecheap `.me`, `.tech`, etc oferece via o pack).
2. Na registradora, configure os DNS records apontando para o GitHub Pages:
   - Registros `A` do domínio raiz para os IPs do GitHub Pages
     (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`), **ou**
   - Um registro `CNAME` de um subdomínio (ex: `www`) apontando para
     `khimira.github.io`.
3. No repositório: **Settings → Pages → Custom domain**, digite seu domínio
   e salve. O GitHub cria automaticamente um arquivo `CNAME` em `public/` — se
   isso acontecer, **não delete**, é necessário para o domínio persistir a
   cada deploy.
4. Depois de propagado o DNS (pode levar até algumas horas), marque
   **Enforce HTTPS** na mesma página de configurações.

Se usar domínio customizado, ajuste também `site` em `astro.config.mjs` para
a URL final e volte `base` para `/` (a maioria dos domínios customizados
serve a partir da raiz).

## Solução de problemas

- **Página em branco / 404 em assets**: quase sempre é o `base` errado no
  `astro.config.mjs` — confira o passo 1.
- **Build falha no Actions mas funciona local**: rode `npm ci` (não
  `npm install`) localmente para reproduzir exatamente o ambiente do CI.
- **Terminal não carrega**: confirme que a rota `/terminal/` (com barra no
  final) está acessível; o Astro gera `terminal/index.html` como saída
  estática.
