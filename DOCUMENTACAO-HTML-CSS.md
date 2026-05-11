# Documentação HTML e CSS — Landing Dr. Scrub

Este documento descreve a estrutura da página única (landing) e onde cada estilo é definido. O conteúdo textual e os caminhos de media vêm de `src/app/config/site.config.ts`. O markup está em `src/app/pages/landing/landing-page.component.html`, os estilos do componente em `landing-page.component.scss` e os estilos globais em `src/styles.scss`. O ficheiro `src/index.html` só define o documento base, meta, fontes Google (DM Sans + Syne) e o `<app-root>`.

---

## Visão geral da arquitetura

- **Angular**: componente standalone `app-landing-page` com animações (`@angular/animations`) nos triggers `heroEnter`, `cardStagger`, `marqueeEnter` e `footerRise`.
- **Layout**: largura máxima e margens horizontais via classe utilitária `.shell` (aprox. 1180px, com `calc(100% - 3rem)`).
- **Tema**: modo escuro; variáveis CSS globais em `:root` (`--font-body`, `--font-display`, `--bg-deep`, `--text`).
- **Revelar ao scroll**: elementos com `data-reveal` começam desfocados e deslocados; a classe `.is-revealed` (adicionada por TypeScript) anima opacidade, `translateY` e `blur`. Atraso opcional com `data-reveal-delay`.
- **Lottie**: animação “mão a limpar” (`Cleaning Yellow Hand.json`) apenas no overlay de “voltar ao topo” (`.back-to-top-fx`, estilos em `styles.scss`).

---

## HTML por secção

### Cabeçalho fixo (`<header class="site-header">`)

- **`.site-header`**: barra fixa no topo; fundo em gradiente com `backdrop-filter` suave. A classe **`site-header--dense`** (ligada a `scrolled()` no TypeScript) reduz o padding, solidifica o fundo e adiciona sombra ao fazer scroll.
- **`.brand`**: link para `#top` com **`.brand__mark`** (quadrado com gradiente cónico) e **`.brand__text`** (nome + etiqueta de área).
- **`.nav-toggle`**: botão hambúrguer visível só em ecrãs estreitos; **`.nav__link`** e **`.nav__cta`** para âncoras internas e CTA “Get a quote”.
- **`#site-nav`**: em mobile, **`.nav--open`** controla painel dropdown sob o header.

### Hero (`<section class="hero" id="top">`)

- **`.hero__media`**: camada absoluta com imagem **`.hero__img`**, véu **`.hero__veil`**, grelha decorativa **`.hero__grid`** e brilho animado **`.hero__shine`** (`@keyframes hero-shine`).
- **`.hero__content`**: conteúdo sobreposto com `@heroEnter` — entrada em escada de eyebrow, título, lede, ações e estatísticas.
- **`.hero__title-accent`**: texto com gradiente e `background-clip: text`.
- **`.hero__stats`**: grelha de três colunas (`<dl>`) com termos em uppercase e definições em destaque.

### Serviços (`<section class="services" id="services">`)

- **`.services__head`**: bloco introdutório com classes partilhadas **`.eyebrow`**, **`.title`**, **`.lede`**.
- **`.services__grid`**: grelha de cartões com `@cardStagger`. Cada **`.card`** tem **`.card__glow`**, **`.card__icon`** (ícones CSS via `data-key`: `strip-wax` vs `maintenance`), título, texto e **`.card__list`** com marcadores em gradiente.
- **`.markets`**: chips **`.chip`** e **`.chip--accent`** para mercados e área de serviço.

### Prova antes/depois (`<section class="proof" id="proof">`)

- **`.proof__inner`**: duas colunas (texto + figura); empilha em mobile.
- **`.compare`**: slider controlado pela variável CSS **`--pos`** (percentagem), sincronizada com `comparePosition()` no TS. **`.compare__base`** é a imagem “after”; **`.compare__clip`** recorta **`.compare__top`** (before) com `clip-path`. **`.compare__handle`** + **`.compare__knob`** formam o controlo vertical arrastável.
- **`.compare__caption`**: **`.pill`**, **`.pill--before`**, **`.pill--after`**.

### Filme (`<section class="film" id="film">`)

- **`.film__copy`**: coluna “sticky” no desktop (`top: 6.5rem`), lista **`.film__bullets`**.
- **`.film__stage`**: se existirem vídeos em config, **`.film__dual`** com dois **`.film__vid`**; cada um usa **`.frame.frame--video`** e classe **`.frame--loaded`** após `loadeddata`. Caso contrário **`.frame--placeholder`** com **`.frame__shine`** animado e **`.frame__hint`** (texto com `<code>` estilizado).
- **`.film__note`**: nota pequena abaixo do palco.

### Clientes (`<section class="clients" id="clients">`)

- **`.clients__head`**: título e texto.
- **`.marquee`**: faixa com máscara nas bordas; **`.marquee__track`** anima `translateX(-50%)` em loop (`@keyframes marquee-scroll`). Itens duplicados em `marqueeItems` no TS para loop contínuo. `@marqueeEnter` anima entrada dos **`.marquee__item`**.
- **`.clients__fineprint`**: aviso legal curto.

### Rodapé / orçamento (`<footer class="footer" id="quote">`)

- **`.footer__grid`**: marca + **`.footer__panel`** com contactos (email **`.footer__cta`**, telefone, ações Call / SMS-iMessage **`.footer__action`**), **`.footer__meta`** com chips incl. **`.chip--hot`**.
- **`.footer__bar`**: copyright e botão **`.footer__top`** que dispara scroll suave + Lottie via `onBackToTop`.

### Overlays e meta de build

- **`.back-to-top-fx`**: fullscreen com fundo semitransparente e blur; **`.back-to-top-fx--on`** mostra o overlay; **`.back-to-top-fx__lottie`** dimensiona a animação Lottie (definido em `styles.scss` para ficar acima de tudo).
- **`.app-build-meta`**: canto inferior direito, versão (`site.appVersion`) e crédito; `title` e `aria-label` dinâmicos.

---

## CSS: ficheiros e responsabilidades

### `src/styles.scss` (global)

- **`:root`**: `color-scheme: dark`, fontes, cores de fundo e texto.
- **`html` / `body`**: scroll suave (respeitando `prefers-reduced-motion`), tipografia base, seleção de texto.
- **`.back-to-top-fx`***: overlay full-screen, z-index muito alto, transição de opacidade; **`.back-to-top-fx__lottie`** força largura máxima do SVG.
- **`@media (prefers-reduced-motion: reduce)`**: desativa `scroll-behavior: smooth` e comprime durações de animação/transição globalmente.

### `landing-page.component.scss` (encapsulado ao host)

- **`:host`**: `display: block` para o componente ocupar a largura.
- **Utilitários**: `.shell`, `.eyebrow`, `.title`, `.lede`, variantes em `.services`, `.chip*`, `[data-reveal]`.
- **Header → Footer**: blocos nomeados por BEM (`site-header`, `hero`, `services`, `proof`, `compare`, `film`, `frame`, `clients`, `marquee`, `footer`).
- **Keyframes**: `hero-shine`, `spin-slow` (ícone maintenance), `marquee-scroll`, `film-glow`.
- **Breakpoints**: uso consistente de `max-width` (ex.: 860px navegação/cartões, 960px proof/film, 900px vídeos duplos, 720px stats).
- **`prefers-reduced-motion`**: revelações já visíveis, marquee estático, brilhos do hero e do frame sem animação.

### Interação TypeScript relevante para o layout

- **Scroll**: `scrolled()` compacta o header; `comparePosition` e pointer events controlam o slider; `data-reveal` recebe `is-revealed` com `IntersectionObserver`. O Lottie só é usado em `onBackToTop` (overlay + scroll suave).
- **Menu**: `menuOpen()` alterna **`.nav--open`**.
- **Vídeos**: `lockVideoMuted` mantém `muted` nos elementos `<video>`.

---

## Onde editar o quê

| Objetivo | Ficheiro |
|----------|----------|
| Textos, lista de clientes, emails, media | `site.config.ts` |
| Estrutura das secções e ordem | `landing-page.component.html` |
| Cores, espaçamentos, animações de secção | `landing-page.component.scss` |
| Fontes, body global, overlay Lottie “back to top”, z-index global | `styles.scss` |
| Título da página e meta no browser | `src/index.html` |

---

## Versão

A versão apresentada no canto do ecrã corresponde a `SITE_CONFIG.appVersion` em `site.config.ts` (atualizada em deploys conforme a convenção do projeto).
