// Ícones de linha (viewBox 24x24, traço = currentColor) que replicam os vetores do protótipo.
const P = {
  arrowDot: '<path d="M3 12h10.5"/><path d="m9.5 8 4 4-4 4"/><circle cx="19" cy="12" r="2.2" fill="currentColor" stroke="none"/>',
  cursorClick: '<path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/>',
  hub: '<circle cx="12" cy="4.6" r="2.1"/><circle cx="12" cy="19.4" r="2.1"/><path d="M12 6.7v10.6"/><path d="M3.5 12h17"/><path d="M6.3 9.2 3.5 12l2.8 2.8"/><path d="M17.7 9.2 20.5 12l-2.8 2.8"/>',
  handSwipe: '<path d="M9.5 12.5V7.2a1.6 1.6 0 0 1 3.2 0v4.6"/><path d="M12.7 11.3v-.9a1.6 1.6 0 0 1 3.2 0v1.3"/><path d="M15.9 11.4a1.6 1.6 0 0 1 3.2 0v3.4a7 7 0 0 1-7 7h-1.4a6 6 0 0 1-4.6-2.2l-2.6-3.3a1.6 1.6 0 0 1 2.4-2.1l2.3 2.1"/><path d="M3.2 7.3a6.4 6.4 0 0 1 5-4.6"/><path d="m3 3.6.2 3.7 3.6-.6"/>',
  radar: '<path d="M19.07 4.93A10 10 0 1 0 22 12"/><path d="M16.24 7.76A6 6 0 1 0 18 12"/><circle cx="12" cy="12" r="2"/><path d="m13.4 10.6 6.2-6.2"/>',
  familia: '<circle cx="12" cy="5.2" r="2.4"/><path d="M8.6 11.6a3.4 3.4 0 0 1 6.8 0"/><circle cx="6.8" cy="13.4" r="2.4"/><path d="M2.6 21v-.4a4.2 4.2 0 0 1 8.4 0v.4"/><circle cx="17.2" cy="13.4" r="2.4"/><path d="M13 21v-.4a4.2 4.2 0 0 1 8.4 0v.4"/>',
  lampada: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  estrategia: '<path d="m2.8 3.8 4 4M6.8 3.8l-4 4"/><circle cx="5" cy="18.2" r="2.3"/><path d="m16.6 16.4 4 4M20.6 16.4l-4 4"/><path d="M10 5.2c4.6 0 7.6 2.4 7.6 7.6"/><path d="m15.2 10.6 2.4 2.5 2.5-2.5"/>',
  olho: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3.2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkThin: '<path d="m4.5 12.5 4.8 4.8L19.5 7"/>',
  modulos: '<path d="M4.3 10.8 11.1 8.3v11.5l-6.8 2.5Z"/><path d="M7.6 7.1 14.4 4.6v11.5l-3.3 1.2"/><path d="M10.9 3.9 17.7 1.4v11.5l-3.3 1.2"/>',
  maleta: '<rect width="20" height="14" x="2" y="7" rx="1.6"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  livroAberto: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  play: '<path d="M6.5 3.6 19.5 12 6.5 20.4Z"/>',
  playCircle: '<circle cx="12" cy="12" r="9.5"/><path d="M10 8.2 15.6 12 10 15.8Z"/>',
  busca: '<circle cx="10.8" cy="10.8" r="7.3"/><path d="m21 21-4.9-4.9"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  email: '<rect width="20" height="15" x="2" y="4.5" rx="1.5"/><path d="m2.6 5.6 9.4 7.2 9.4-7.2"/>',
  telefone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  escudo: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  livro: '<path d="M5 19.5v-15A2.5 2.5 0 0 1 7.5 2H19v20H7.5a2.5 2.5 0 0 1 0-5H19"/>',
  capelo: '<path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"/><path d="M6 12.5V18a6 3.2 0 0 0 12 0v-5.5"/>',
  saude: '<path d="M2 12.5h4.2l2.3-5 3.6 10 3-7.2 1.6 2.2H22"/>',
  talheres: '<path d="M3.5 2v7c0 1.1.9 2 2 2h3a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M20.5 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  predio: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/>',
  pessoa: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  casa: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  renda: '<path d="M21 12a9 9 0 1 1-6.2-8.56"/><path d="M14.6 9.4c-.3-.9-1.3-1.5-2.6-1.5-1.5 0-2.6.8-2.6 2s1.1 1.7 2.6 2 2.6.8 2.6 2.1-1.1 2-2.6 2c-1.3 0-2.3-.6-2.6-1.5"/><path d="M12 6.4V8M12 16v1.6"/><path d="M16.5 2.5H21v4.5"/><path d="m21 2.5-5 5"/>',
  alerta: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v6.2"/><path d="M12 16.6h.01"/>',
  sino: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  proteger: '<circle cx="9" cy="7" r="3.3"/><path d="M2.5 20.5v-1.2A5.3 5.3 0 0 1 7.8 14h2.4"/><path d="M18 18.6 15 15.7c-.8-.8-1-2.2-.1-3 .8-.7 2-.6 2.6.2l.5.6.5-.6c.7-.8 1.8-.9 2.6-.2.9.8.7 2.2-.1 3Z"/><path d="M2.5 22.4h19"/>',
  desenvolver: '<path d="m22 6.5-8.5 8.5-5-5L2 16.5"/><path d="M16 6.5h6v6"/>',
  incluir: '<circle cx="12" cy="5.8" r="2"/><circle cx="7.4" cy="7.9" r="1.7"/><circle cx="16.6" cy="7.9" r="1.7"/><path d="M9 14v-1.8a3 3 0 0 1 6 0V14"/><path d="M5 13v-1.4a2.4 2.4 0 0 1 3-2.3"/><path d="M19 13v-1.4a2.4 2.4 0 0 0-3-2.3"/><path d="M2 12.5 5.6 18c.6.9 1.6 1.5 2.7 1.5H11"/><path d="M22 12.5 18.4 18c-.6.9-1.6 1.5-2.7 1.5H13"/><path d="M11 19.5V22M13 19.5V22"/>',
};

function icon(name, size = 24, extra = '') {
  const body = P[name];
  if (!body) throw new Error('ícone inexistente: ' + name);
  return `<svg class="ico ico-${name}" ${extra} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

// Logo do WhatsApp (balão verde com telefone) usado no bloco "Lembre-se".
const whatsapp = `<svg class="ico-whatsapp" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
  <path d="M20 3.5C10.9 3.5 3.5 10.8 3.5 19.8c0 3.1.9 6 2.4 8.5L3.5 36.5l8.5-2.3c2.4 1.3 5.1 2 8 2 9.1 0 16.5-7.3 16.5-16.3S29.1 3.5 20 3.5Z" fill="#fff"/>
  <path d="M20 6C12.3 6 6 12.2 6 19.8c0 2.8.8 5.4 2.3 7.6l-1.5 5.5 5.7-1.5c2.2 1.4 4.8 2.2 7.5 2.2 7.7 0 14-6.2 14-13.8S27.7 6 20 6Z" fill="#2CB742"/>
  <path d="M15.4 12.6c-.3-.7-.6-.7-.9-.7h-.8c-.3 0-.7.1-1.1.5-.4.4-1.4 1.4-1.4 3.4s1.5 3.9 1.7 4.2c.2.3 2.9 4.6 7.1 6.3 3.5 1.4 4.2 1.1 5 1 .8-.1 2.5-1 2.8-2 .4-1 .4-1.8.3-2-.1-.2-.4-.3-.8-.5s-2.5-1.2-2.8-1.4c-.4-.1-.6-.2-.9.2-.3.4-1.1 1.4-1.3 1.6-.2.3-.5.3-.9.1-.4-.2-1.8-.7-3.4-2.1-1.3-1.1-2.1-2.5-2.3-2.9-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.3 0-.5 0-.7-.1-.2-.8-2.1-1.1-2.8Z" fill="#fff"/>
</svg>`;

// Ícones exportados diretamente da geometria vetorial do .fig (build/data/figma-icons.json).
const FIG = require('./data/figma-icons.json');
function fig(name, w, h, cls = '') {
  let s = FIG[name];
  if (!s) throw new Error('ícone do Figma inexistente: ' + name);
  if (w) s = s.replace(/ width="[^"]*" height="[^"]*"/, ` width="${w}" height="${h || w}"`);
  return s.replace('<svg ', `<svg class="fico fico-${name}${cls ? ' ' + cls : ''}" `);
}

module.exports = { icon, whatsapp, fig, P };
