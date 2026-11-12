#!/usr/bin/env node
// Gera as páginas HTML estáticas do site "Estação do Agente • SuperAção SP"
// a partir dos dados em ./data e dos templates abaixo.
// Uso: node build/build.js   (gera os .html na raiz do projeto)

const fs = require('fs');
const path = require('path');
const { icon, whatsapp, fig } = require('./icons');
const POPUPS = require('./data/popups.json');
const etapas = require('./data/etapas');
const politicasData = require('./data/politicas');
const tutoriaisData = require('./data/tutoriais');
const bibliotecaData = require('./data/biblioteca');
const LINKS = require('./data/links');
const EXT = ' target="_blank" rel="noopener"';

const ROOT = path.join(__dirname, '..');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Mini-markup: **negrito** e [texto](link)
const md = (s) => String(s)
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// ---------------------------------------------------------------- navegação
// side = ícone do menu lateral, card = ícone do card da Home, bn = ícone do banner (todos exportados do .fig)
const STAGES = [
  { id: 'busca', label: 'BUSCA ATIVA', href: 'busca-ativa.html', side: 'sideRadar', card: 'stRadar', bn: 'bnRadar' },
  { id: 'visita1', label: 'CONHECENDO<br>A FAMÍLIA', href: 'visita-1.html', side: 'sideFamilia', card: 'stFamilia', bn: 'bnFamilia' },
  { id: 'visita23', label: 'COMPREENDENDO<br>A REALIDADE', href: 'visitas-2-e-3.html', side: 'sideLampada', card: 'stLampada', bn: 'bnLampada' },
  { id: 'visita45', label: 'PLANEJANDO<br>O CAMINHO', href: 'visitas-4-e-5.html', side: 'sideEstrategia', card: 'stEstrategia', bn: 'bnEstrategia' },
  { id: 'mensais', label: 'ACOMPANHANDO<br>A JORNADA', href: 'visitas-mensais.html', side: 'sideOlho', card: 'stOlho', bn: 'bnOlho' },
  { id: 'conclusao', label: 'CONCLUSÃO', href: 'conclusao.html', side: 'sideCheck', card: 'stCheck', bn: 'bnCheck' },
];
const BANNER_ICON = Object.fromEntries(STAGES.map((s) => [s.id, s.bn]));
const QUICK = [
  { id: 'modulos', label: 'Módulos e incentivos', href: 'modulos-e-incentivos.html', side: 'sideModulos' },
  { id: 'oportunidades', label: 'Oportunidades', href: LINKS.geral.oportunidades, side: 'sideMaleta', external: true },
  { id: 'biblioteca', label: 'Biblioteca', href: 'biblioteca.html', side: 'sideLivro' },
  { id: 'links', label: 'Links úteis', href: 'links-uteis.html', side: 'sideLink' },
  { id: 'politicas', label: 'Políticas públicas', href: 'politicas-publicas.html', side: 'sideHub' },
  { id: 'tutoriais', label: 'Tutoriais SIGMA', href: 'tutoriais-sigma.html', side: 'sidePlay' },
  { id: 'faq', label: 'Perguntas frequentes', href: 'faq.html', side: 'sideFaq' },
];
const WHATSAPP_URL = LINKS.geral.whatsapp;

// ---------------------------------------------------------------- blocos
const head = (title, bodyClass) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="Estação do Agente • SuperAção SP — Programa do Governo do Estado de São Paulo, executado pela SEDS com apoio técnico da FGV.">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="${bodyClass}">
<a class="skip" href="#conteudo">Pular para o conteúdo</a>`;

const header = (inner = true) => `
<header class="site-header">
  <div class="topbar">
    <div class="container topbar__inner">
      <span>Governo do Estado de São Paulo</span><i class="dot" aria-hidden="true"></i>
      <span>Secretaria de Desenvolvimento Social</span><i class="dot" aria-hidden="true"></i>
      <span>Apoio técnico: FGV Projetos</span>
    </div>
  </div>
  <div class="navbar">
    <div class="container navbar__inner">
      <a class="brand" href="index.html">${inner ? `<span class="brand__home">${fig('home')}</span>` : ''}<span class="brand__a">ESTAÇÃO DO AGENTE</span> • <strong>SuperAção SP</strong></a>
      <form class="search" role="search" data-site-search>
        <label class="sr-only" for="busca-site">Buscar na Estação do Agente</label>
        <input id="busca-site" type="search" placeholder="Buscar na Estação do Agente" autocomplete="off">
        <button type="submit" aria-label="Buscar">${fig('search')}</button>
        <ul class="search__results" hidden></ul>
      </form>
    </div>
  </div>
</header>`;

const lembre = (variant) => `
<section class="lembre lembre--${variant}" aria-label="Lembre-se">
  <div class="container lembre__inner">
    <div class="lembre__msg">
      ${whatsapp}
      <div>
        <p class="lembre__title">Lembre-se:</p>
        <p class="lembre__text">${variant === 'home'
          ? 'Conte sempre com o apoio da Supervisão<br>e Assessoria de Campo • Whatsapp'
          : 'Você não está sozinho! Conte sempre com<br>o apoio da Supervisão e Assessoria de Campo.'}</p>
      </div>
    </div>
    <a class="btn btn--outline" href="${WHATSAPP_URL}" target="_blank" rel="noopener">Clique aqui e receba apoio</a>
  </div>
</section>`;

const footer = (variant) => `
<footer class="footer footer--${variant}">
  <div class="container footer__inner">
    <div class="footer__about">
      <p class="footer__brand"><strong>SUPERAÇÃO SP</strong><span class="footer__sep">•</span><span>Estação do Agente</span></p>
      <p class="footer__desc">Programa do Governo do Estado de São Paulo,<br>executado pela Secretaria de Desenvolvimento Social (SEDS),<br>com apoio técnico da Fundação Getúlio Vargas (FGV).</p>
    </div>
    <div class="footer__contact">
      <p class="footer__label">Contato</p>
      <a href="mailto:faleconoscosuperacaosp@fgv.br"><span class="footer__ico">${fig('mail')}</span>faleconoscosuperacaosp@fgv.br</a>
      <a href="${WHATSAPP_URL}" target="_blank" rel="noopener"><span class="footer__ico">${fig('phone')}</span>WhatsApp: (11) 92140-9019</a>
    </div>
  </div>
</footer>`;

const tail = () => `
<script src="assets/js/search-index.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>
`;

const sidebar = (active) => {
  const stageItems = STAGES.map((s) => {
    const on = s.id === active;
    return `<li>
          <a class="side-item side-item--stage${on ? ' is-active' : ''}" data-theme="${s.id}" href="${s.href}"${on ? ' aria-current="page"' : ''}><span class="side-ico">${fig(s.side)}</span><span>${s.label}</span></a>${on ? '\n          <span class="here">Você está aqui!</span>' : ''}
        </li>`;
  }).join('\n        ');
  const quickItems = QUICK.map((q) => {
    const on = q.id === active;
    return `<li>
          <a class="side-item side-item--quick q-${q.id}${on ? ' is-active' : ''}" href="${q.href}"${on ? ' aria-current="page"' : ''}${q.external ? EXT + ' title="Plataforma externa de cursos e vagas"' : ''}><span class="side-ico">${fig(q.side)}</span><span>${q.label}</span></a>${on ? '\n          <span class="here">Você está aqui!</span>' : ''}
        </li>`;
  }).join('\n        ');
  return `
  <aside class="sidebar" aria-label="Navegação da Estação do Agente">
    <nav class="sidebar__nav">
      <p class="side-title">${fig('sideJornada')}JORNADA DA FAMÍLIA</p>
      <ul class="side-list">
        ${stageItems}
      </ul>
      <p class="side-title side-title--quick">${fig('sideAcesso')}ACESSO RÁPIDO</p>
      <ul class="side-list side-list--quick">
        ${quickItems}
      </ul>
    </nav>
  </aside>`;
};

const back = () => `<a class="back" href="index.html">${icon('chevronLeft', 20)}Voltar a Home</a>`;

const banner = (theme, ic, kicker, title, opts = {}) => `
      <div class="banner banner--${theme}">
        <span class="banner__ico">${fig(ic)}</span>
        <h1>${kicker ? `<span class="banner__k">${kicker}</span>` : ''}${title ? `<span class="banner__t${opts.bigTitle ? ' banner__t--big' : ''}">${title}</span>` : ''}</h1>
      </div>`;

const innerPage = ({ file, title, bodyClass, active, content, after = '' }) => {
  const html = `${head(title, 'inner ' + bodyClass)}
${header()}
<div class="layout container">
${sidebar(active)}
  <main class="content" id="conteudo">
    ${back()}
${content}
  </main>
</div>
${lembre('inner')}
${footer('inner')}
${after}
${tail()}`;
  write(file, html);
};

function write(file, html) {
  html = html.replace(/href="([^"]*)"/g, (m, u) => `href="${u.replace(/&(?!amp;)/g, '&amp;')}"`);
  fs.writeFileSync(path.join(ROOT, file), html.replace(/[ \t]+\n/g, '\n'));
  console.log('  ✓', file);
}

// ---------------------------------------------------------------- HOME
function buildHome() {
  const cards = [
    { n: '0', t: 'BUSCA ATIVA', theme: 'busca', icon: 'stRadar', btn: 'Encontrar as famílias', href: 'busca-ativa.html' },
    { n: '1', t: 'CONHECENDO<br>A FAMÍLIA', theme: 'visita1', icon: 'stFamilia', btn: 'Visita 1', href: 'visita-1.html' },
    { n: '2', t: 'COMPREENDENDO<br>A REALIDADE', theme: 'visita23', icon: 'stLampada', btn: 'Visitas 2 e 3', href: 'visitas-2-e-3.html' },
    { n: '3', t: 'PLANEJANDO<br>O CAMINHO', theme: 'visita45', icon: 'stEstrategia', btn: 'Visitas 4 e 5', href: 'visitas-4-e-5.html' },
    { n: '4', t: 'ACOMPANHANDO<br>A JORNADA', theme: 'mensais', icon: 'stOlho', btn: 'Visitas mensais', href: 'visitas-mensais.html' },
    { n: '', t: 'CONCLUSÃO', theme: 'conclusao', icon: 'stCheck', btn: 'Acompanhamento<br>de concluintes', href: 'conclusao.html' },
  ];
  const quick = [
    { t: 'Módulos e incentivos', d: 'Informações sobre<br>os módulos e<br>incentivos relacionados', href: 'modulos-e-incentivos.html', icon: 'quickModulos', c: 'modulos' },
    { t: 'Oportunidades', d: 'Acesso à plataforma<br>de busca por<br>cursos e vagas de<br>trabalho disponíveis', href: LINKS.geral.oportunidades, icon: 'quickMaleta', c: 'oportunidades', ext: true },
    { t: 'Biblioteca', d: 'Manuais, protocolos e<br>materiais de referência', href: 'biblioteca.html', icon: 'quickLivro', c: 'biblioteca' },
    { t: 'Links úteis', d: 'Sistemas e páginas<br>externas com<br>conteúdos importantes', href: 'links-uteis.html', icon: 'quickLink', c: 'links' },
  ];
  const pol = [
    ['protecao-social', 'polProtecaoSocial', 'Proteção social<br>especializada'],
    ['educacao', 'polEducacao', 'Educação básica'],
    ['formacao', 'polFormacao', 'Formação e<br>qualificação<br>profissional'],
    ['saude', 'polSaude', 'Saúde e<br>bem-estar'],
    ['seguranca', 'polSeguranca', 'Segurança<br>alimentar'],
    ['moradia', 'polMoradia', 'Moradia e<br>condições de vida'],
    ['cultura', 'polCultura', 'Cultura e<br>cidadania'],
    ['familia', 'polFamilia', 'Proteção e<br>fortalecimento<br>familiar'],
    ['trabalho', 'polTrabalho', 'Trabalho e<br>geração de renda'],
  ];

  const html = `${head('Estação do Agente • SuperAção SP', 'home')}
${header(false)}
<main id="conteudo">
  <section class="h-jornada" aria-labelledby="t-jornada">
    <div class="container">
      <div class="sec-title">${fig('secJornada')}<h1 id="t-jornada">JORNADA DA FAMÍLIA</h1></div>
      <p class="sec-sub">Acompanhe as etapas da família na Trilha de Superação da Pobreza</p>
      <div class="jornada">
        <div class="jornada__hint">
          ${fig('hand')}
          <p>Passe para<br>o lado e<br>selecione<br>a etapa atual<br>da jornada</p>
        </div>
        <div class="carousel" data-carousel tabindex="0" aria-label="Etapas da jornada">
          <div class="carousel__track">
            ${cards.map((c, i) => `<article class="stage-card theme-${c.theme}" data-slide="${i}">
              <h2>${c.n !== '' ? `${c.n}<br>` : ''}${c.t}</h2>
              <div class="stage-card__foot">
                ${fig(c.icon)}
                <a class="btn btn--white${c.btn.includes('<br>') ? ' btn--2l' : ''}" href="${c.href}">${c.btn}</a>
              </div>
            </article>`).join('\n            ')}
          </div>
        </div>
      </div>
      <div class="carousel-dots" data-carousel-dots>
        ${cards.map((c, i) => `<button type="button" class="dot-btn${i === 0 ? ' is-active' : ''}" aria-label="Ir para a etapa ${i}"></button>`).join('')}
      </div>
    </div>
  </section>

  <section class="h-acesse" aria-labelledby="t-acesse">
    <div class="container">
      <div class="sec-title">${fig('secAcesse')}<h2 id="t-acesse">ACESSE RAPIDAMENTE</h2></div>
      <p class="sec-sub">Alguns atalhos para o seu dia a dia</p>
      <div class="quick-grid">
        ${quick.map((q) => `<a class="quick q-${q.c}" href="${q.href}"${q.ext ? EXT + ' title="Plataforma externa de cursos e vagas"' : ''}>
          <span class="quick__icon">${fig(q.icon)}</span>
          <span class="quick__text"><strong>${q.t}</strong><span>${q.d}</span></span>
        </a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="h-tutorial" aria-labelledby="t-tutorial">
    <div class="container h-tutorial__inner">
      <a class="video-thumb" href="tutoriais-sigma.html" aria-label="Assistir aos Tutoriais SIGMA">
        <img src="assets/img/tutorial-sigma-thumb.png" width="337" height="190" alt="Vídeo de apresentação do Programa de Superação da Pobreza">
        <span class="play-btn" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30"><defs><linearGradient id="gPlay" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cbcec"/><stop offset="1" stop-color="#0a5ea8"/></linearGradient></defs><path d="M7 4.5 19 12 7 19.5Z" fill="none" stroke="url(#gPlay)" stroke-width="2.2" stroke-linejoin="round"/></svg></span>
      </a>
      <div class="h-tutorial__text">
        <h2 id="t-tutorial">Tutoriais SIGMA</h2>
        <a class="btn btn--white" href="tutoriais-sigma.html">clique para acessar os vídeos</a>
      </div>
    </div>
  </section>

  <section class="h-politicas" aria-labelledby="t-politicas">
    <div class="container">
      <div class="sec-title">${fig('secPoliticas')}<h2 id="t-politicas">POLÍTICAS PÚBLICAS</h2></div>
      <p class="sec-sub">Onde a família precisa de apoio?</p>
      <div class="pol-grid">
        ${pol.map(([id, ic, label]) => `<a class="pol-card" href="politicas-publicas.html#${id}"><span class="pol-card__icon">${fig(ic)}</span><span class="pol-card__label">${label}</span></a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="h-faq" aria-label="Perguntas frequentes">
    <div class="container">
      <a class="h-faq__link" href="faq.html">${fig('faqLink')}<span>Acesse a página de Perguntas e Respostas sobre o programa.</span></a>
    </div>
  </section>
</main>
${lembre('home')}
${footer('home')}
${tail()}`;
  write('index.html', html);
}

// ---------------------------------------------------------------- ETAPAS
// Larguras das caixas de texto no Figma (para reproduzir as mesmas quebras de linha).
const WIDTHS = {
  'busca-ativa': { rec: [721, 724, 721, 773, 721, 721], at: [282, 282, 282, 282, 268, 261], fin: [349, 319, 337, 336, 337, 336, 337, 336] },
  'visita-1': { rec: [666, 601, 660, 623, 728, 700], at: [282, 282, 282, 282, 268, 261, 308], fin: [349, 336, 337, 336, 337, 336, 337, 336, 336, 336] },
  'visitas-2-e-3': { rec: [722, 721, 728, 674, 721, 721], at: [337, 282, 282, 282, 285, 337], fin: [349, 336, 337, 336, 337, 336, 337, 336] },
  'visitas-4-e-5': { rec: [666, 601, 660, 645, 660, 607], at: [282, 282, 282, 282, 268, 308], fin: [349, 336, 337, 336, 337, 337, 336] },
  'visitas-mensais': { rec: [646, 622, 660, 645, 616, 607, 607], at: [282, 282, 282, 282, 268, 308], fin: [349, 336, 337, 336, 337, 337, 337, 336, 336, 336] },
  conclusao: { rec: [639, 617, 634, 645, 574], at: [324, 310, 318, 282, 318, 308], fin: [349, 336, 337, 337, 336, 308, 308, 297, 336, 336] },
};
const mw = (w) => (w ? ` style="max-width:${Math.round(w * 1.012) + 2}px"` : '');

// Popups dos passos (frames "Popup … Como fazer" / "… Evitar" do .fig): um por passo,
// com abas COMO FAZER / EVITAR, "Lembre-se" próprio de cada aba e navegação Anterior/Próximo.
const sp = (t) => String(t).replace(/\s+/g, ' ').trim();
function stepModals(steps) {
  return steps.map((st, i) => {
    const id = `passo-${i + 1}`;
    const list = (arr) => `<ul>${arr.map((x) => `<li>${md(sp(x))}</li>`).join('')}</ul>`;
    const tip = (txt, tab) => `<div class="modal__tip" data-tab-panel="${tab}"${tab === 'como' ? '' : ' hidden'}>${fig('bell')}<div><strong>Lembre-se</strong><span>${sp(txt)}</span></div></div>`;
    const prev = i > 0 ? `<button type="button" class="modal__prev" data-modal-open="passo-${i}"><span>${icon('chevronLeft', 20)}</span> Anterior</button>` : '';
    const next = i < steps.length - 1 ? `<button type="button" class="modal__next" data-modal-open="passo-${i + 2}">Próximo <span>${icon('chevronRight', 20)}</span></button>` : '';
    return `
<div class="modal modal--passo" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-t" hidden>
  <div class="modal__backdrop" data-modal-close></div>
  <div class="modal__box">
    <div class="modal__head">
      <h2 id="${id}-t">${sp(st.title)}</h2>
      <button type="button" class="btn btn--navy modal__close" data-modal-close>Fechar</button>
    </div>
    <p class="modal__desc">${md(sp(st.desc))}</p>
    <div class="tabs" role="tablist">
      <button type="button" role="tab" class="tab is-active" aria-selected="true" data-tab="como">COMO FAZER</button>
      <button type="button" role="tab" class="tab tab--evitar" aria-selected="false" data-tab="evitar">EVITAR</button>
    </div>
    <div class="modal__panel" data-tab-panel="como">${list(st.como.list)}</div>
    <div class="modal__panel modal__panel--evitar" data-tab-panel="evitar" hidden>${list(st.evitar.list)}</div>
    <div class="modal__foot">
      ${tip(st.como.lembre, 'como')}${tip(st.evitar.lembre, 'evitar')}
      <div class="modal__nav">${prev}${next}</div>
    </div>
  </div>
</div>`;
  }).join('');
}

function buildEtapa(e) {
  const W = WIDTHS[e.slug] || { rec: [], at: [], fin: [] };
  const n = e.passos.length;
  const steps = POPUPS[e.slug] || [];
  const passos = e.passos.map((p, i) => {
    const pos = i % 2 === 0 ? 'up' : 'down';
    return `<li class="step step--${pos}">
            <span class="step__label">${p}</span>
            <button type="button" class="step__num"${steps[i] ? ` data-modal-open="passo-${i + 1}"` : ''} aria-label="Passo ${i + 1}: ${esc(p.replace(/<br>/g, ' '))}">${i + 1}</button>
          </li>`;
  }).join('\n          ');

  let di = 0;
  const recursos = e.recursos.map((r) => {
    const href = LINKS.recursos[r.t] || r.href;
    const t = r.html
      ? r.html.replace(/href="#"/g, `href="${LINKS.geral.sigma}"${EXT}`)
      : href ? `<a href="${href}"${href.startsWith('http') ? EXT : ''}>${r.t}</a>` : r.t;
    return `<li class="recurso${r.d ? '' : ' recurso--solo'}">
            <h3 class="recurso__t">${t}</h3>${r.d ? `\n            <p${mw(W.rec[di++])}>${r.d}</p>` : ''}
          </li>`;
  }).join('\n          ');

  const atencao = e.atencao.map((a, i) => `<li>${fig('alerta')}<p${mw(W.at[i])}>${md(a)}</p></li>`).join('\n          ');

  const proximos = e.proximos.map((p) => {
    const inner = `${p.titulo ? `<strong class="next-card__t">${p.titulo}</strong>` : ''}<span>${md(p.texto)}</span>`;
    return `<div class="next-card">${inner}</div>`;
  }).join('\n          ');

  const final = e.final.map((f, i) => `<li>${fig('checkCircle')}<p${mw(W.fin[i])}>${f}</p></li>`).join('\n          ');

  const popup = stepModals(steps);

  const content = `${banner(e.theme, BANNER_ICON[e.nav], e.kicker, e.title, { bigTitle: e.slug === 'busca-ativa' })}

      <section class="sec">
        <h2 class="sec-h">Objetivo da etapa</h2>
        <p class="lead">${md(e.objetivo)}</p>
      </section>

      <section class="sec">
        <h2 class="sec-h">${e.passosTitulo} <span class="sec-h__light">• Explore os passos abaixo para saber mais</span></h2>
        <ol class="steps steps--${n}">
          ${passos}
        </ol>
      </section>

      <section class="sec">
        <h2 class="sec-h">Recursos utilizados</h2>
        <ul class="recursos">
          ${recursos}
        </ul>
      </section>

      <section class="sec">
        <h2 class="sec-h">Pontos de atenção</h2>
        <ul class="atencao">
          ${atencao}
        </ul>
      </section>

      <section class="sec">
        <h2 class="sec-h">Próximos passos</h2>
        <div class="next-steps next-steps--${e.proximos.length}">
          ${proximos}
        </div>
      </section>

      <section class="sec sec--last">
        <h2 class="sec-h">Ao final desta etapa você deverá ter</h2>
        <ul class="final-list${e.finalAuto ? ' final-list--auto' : ''}">
          ${final}
        </ul>
      </section>${popup}`;

  innerPage({
    file: e.file,
    title: `${e.kicker} • ${e.title.replace(/<br>/g, ' ')} — Estação do Agente`,
    bodyClass: 'etapa theme-' + e.theme,
    active: e.nav,
    content,
  });
}

// ---------------------------------------------------------------- filtros (componente)
const filterPanel = ({ placeholder, filtros, rows, extraClass = '', top = '' }) => {
  const byId = Object.fromEntries(filtros.map((f) => [f.id, f]));
  const groups = rows || [filtros.map((f) => f.id)];
  const chip = (f) => `<button type="button" class="chip${f.id === 'todos' ? ' is-active' : ''}" data-filter-chip="${f.id}" aria-pressed="${f.id === 'todos'}">${f.label}</button>`;
  return `
      <div class="filter-panel ${extraClass}" data-filter>${top}
        <label class="filter-search">
          ${fig('search')}
          <span class="sr-only">${placeholder}</span>
          <input type="search" placeholder="${placeholder}" data-filter-search autocomplete="off">
        </label>
        <div class="chips" role="group" aria-label="Filtrar por categoria">
          ${groups.map((g) => `<div class="chips__row">${g.map((id) => chip(byId[id])).join('')}</div>`).join('\n          ')}
        </div>
      </div>`;
};

// ---------------------------------------------------------------- POLÍTICAS
function buildPoliticas() {
  const { categorias, ordemFiltros, politicas } = politicasData;
  const byId = Object.fromEntries(categorias.map((c) => [c.id, c]));
  const filtros = ordemFiltros.map((id) => (id === 'todos' ? { id, label: 'Todos' } : { id, label: byId[id].label }));
  const cards = politicas.map((p) => `<article class="info-card" data-cat="${p.f}" data-mod="${norm(p.mod)}" data-search="${esc(norm(p.t + ' ' + p.d + ' ' + p.cat))}">
          <div class="info-card__top"><span class="info-card__cat"><i class="cat-dot"></i>${p.cat}</span><span class="pill">${p.mod}</span></div>
          <h3>${p.t}</h3>
          <p>${p.d}</p>
          <div class="info-card__foot">${LINKS.politicas[p.t] ? `<a class="more" href="${LINKS.politicas[p.t]}"${EXT}>${fig('pointer')}Saiba Mais</a>` : '<span class="more more--none"></span>'}</div>
        </article>`).join('\n        ');

  const content = `${banner('politicas', 'bnHub', '', 'POLÍTICAS PÚBLICAS')}

      <section class="sec sec--first">
        <h2 class="sec-h">Onde a família precisa de apoio?</h2>
        <p class="lead">Encontre políticas, programas e serviços que podem apoiar as famílias em sua jornada de <strong>SuperAção SP</strong>. As oportunidades estão organizadas nos módulos <strong>Proteger, Desenvolver e Incluir</strong> e agrupadas por temas, para facilitar a busca a partir das necessidades identificadas.</p>
        <p class="lead">As famílias podem acessar oportunidades de diferentes módulos ao mesmo tempo, de acordo com suas necessidades e com as metas definidas no Plano de Desenvolvimento Familiar (PDF).</p>
      </section>

      <div class="callout callout--blue">
        <p>Para acessar mais informações sobre cada uma das<br>políticas, consulte o <strong>Caderno de Políticas Públicas.</strong></p>
        <a class="btn btn--white" href="${LINKS.geral.cadernoPoliticas}"${EXT}>Clique para acessar</a>
      </div>

      <div class="alert-row">
        ${fig('alerta')}
        <p><strong>Atenção:</strong> a disponibilidade das políticas pode variar conforme o município<br>e a adesão da gestão local. Antes de pactuar uma ação no PDF, verifique<br>no SIGMA se a oportunidade está disponível no território e se a família é elegível.</p>
      </div>
${filterPanel({ placeholder: 'Buscar Política Pública', filtros, rows: [['todos', 'protecao-social', 'educacao', 'saude'], ['formacao', 'trabalho', 'seguranca'], ['moradia', 'cultura', 'familia']], extraClass: 'filter-panel--politicas' })}

      <div class="card-grid" data-filter-list>
        ${cards}
      </div>
      <p class="empty" data-filter-empty hidden>Nenhuma política encontrada para esta busca.</p>`;

  innerPage({ file: 'politicas-publicas.html', title: 'Políticas Públicas — Estação do Agente', bodyClass: 'politicas', active: 'politicas', content });
}

// ---------------------------------------------------------------- TUTORIAIS
function buildTutoriais() {
  const { filtros, videos } = tutoriaisData;
  if (LINKS.tutoriais.length !== videos.length) throw new Error(`links de tutoriais: ${LINKS.tutoriais.length} ≠ ${videos.length} vídeos`);
  const cards = videos.map((v, i) => `<article class="info-card info-card--video" data-cat="${v.cat}" data-search="${esc(norm(v.t + ' ' + v.d + ' ' + v.catLabel))}">
          <span class="info-card__cat info-card__cat--video">${fig('playCircle')}${v.catLabel}</span>
          <h3>${v.t}</h3>
          <p>${v.d}</p>
          <div class="info-card__foot"><a class="more" href="${LINKS.tutoriais[i]}"${EXT}>${fig('pointer')}Clique e assista</a></div>
        </article>`).join('\n        ');
  const content = `${banner('tutoriais', 'bnPlay', '', 'TUTORIAIS SIGMA')}
${filterPanel({ placeholder: 'Buscar vídeo', filtros, rows: [['todos', 'busca', 'ebia', 'geral'], ['diag', 'pdf', 'md', 'agenda'], ['senha', 'sup', 'sigma']], extraClass: 'filter-panel--tutoriais' })}

      <div class="card-grid card-grid--video" data-filter-list>
        ${cards}
      </div>
      <p class="empty" data-filter-empty hidden>Nenhum vídeo encontrado para esta busca.</p>`;
  innerPage({ file: 'tutoriais-sigma.html', title: 'Tutoriais SIGMA — Estação do Agente', bodyClass: 'tutoriais', active: 'tutoriais', content });
}


// Popup "Biblioteca • Legenda" (frames 1989:3246…3331): categorias à esquerda, descrição à direita.
const LEGENDA = [
  ['normativos', 'Normativos', 'Formalizar regras, critérios e diretrizes institucionais do Programa.', 'Documento oficial que regulamenta aspectos do funcionamento, responsabilidades e parâmetros do Programa.', 'Consulta sobre regras formais, definição de responsabilidades, alinhamento institucional e jurídico.'],
  ['manuais', 'Manuais', 'Orientar a atuação completa no Programa, com alinhamento conceitual e operacional.', 'Documento estruturante que reúne conceitos, papéis, diretrizes e orientações práticas de atuação.', 'Formação inicial, consulta geral sobre o Programa, alinhamento de equipes.'],
  ['protocolos', 'Protocolos', 'Padronizar a execução de ações específicas, definindo procedimentos mínimos obrigatórios.', 'Documento que descreve como executar um procedimento ou ação.', 'Situações críticas ou sensíveis, atividades que exigem padrão, execução por diferentes profissionais.'],
  ['instrumentos', 'Instrumentos', 'Registrar, coletar e organizar dados e informações do acompanhamento.', 'Ferramenta aplicada no campo para registro estruturado de dados (formulário, ficha).', 'Coleta de informações, registro de visitas, monitoramento de famílias.'],
  ['guias', 'Guias', 'Apoiar decisões específicas e orientação às famílias.', 'Material de consulta que organiza informações relevantes para uso prático.', 'Dúvidas sobre serviços e políticas, apoio à decisão.'],
];
const legendaModal = () => `
<div class="modal modal--legenda" id="legenda" role="dialog" aria-modal="true" aria-label="Legenda da Biblioteca" hidden>
  <div class="modal__backdrop" data-modal-close></div>
  <div class="modal__box modal__box--legenda">
    <div class="legenda__nav" role="tablist" aria-orientation="vertical">
      ${LEGENDA.map(([id, t], i) => `<button type="button" role="tab" class="legenda__tab${i ? '' : ' is-active'}" aria-selected="${!i}" data-tab="${id}">${t}</button>`).join('\n      ')}
    </div>
    <div class="legenda__body">
      <button type="button" class="btn btn--navy modal__close" data-modal-close>Fechar</button>
      ${LEGENDA.map(([id, , serve, e, usar], i) => `<div class="legenda__panel" data-tab-panel="${id}"${i ? ' hidden' : ''}>
        <h3>Para que serve</h3><p>${serve}</p>
        <h3>O que é</h3><p>${e}</p>
        <h3>Quando usar</h3><p>${usar}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</div>`;

// ---------------------------------------------------------------- BIBLIOTECA
function buildBiblioteca() {
  const { filtros, documentos } = bibliotecaData;
  const docUrl = (d) => {
    const u = LINKS.biblioteca[d.t.replace(/<br>/g, ' ')];
    if (!u) throw new Error('sem link na biblioteca: ' + d.t);
    return u;
  };
  const cards = documentos.map((d) => `<article class="info-card info-card--doc" data-cat="${d.f}" data-search="${esc(norm(d.t.replace(/<br>/g, ' ') + ' ' + d.d))}">
          <h3>${d.t}</h3>
          <p>${d.d}</p>
          <div class="info-card__foot"><a class="more" href="${docUrl(d)}"${EXT}>${fig('pointer')}Saiba Mais</a></div>
        </article>`).join('\n        ');
  const content = `${banner('biblioteca', 'bnLivro', '', 'BIBLIOTECA')}

      <p class="lead lead--intro">Acesse os documentos técnicos que dão suporte à atuação no SuperAção SP — normativos, manuais, fluxos, protocolos, roteiros, instrumentos, relatórios e guias, organizados por tipo.</p>
${filterPanel({ placeholder: 'Buscar documento', filtros, extraClass: 'filter-panel--biblioteca', top: '\n        <div class="filter-panel__top"><button type="button" class="btn btn--outline btn--legenda" data-modal-open="legenda">Legenda</button></div>' })}

      <div class="card-grid card-grid--doc" data-filter-list>
        ${cards}
      </div>
      <p class="empty" data-filter-empty hidden>Nenhum documento encontrado para esta busca.</p>${legendaModal()}`;
  innerPage({ file: 'biblioteca.html', title: 'Biblioteca — Estação do Agente', bodyClass: 'biblioteca', active: 'biblioteca', content });
}

// ---------------------------------------------------------------- LINKS ÚTEIS
function buildLinks() {
  const L = LINKS.linksUteis;
  const links = [
    ['SuperAção SP • Site Oficial', L['SuperAção SP • Site Oficial']],
    ['Portal de Serviços ao Cidadão (Governo<br>do Estado de São Paulo)', L['Portal de Serviços ao Cidadão']],
    ['Sistema Único de Assistência Social<br>(SUAS)', L['Sistema Único de Assistência Social']],
    ['Cadastro Único (CadÚnico)', L['Cadastro Único']],
    ['Acesso ao SIGMA', L['Acesso ao SIGMA']],
  ];
  if (links.some(([, h]) => !h)) throw new Error('link útil sem URL');
  const content = `${banner('links', 'bnLink', '', 'LINKS ÚTEIS')}

      <ul class="link-list">
        ${links.map(([t, href]) => `<li class="link-row"><h2>${t}</h2><a class="btn btn--navy" href="${href}" target="_blank" rel="noopener">clique para acessar</a></li>`).join('\n        ')}
      </ul>`;
  innerPage({ file: 'links-uteis.html', title: 'Links úteis — Estação do Agente', bodyClass: 'links', active: 'links', content });
}

// ---------------------------------------------------------------- MÓDULOS

// Popups "Módulo 1/2/3" (frames 913:7460, 930:2, 942:87 do .fig). Os botões do topo trocam de módulo.
const MODULOS = [
  {
    nome: 'PROTEGER', sub: 'Fortalecer as condições de vida', dur: '6 meses',
    obj: 'conectar a família à rede de serviços públicos locais, identificando demandas de acordo com o Plano de Desenvolvimento Familiar.',
    foco: ['Assistência social', 'Saúde', 'Educação', 'Habitação', 'Segurança alimentar', 'Outros serviços públicos relacionados às necessidades da família'],
    resultado: 'Melhoria nas condições de vida e redução da vulnerabilidade social.',
    inc: `<div class="inc">
          <h3 class="inc__t">Auxílio de Proteção Social<br>e Insegurança Alimentar</h3>
          <p class="inc__val"><strong>R$ 150,33</strong> por pessoa/mês</p>
          <p class="inc__d">Concedido às famílias em situação de insegurança alimentar grave, identificada pela EBIA, e renda familiar per capita inferior a R$ 218 mensais.</p>
          <p class="inc__s">Na Trilha de Superação da Pobreza, o auxílio tem duração de 6 meses, prorrogáveis por mais 6 meses.</p>
        </div>
        <div class="inc">
          <h3 class="inc__t">Incentivo ao Compromisso</h3>
          <p class="inc__val"><strong>R$ 200</strong> parcela única</p>
          <p class="inc__s">Concedido após a conclusão do Plano de Desenvolvimento Familiar.</p>
          <p class="inc__s"><strong>Limitação:</strong> uma vez por família.</p>
        </div>`,
  },
  {
    nome: 'DESENVOLVER', sub: 'Desenvolver conhecimentos e habilidades', dur: '6 meses',
    obj: 'conectar até dois membros da família a oportunidades de educação e qualificação profissional, desenvolvendo competências necessárias para uma inserção produtiva sustentável.',
    foco: ['Educação', 'Qualificação profissional', 'Capacitação profissional', 'Desenvolvimento de habilidades'],
    resultado: 'Aumento de conhecimentos técnicos e habilidades que auxiliem na inserção produtiva e/ou no melhor posicionamento no mundo do trabalho.',
    pode: ['EJA — conclusão do Ensino Fundamental ou Médio;', 'Qualificação profissional com mais de 15 horas;', 'Cursos técnicos.'],
    nao: ['Qualificação com menos de 15 horas;', 'Graduação;', 'Cursinhos preparatórios.'],
    inc: `<div class="inc">
          <p class="inc__lead"><strong>Auxílio para Capacitação Profissional:</strong> Destinado ao Representante Familiar e a mais um membro da família em idade ativa, quando matriculados em cursos contemplados pelo SuperAção SP.</p>
          <div class="inc__row">
            <div><p class="inc__lbl">Trilha presencial</p><p class="inc__val inc__val--sq"><strong>R$ 1.200</strong></p></div>
            <p class="inc__s"><strong>R$ 600</strong> no início do curso;<br><strong>R$ 600</strong> mediante comprovação de frequência.</p>
          </div>
          <div class="inc__row">
            <div><p class="inc__lbl">Trilha online</p><p class="inc__val inc__val--sq"><strong>R$ 600</strong></p></div>
            <div><p class="inc__s">Parcela destinada aos gastos com internet.</p><p class="inc__s">Colocar os prérequisitos para o recebimento (ex: comprovante de matrícula)</p></div>
          </div>
        </div>
        <div class="inc">
          <h3 class="inc__t">Incentivo para Desenvolvimento de Capacidades</h3>
          <p class="inc__val inc__val--tall"><strong>R$ 600</strong> parcela única</p>
          <p class="inc__s">Concedido ao Representante Familiar após a conclusão de pelo menos 80 horas de cursos contemplados pelo Programa de Superação da Pobreza</p>
          <p class="inc__s"><strong>Para receber</strong><br>• Concluir pelo menos 80 horas de cursos contemplados;<br>• Apresentar os certificados ao Agente de Superação SP durante a visita domiciliar.</p>
          <p class="inc__lim">Limitação: uma vez por família.</p>
        </div>`,
  },
  {
    nome: 'INCLUIR', sub: 'Apoiar a inclusão no mundo do trabalho', dur: '12 meses',
    obj: 'propiciar o acesso ao mundo do trabalho, promovendo oportunidades de emprego e apoiando o empreendedorismo e o acesso a crédito, favorecendo a inclusão social e econômica da família.',
    focoIntro: 'Inserção produtiva por meio de:',
    foco: ['Emprego formal;', 'Empreendedorismo.'],
    resultado: 'Maior autonomia financeira por meio do empreendedorismo, da abertura de empresas e/ou da inserção no mundo do trabalho.',
    pode: ['Emprego formal com contrato CLT;', 'Abertura de empresa durante o período do Programa.'],
    nao: ['Emprego informal;', 'Empresa informal.'],
    inc: `<div class="inc">
          <h3 class="inc__t">Incentivo para Inclusão no Mundo do Trabalho</h3>
          <p class="inc__val inc__val--tall"><strong>1 salário mínimo paulista | 2 parcelas</strong></p>
          <p class="inc__s">Concedido ao Representante Familiar após a confirmação da inserção profissional.</p>
          <h4 class="inc__t">1ª parcela</h4>
          <p class="inc__val inc__val--line"><strong>½ salário mínimo paulista</strong></p>
          <p class="inc__s">Para comprovar a inserção, o Representante Familiar apresenta:</p>
          <p class="inc__s">• Carteira de trabalho; ou</p>
          <p class="inc__s">• Comprovação da abertura da empresa após a data de adesão ao Programa.</p>
          <h4 class="inc__t">2ª parcela</h4>
          <p class="inc__val inc__val--line"><strong>½ salário mínimo paulista</strong></p>
          <p class="inc__s">Após <strong>6 meses</strong> da primeira parcela, mediante comprovação de permanência no trabalho:</p>
          <p class="inc__s">Carteira de trabalho com <strong>data atual</strong>; ou</p>
          <p class="inc__s">Comprovação de faturamento da empresa nos últimos 6 meses.</p>
          <p class="inc__s"><strong>Limitação:</strong> uma vez por família.</p>
        </div>`,
  },
];
function modModals() {
  return MODULOS.map((mo, i) => {
    const id = `mod-${i + 1}`;
    const outros = MODULOS.map((o, k) => (k === i ? '' : `<button type="button" class="btn btn--green" data-modal-open="mod-${k + 1}">${o.nome}</button>`)).join('');
    const box = (cls, t, arr) => `<div class="mod-box mod-box--${cls}"><h4>${t}</h4><ul>${arr.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
    return `
<div class="modal modal--mod" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-t" hidden>
  <div class="modal__backdrop" data-modal-close></div>
  <div class="modal__box modal__box--mod">
    <div class="mod-pop__top">
      <div class="mod-pop__intro">
        <h2 id="${id}-t">MÓDULO ${i + 1} • ${mo.nome}</h2>
        <p class="mod-pop__sub">${mo.sub}</p>
        <p class="mod-pop__obj"><strong>Objetivo:</strong> ${mo.obj}</p>
      </div>
      <div class="mod-pop__side">
        <div class="mod-pop__actions">${outros}<button type="button" class="btn btn--navy modal__close" data-modal-close>Fechar</button></div>
        <p class="mod-pop__dur"><span>Duração estimada do módulo</span><strong>${mo.dur}</strong></p>
      </div>
    </div>
    <div class="mod-pop__cols">
      <div class="mod-pop__left">
        <h3>Foco</h3>${mo.focoIntro ? `
        <p class="mod-pop__fi">${mo.focoIntro}</p>` : ''}
        <ul class="mod-pop__foco">${mo.foco.map((f) => `<li>${f}</li>`).join('')}</ul>
        <h3>Resultado esperado</h3>
        <p class="mod-pop__res">${mo.resultado}</p>${mo.pode ? `
        <div class="mod-pop__boxes">${box('sim', 'O que pode entrar', mo.pode)}${box('nao', 'O que não entra', mo.nao)}</div>` : ''}
      </div>
      <div class="mod-pop__right">
        ${mo.inc}
      </div>
    </div>
  </div>
</div>`;
  }).join('');
}

function buildModulos() {
  // círculos, setas e alertas exportados do .fig
  const FLOW = { proteger: 'modFlowProteger', desenvolver: 'modFlowDesenvolver', incluir: 'modFlowIncluir' };
  const CARD = { proteger: 'modCardProteger', desenvolver: 'modCardDesenvolver', incluir: 'modCardIncluir' };
  const circ = (ic, size = 106) => fig(size === 72 ? CARD[ic] : FLOW[ic], 0, 0, 'mod-circle');
  const arrow = fig('modFlowArrow', 0, 0, 'mod-arrow');
  const content = `${banner('modulos', 'bnModulos', '', 'MÓDULOS E INCENTIVOS')}

      <section class="sec sec--first">
        <h2 class="sec-h sec-h--green">Entenda a trajetória</h2>
        <p class="lead">A Trilha de Superação da Pobreza acompanha a família em uma jornada de desenvolvimento<br>organizada em três módulos:</p>
        <div class="mod-flow mod-flow--3">
          <div class="mod-flow__track">${circ('proteger')}${arrow}${circ('desenvolver')}${arrow}${circ('incluir')}</div>
          <div class="mod-flow__labels"><span>Proteger</span><span>Desenvolver</span><span>Incluir</span></div>
        </div>
        <p class="lead">Cada módulo possui um objetivo específico e reúne oportunidades, auxílios e incentivos relacionados às necessidades e aos objetivos definidos no Plano de Desenvolvimento Familiar.</p>
        <p class="lead">Todas as famílias iniciam a trilha no Módulo Proteger. Após o diagnóstico e a construção do Plano de Desenvolvimento Familiar, a família é alocada nos módulos correspondentes às ações e aos incentivos previstos em seu plano.</p>
      </section>

      <section class="sec">
        <h2 class="sec-h sec-h--green">Como funciona a progressão <span class="sec-h__light">Clique nos módulos para saber mais</span></h2>
        <div class="mod-cards">
          <button type="button" class="mod-card" data-modal-open="mod-1">${circ('proteger', 72)}<strong>1 • PROTEGER</strong><span>Fortalecer as<br>condições de vida</span><em>6 meses</em></button>
          <button type="button" class="mod-card" data-modal-open="mod-2">${circ('desenvolver', 72)}<strong>2 • DESENVOLVER</strong><span>Desenvolver conhecimentos<br>e habilidades</span><em>6 meses</em></button>
          <button type="button" class="mod-card" data-modal-open="mod-3">${circ('incluir', 72)}<strong>3 • INCLUIR</strong><span>Apoiar a inclusão<br>no mundo do trabalho</span><em>12 meses</em></button>
        </div>
      </section>

      <section class="sec">
        <h2 class="sec-h sec-h--green">Como funciona a progressão</h2>
        <p class="lead">A trajetória não precisa seguir obrigatoriamente uma única sequência.</p>
        <p class="lead">Também pode haver situações em que diferentes membros da mesma família estejam em<br>módulos diferentes simultaneamente.</p>
        <p class="lead">Além disso, um mesmo membro pode participar de mais de um módulo simultaneamente,<br>quando as condições e o Plano de Desenvolvimento Familiar indicarem essa possibilidade.</p>
      </section>

      <section class="sec">
        <h2 class="sec-h sec-h--green">A família pode:</h2>
        <div class="mod-flow mod-flow--5">
          <div class="mod-flow__track">${circ('proteger')}${arrow}${circ('desenvolver')}${arrow}${circ('incluir')}<span class="mod-or">ou</span>${circ('proteger')}${arrow}${circ('incluir')}</div>
          <div class="mod-flow__labels"><span>Proteger</span><span>Desenvolver</span><span>Incluir</span><span>Proteger</span><span>Incluir</span></div>
        </div>
      </section>

      <section class="sec">
        <h2 class="sec-h sec-h--green">Quando a família pode avançar?</h2>
        <p class="mod-path">Proteger ${fig('modPathChevron')} Desenvolver ${fig('modPathChevron')} Incluir</p>
        <div class="bar-note">
          <p class="bar-note__t">A progressão depende de:</p>
          <ul>
            <li>Ausência dos impedimentos previstos pelo Programa;</li>
            <li>Definição no Plano de Desenvolvimento Familiar.</li>
          </ul>
        </div>
        <div class="bar-note">
          <p class="bar-note__t">A família não pode avançar se apresentar, por exemplo:</p>
          <ul>
            <li>Criança ou adolescente de 4 a 17 anos fora da escola;</li>
            <li>Criança ou adolescente de até 16 anos em situação de trabalho infantil, exceto na condição de aprendiz;</li>
            <li>Representante Familiar impedido de estudar ou trabalhar por necessidade de cuidar de terceiros;</li>
            <li>Representante Familiar que declare estado de saúde ruim ou muito ruim ou esteja em situação de uso abusivo de substâncias psicoativas;</li>
            <li>Ausência de documentação civil básica do Representante Familiar.</li>
          </ul>
        </div>
        <p class="mod-path">Desenvolver ${fig('modPathChevron')} Incluir</p>
        <div class="bar-note"><p>O Representante Familiar deve ter concluído o(s) curso(s) previsto(s) no Plano de<br>Desenvolvimento Familiar.</p></div>
      </section>

      <section class="sec">
        <h2 class="sec-h sec-h--green">Entrada no Incluir</h2>
        <div class="bar-note"><p>Se o Representante Familiar ingressar no mundo do trabalho — por emprego<br>formal ou empreendedorismo —, poderá ocorrer alocação no Módulo Incluir.</p></div>
        <div class="note-box">
          ${fig('modNoteAlert')}
          <div>
            <p class="note-box__t"><strong>ATENÇÃO:</strong> O SIGMA FAZ A CLASSIFICAÇÃO</p>
            <ul>
              <li>O SIGMA informa automaticamente em qual módulo a família está.</li>
              <li>O agente não precisa fazer uma classificação manual.</li>
              <li>A alocação é definida a partir das informações do Plano de Desenvolvimento Familiar e dos critérios estabelecidos pelo Programa.</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="sec">
        <h2 class="sec-h sec-h--green">Como são feitos os pagamentos?</h2>
        <div class="bar-note">
          <p>Todos os auxílios e incentivos são pagos por meio de Poupança Social do Banco do Brasil,<br>em nome do(a) Representante Familiar.</p>
          <p>O Representante Familiar é a referência da família para o recebimento dos auxílios e<br>incentivos quando aplicável.</p>
        </div>
        <div class="note-box note-box--terms">
          ${fig('modNoteAlert')}
          <div>
            <p class="note-box__t"><strong>IMPORTANTE</strong></p>
            <p>O Programa utiliza os termos:</p>
            <div class="term"><span class="term__a">Auxílio</span>${fig('modTermArrow')}<span class="term__b">Ajuda de custo</span></div>
            <div class="term"><span class="term__a">Incentivo</span>${fig('modTermArrow')}<span class="term__b">Condicionado ao cumprimento de critérios</span></div>
            <p>Não utilize esses recursos como sinônimos de benefício, que é contínuo e<br>vinculado a uma política pública.</p>
          </div>
        </div>
      </section>

      <section class="sec">
        <h2 class="sec-h sec-h--navy">Duração da trilha</h2>
        <table class="tbl tbl--duracao">
          <thead><tr><th>Módulo</th><th>Duração estimada</th><th>Resultado esperado</th></tr></thead>
          <tbody>
            <tr><td><button type="button" class="mod-pill" data-modal-open="mod-1">PROTEGER</button></td><td><strong>6 meses</strong></td><td>Melhoria das condições de vida e redução da<br>vulnerabilidade</td></tr>
            <tr><td><button type="button" class="mod-pill" data-modal-open="mod-2">DESENVOLVER</button></td><td><strong>6 meses</strong></td><td>Desenvolvimento de conhecimentos e<br>habilidades</td></tr>
            <tr><td><button type="button" class="mod-pill" data-modal-open="mod-3">INCLUIR</button></td><td><strong>12 meses</strong></td><td>Maior autonomia financeira</td></tr>
          </tbody>
        </table>
        <p class="lead lead--tbl">A Trilha de Superação da Pobreza prevê até <strong>2 anos de permanência</strong>, seguidos de <strong>6 meses de<br>acompanhamento</strong> de concluintes.</p>
      </section>

      <section class="sec sec--last">
        <h2 class="sec-h sec-h--green">Resumo dos auxílios e incentivos</h2>
        <table class="tbl tbl--resumo">
          <thead><tr><th>Auxílio/incentivo</th><th>Valor</th><th>Quem recebe</th><th>Principal condição</th></tr></thead>
          <tbody>
            <tr><td><strong>Auxílio de Proteção Social<br>e Insegurança Alimentar</strong></td><td><strong>R$ 150,33/pessoa/mês</strong></td><td>Conforme critérios</td><td>Insegurança alimentar grave +<br>renda per capita inferior a R$ 218</td></tr>
            <tr><td><strong>Incentivo ao Compromisso</strong></td><td><strong>R$ 200</strong></td><td>Representante Familiar</td><td>Conclusão do PDF</td></tr>
            <tr><td><strong>Auxílio para<br>Capacitação Profissional</strong></td><td><strong>R$ 600<br>ou R$ 1.200</strong></td><td>RF + 1 membro</td><td>Matrícula em curso<br>contemplado</td></tr>
            <tr><td><strong>Incentivo para Desenvolvimento<br>de Capacidades</strong></td><td><strong>R$ 600</strong></td><td>Representante Familiar</td><td>Conclusão<br>de 80h de cursos</td></tr>
            <tr><td><strong>Incentivo para Inclusão<br>no Mundo do Trabalho</strong></td><td><strong>1 salário<br>mínimo paulista</strong></td><td>Representante Familiar</td><td>Inserção e permanência<br>no trabalho</td></tr>
          </tbody>
        </table>
      </section>${modModals()}`;
  innerPage({ file: 'modulos-e-incentivos.html', title: 'Módulos e incentivos — Estação do Agente', bodyClass: 'modulos', active: 'modulos', content });
}

// ---------------------------------------------------------------- FAQ
function buildFaq() {
  const F = LINKS.faq;
  const rows = [
    ['Perguntas e Respostas - Site FGV Projetos', F.perguntas],
    ['Apoio ao Campo - Operação', F.apoioCampo],
    ['Gestão de Pessoas', F.gestaoPessoas],
  ];
  if (rows.some(([, h]) => !h)) throw new Error('FAQ sem link');
  const content = `${banner('faq', 'bnFaq', '', 'PERGUNTAS FREQUENTES (FAQ)')}

      <p class="lead lead--intro">Consulte as principais dúvidas sobre a atuação no SuperAção SP — procedimentos, critérios de elegibilidade, uso do SIGMA, orientações de campo e rotinas de atendimento, organizados por tema.</p>

      <ul class="faq-list">
        ${rows.map(([t, h]) => `<li class="faq-row"><h2>${t}</h2><a class="btn btn--navy" href="${h}"${h.startsWith('http') ? EXT : ''}>Acessar</a></li>`).join('\n        ')}
      </ul>`;
  innerPage({ file: 'faq.html', title: 'Perguntas frequentes (FAQ) — Estação do Agente', bodyClass: 'faq', active: 'faq', content });
}

// ---------------------------------------------------------------- índice da busca do cabeçalho
function buildSearchIndex() {
  const strip = (s) => String(s).replace(/<br>/g, ' ').replace(/<[^>]+>/g, '').replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  const items = [
    { t: 'Home', s: 'Página inicial', h: 'index.html', k: 'home inicio jornada da familia acesse rapidamente' },
    ...etapas.map((e) => ({ t: `${e.kicker} • ${e.title}`, s: 'Jornada da Família', h: e.file, k: [e.kicker, e.title, e.objetivo, ...e.passos].join(' ') })),
    { t: 'Políticas Públicas', s: 'Acesso rápido', h: 'politicas-publicas.html', k: 'politicas publicas programas servicos' },
    { t: 'Tutoriais SIGMA', s: 'Acesso rápido', h: 'tutoriais-sigma.html', k: 'tutoriais sigma videos' },
    { t: 'Biblioteca', s: 'Acesso rápido', h: 'biblioteca.html', k: 'biblioteca documentos manuais protocolos normativos guias instrumentos' },
    { t: 'Links úteis', s: 'Acesso rápido', h: 'links-uteis.html', k: 'links uteis sistemas suas cadunico sigma portal' },
    { t: 'Módulos e incentivos', s: 'Acesso rápido', h: 'modulos-e-incentivos.html', k: 'modulos incentivos proteger desenvolver incluir auxilios pagamentos trilha capacitacao profissional salario minimo' },
    { t: 'Perguntas frequentes (FAQ)', s: 'Acesso rápido', h: 'faq.html', k: 'faq perguntas frequentes respostas duvidas apoio ao campo operacao gestao de pessoas' },
    ...politicasData.politicas.map((p) => ({ t: p.t, s: `Política pública • ${p.cat}`, h: `politicas-publicas.html#${p.f}`, k: `${p.t} ${p.d} ${p.cat}` })),
    ...tutoriaisData.videos.map((v) => ({ t: v.t, s: `Tutorial SIGMA • ${v.catLabel}`, h: `tutoriais-sigma.html#${v.cat}`, k: `${v.t} ${v.d} ${v.catLabel}` })),
    ...bibliotecaData.documentos.map((d) => ({ t: strip(d.t), s: 'Biblioteca', h: `biblioteca.html${d.f ? '#' + d.f : ''}`, k: `${strip(d.t)} ${d.d}` })),
  ].map((it) => ({ t: strip(it.t), s: it.s, h: it.h, k: norm(strip(it.t) + ' ' + strip(it.k)) }));
  fs.writeFileSync(path.join(ROOT, 'assets/js/search-index.js'), '/* gerado por build/build.js */\nwindow.SEARCH_INDEX = ' + JSON.stringify(items) + ';\n');
  console.log('  ✓ assets/js/search-index.js');
}

// ---------------------------------------------------------------- run
console.log('Gerando páginas…');
buildSearchIndex();
buildHome();
etapas.forEach(buildEtapa);
buildPoliticas();
buildTutoriais();
buildBiblioteca();
buildLinks();
buildModulos();
buildFaq();
console.log('Pronto.');
