/* ==========================================================================
   Estação do Agente · estatísticas de uso (anônimas)
   --------------------------------------------------------------------------
   Anota o que as pessoas fazem no site e envia para o servidor da Cloudflare
   (servidor/worker.js), que grava no banco D1. O painel.html mostra os números.

   Não usa cookie. Não guarda nome, e-mail, telefone nem IP. O identificador
   de sessão é aleatório e some quando a aba é fechada.

   Se a constante API estiver vazia, nada é enviado (o site funciona igual).
   ========================================================================== */
(function () {
  'use strict';

  /* ====================== AJUSTE AQUI ====================== */
  var API = 'https://estacao-analytics.beatriz-ribas.workers.dev';
  /* ========================================================= */

  if (!API || location.protocol === 'file:') { window.estTrack = function () {}; return; }

  var sid;
  try {
    sid = sessionStorage.getItem('est_sid');
    if (!sid) {
      sid = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2);
      sessionStorage.setItem('est_sid', sid);
    }
  } catch (e) { sid = Date.now() + '-' + Math.random().toString(36).slice(2); }

  var w = Math.min(screen.width, screen.height), toque = matchMedia('(pointer: coarse)').matches;
  var disp = !toque ? 'computador' : (w < 600 ? 'celular' : 'tablet');

  function track(ev, p) {
    try {
      var corpo = JSON.stringify(Object.assign({ ev: ev, sid: sid, disp: disp, tela: nomeTela(cur) }, p || {}));
      var blob = new Blob([corpo], { type: 'text/plain;charset=UTF-8' });
      if (!navigator.sendBeacon || !navigator.sendBeacon(API + '/ev', blob))
        fetch(API + '/ev', { method: 'POST', body: corpo, keepalive: true }).catch(function () {});
    } catch (e) { /* a coleta nunca pode quebrar o site */ }
  }
  window.estTrack = track;

  /* ---------- nomes legíveis das telas e popups ---------- */
  var NOMES = {};
  try { (IDX || []).forEach(function (it) { NOMES[it.id] = it.title; }); } catch (e) {}
  function nomeTela(id) {
    if (!id || !META[id]) return null;
    if (NOMES[id]) return NOMES[id].replace(/\bsigma\b/gi, 'SIGMA').replace(/\bfaq\b/gi, 'FAQ');
    return META[id].n.replace(/^Tablet\s*[-•]\s*(Campo \(Horizontal\)\s*-\s*)?/, '').replace(/^Popup\s*-\s*/, '');
  }
  function nomeArquivo(u) {
    try {
      var d = decodeURIComponent(decodeURIComponent(u));
      var m = d.match(/([^\/=&]+)\.(mp4|pdf|docx?|xlsx?|pptx?)\b/i);
      return m ? m[1].trim() : null;
    } catch (e) { return null; }
  }
  function tipoLink(u) {
    var h = String(u).toLowerCase();
    if (/\.mp4|stream\.aspx/.test(h)) return 'video';
    if (/\.(pdf|docx?|xlsx?|pptx?)\b|sharepoint/.test(h)) return 'documento';
    if (/wa\.me|whatsapp/.test(h)) return 'whatsapp';
    if (/superacao-ip\.github\.io\/plataforma/.test(h)) return 'oportunidades';
    return 'site';
  }
  function hostDe(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return String(u).slice(0, 80); } }

  /* ---------- 1. visita ---------- */
  setTimeout(function () { track('visitou'); }, 0);

  /* ---------- 2. telas (envolve show) ---------- */
  var ultimaTela = null;
  var _show = show;
  show = function (id) {
    var r = _show.apply(this, arguments);
    if (META[id] && id !== ultimaTela) {
      ultimaTela = id;
      setTimeout(function () { track('viu_tela', { tela: nomeTela(id), item: nomeTela(id) }); }, 200);
    }
    return r;
  };
  setTimeout(function () { if (cur) { ultimaTela = cur; track('viu_tela', { item: nomeTela(cur) }); } }, 50);

  /* ---------- 3. popups (envolve openOverlay) ---------- */
  var _open = openOverlay;
  openOverlay = function (id) {
    var r = _open.apply(this, arguments);
    if (META[id]) track('abriu_popup', { item: nomeTela(id) });
    return r;
  };

  /* ---------- 4. vídeos, documentos e links (envolve run) ---------- */
  var _run = run;
  run = function (acts) {
    try {
      var a = (acts || []).filter(function (x) { return x.k === 'url' && x.u; })[0];
      if (a) {
        var t = tipoLink(a.u), nome = nomeArquivo(a.u);
        if (t === 'video') track('abriu_video', { item: nome || hostDe(a.u), tipo: t });
        else if (t === 'documento') track('abriu_documento', { item: nome || hostDe(a.u), tipo: t });
        else track('abriu_link', { item: t === 'whatsapp' ? 'WhatsApp de apoio' : t === 'oportunidades' ? 'Oportunidades (plataforma)' : hostDe(a.u), tipo: t });
      }
    } catch (e) {}
    return _run.apply(this, arguments);
  };
  // links dentro do texto (<a href>) não passam por run
  document.addEventListener('click', function (e) {
    var l = e.target.closest && e.target.closest('a[href]');
    if (!l || !/^https?:/.test(l.href)) return;
    var t = tipoLink(l.href), nome = nomeArquivo(l.href);
    track(t === 'video' ? 'abriu_video' : t === 'documento' ? 'abriu_documento' : 'abriu_link',
          { item: nome || hostDe(l.href), tipo: t });
  }, true);

  /* ---------- 5. buscas: registra quando a pessoa para de digitar ---------- */
  var timer = null, ultimo = '';
  document.addEventListener('input', function (e) {
    var inp = e.target;
    if (!inp.classList || !inp.classList.contains('sx-in')) return;
    clearTimeout(timer);
    timer = setTimeout(function () {
      var termo = (inp.value || '').trim();
      if (termo.length < 3 || termo.toLowerCase() === ultimo) return;
      ultimo = termo.toLowerCase();
      var global = /Esta[cç][aã]o/.test(inp.getAttribute('aria-label') || '');
      var n;
      if (global) { try { n = gres.length; } catch (er) { n = null; } }
      else {
        var cards = findCards(document.getElementById('app')) || [];
        n = cards.filter(function (c) { return c.style.display !== 'none'; }).length;
      }
      track('buscou', { termo: termo, resultados: n, tipo: global ? 'geral' : 'pagina' });
    }, 1500);
  }, true);

  /* ---------- 6. carrossel da Home ---------- */
  document.addEventListener('pointerup', function () {
    if (window.carMoved) track('deslizou_carrossel');
  }, true);
})();
